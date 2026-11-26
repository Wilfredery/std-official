import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AnalysisRequestForm } from "../AnalysisRequestForm";

vi.mock("@/lib/i18n/navigation", () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));

describe("AnalysisRequestForm", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  async function fill(email: string) {
    const user = userEvent.setup();
    render(<AnalysisRequestForm lang="es" />);
    await user.type(screen.getByLabelText("Nombre"), "Ana Pérez");
    await user.type(screen.getByLabelText("Correo de tu empresa"), email);
    await user.upload(screen.getByLabelText("Archivo de ventas"), new File(["product,revenue\n"], "ventas.csv"));
    await user.click(screen.getByRole("button", { name: "Enviar mis datos" }));
  }

  it("blocks free email providers before sending anything", async () => {
    await fill("ana@gmail.com");
    expect(screen.getByRole("alert")).toHaveTextContent(/correo de tu empresa/);
    expect(screen.getByLabelText("Correo de tu empresa")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Correo de tu empresa")).toHaveFocus();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends the form with its language and thanks the reader", async () => {
    await fill("ana@ferreteriaelsol.com");
    expect(fetchMock).toHaveBeenCalledWith("/api/analysis-request/", expect.objectContaining({ method: "POST" }));
    const body = fetchMock.mock.calls[0][1].body as FormData;
    expect(body.get("lang")).toBe("es");
    expect(body.get("email")).toBe("ana@ferreteriaelsol.com");
    expect(await screen.findByRole("status")).toHaveTextContent("ana@ferreteriaelsol.com");
  });

  it("shows the server's reason when it rejects the request", async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ error: "file_type" }), { status: 400 }));
    await fill("ana@ferreteriaelsol.com");
    expect(await screen.findByText(/debe ser Excel/)).toBeInTheDocument();
  });
});
