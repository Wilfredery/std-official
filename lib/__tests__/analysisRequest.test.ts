import { describe, it, expect } from "vitest";
import { MAX_FILE_BYTES, contentMatchesExtension, emailError, fileError, nameError } from "@/lib/analysisRequest";

describe("emailError", () => {
  it.each(["ana@ferreteriaelsol.com", "Ana.Perez@Grupo-Rojas.com.do", "  ops@tienda.co.uk "])(
    "accepts the work address %s",
    (email) => expect(emailError(email)).toBeNull(),
  );

  it.each([
    "ana@gmail.com",
    "ana@GMAIL.com",
    "ana@hotmail.es",
    "ana@outlook.com.mx",
    "ana@yahoo.co.uk",
    "ana@live.com",
    "ana@icloud.com",
    "ana@proton.me",
    "ana@claro.net.do",
    "ana@mailinator.com",
  ])("rejects the free or throwaway address %s", (email) => expect(emailError(email)).toBe("free_email"));

  it.each(["", "ana", "ana@", "ana@empresa", "a b@empresa.com", `${"a".repeat(250)}@empresa.com`])(
    "rejects the malformed address %j",
    (email) => expect(emailError(email)).toBe("email"),
  );

  it("does not block business domains that merely contain a provider name", () => {
    expect(emailError("ana@outlookconsulting.com")).toBeNull();
    expect(emailError("ana@mail.gmailtools.io")).toBeNull();
  });
});

describe("nameError", () => {
  it("needs 2 to 100 characters", () => {
    expect(nameError(" A ")).toBe("name");
    expect(nameError("Ana")).toBeNull();
    expect(nameError("a".repeat(101))).toBe("name");
  });
});

describe("fileError", () => {
  it("accepts Excel and CSV within the size limit", () => {
    expect(fileError({ name: "ventas.XLSX", size: 1000 })).toBeNull();
    expect(fileError({ name: "ventas.csv", size: MAX_FILE_BYTES })).toBeNull();
  });

  it("rejects a missing, empty, wrong-type or oversized file", () => {
    expect(fileError(null)).toBe("file_missing");
    expect(fileError({ name: "ventas.csv", size: 0 })).toBe("file_missing");
    expect(fileError({ name: "ventas.pdf", size: 10 })).toBe("file_type");
    expect(fileError({ name: "ventas", size: 10 })).toBe("file_type");
    expect(fileError({ name: "ventas.xlsx", size: MAX_FILE_BYTES + 1 })).toBe("file_size");
  });
});

describe("contentMatchesExtension", () => {
  const zip = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 1, 2]);
  const ole = new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0]);
  const csv = new TextEncoder().encode("product,revenue\nCemento,1200\n");

  it("checks the file signature against the extension", () => {
    expect(contentMatchesExtension("v.xlsx", zip)).toBe(true);
    expect(contentMatchesExtension("v.xls", ole)).toBe(true);
    expect(contentMatchesExtension("v.csv", csv)).toBe(true);
  });

  it("rejects binaries renamed to a spreadsheet extension", () => {
    const exe = new Uint8Array([0x4d, 0x5a, 0x90, 0x00]);
    expect(contentMatchesExtension("v.xlsx", exe)).toBe(false);
    expect(contentMatchesExtension("v.xls", zip)).toBe(false);
    expect(contentMatchesExtension("v.csv", exe)).toBe(false);
    expect(contentMatchesExtension("v.csv", zip)).toBe(false);
  });
});
