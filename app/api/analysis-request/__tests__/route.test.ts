// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../route";

const CSV = "product,revenue\nCemento,1200\n";

function request(fields: Record<string, string>, file: File | null = new File([CSV], "ventas.csv")) {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  if (file) form.set("file", file);
  return new Request("http://localhost/api/analysis-request/", { method: "POST", body: form });
}

const valid = { name: "Ana Pérez", company: "Ferretería <El Sol>", email: "Ana@FerreteriaElSol.com", lang: "es" };

describe("POST /api/analysis-request", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("ANALYSIS_FROM", "ShineTechData <analisis@shinetechdata.com>");
    vi.stubEnv("ANALYSIS_INBOX", "");
    fetchMock.mockReset().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const sent = (i: number) => JSON.parse(fetchMock.mock.calls[i][1].body as string);

  it("emails the file to the inbox and a confirmation to the reader", async () => {
    const res = await POST(request(valid));
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const toInbox = sent(0);
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.resend.com/emails");
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer re_test");
    expect(toInbox.to).toEqual(["contact@shinetechdata.com"]);
    expect(toInbox.reply_to).toBe("ana@ferreteriaelsol.com");
    expect(toInbox.html).toContain("Ferretería &lt;El Sol&gt;");
    expect(toInbox.attachments).toEqual([
      { filename: "ventas.csv", content: Buffer.from(CSV).toString("base64") },
    ]);

    const toReader = sent(1);
    expect(toReader.to).toEqual(["ana@ferreteriaelsol.com"]);
    expect(toReader.subject).toMatch(/análisis de Pareto/);
    expect(toReader.attachments).toBeUndefined();
  });

  it("writes the confirmation in English when the post is in English", async () => {
    await POST(request({ ...valid, lang: "en" }));
    expect(sent(1).subject).toMatch(/your Pareto analysis/);
  });

  it.each([
    [{ ...valid, email: "ana@gmail.com" }, "free_email"],
    [{ ...valid, email: "ana@" }, "email"],
    [{ ...valid, name: "" }, "name"],
  ])("rejects %j with %s and sends nothing", async (fields, error) => {
    const res = await POST(request(fields));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a missing file, a wrong extension and a disguised binary", async () => {
    expect(await (await POST(request(valid, null))).json()).toEqual({ error: "file_missing" });
    expect(await (await POST(request(valid, new File(["x"], "v.pdf")))).json()).toEqual({ error: "file_type" });
    const exe = new File([new Uint8Array([0x4d, 0x5a, 0x90, 0])], "ventas.xlsx");
    expect(await (await POST(request(valid, exe))).json()).toEqual({ error: "file_type" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("quietly drops submissions that fill the honeypot", async () => {
    const res = await POST(request({ ...valid, website: "spam.example" }));
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports a server error when the inbox email fails, without confirming", async () => {
    fetchMock.mockResolvedValueOnce(new Response("bad", { status: 422 }));
    const res = await POST(request(valid));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "server" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("refuses to run without the Resend configuration", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const res = await POST(request(valid));
    expect(res.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
