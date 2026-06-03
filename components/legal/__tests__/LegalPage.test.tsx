import { describe, it, expect } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import { LegalPage } from "@/components/legal/LegalPage";

describe("LegalPage", () => {
  it("renders page title as h1", () => {
    render(<LegalPage namespace="privacy" />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(/Privacy Policy|Política de Privacidad/);
  });

  it("renders last updated badge", () => {
    render(<LegalPage namespace="privacy" />);
    expect(screen.getByText(/Last updated|Última actualización/)).toBeInTheDocument();
  });

  it("renders table of contents title", () => {
    render(<LegalPage namespace="privacy" />);
    expect(screen.getByText(/Contents|Contenido/)).toBeInTheDocument();
  });

  it("renders section headings as h2", () => {
    render(<LegalPage namespace="privacy" />);
    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s.length).toBeGreaterThan(0);
  });

  it("renders bullet lists for each section", () => {
    render(<LegalPage namespace="privacy" />);
    const lists = screen.getAllByRole("list");
    // There should be at least the TOC list + section lists
    expect(lists.length).toBeGreaterThan(1);
  });

  it("renders article landmark", () => {
    render(<LegalPage namespace="privacy" />);
    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("renders navigation for table of contents", () => {
    render(<LegalPage namespace="privacy" />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders privacy content correctly", () => {
    render(<LegalPage namespace="privacy" />);
    // Check that at least one privacy-specific bullet is rendered
    expect(screen.getByText(/Datos de contacto directo|Direct contact data/)).toBeInTheDocument();
  });

  it("renders terms content correctly", () => {
    render(<LegalPage namespace="terms" />);
    // Check that at least one terms-specific bullet is rendered
    expect(
      screen.getByText(/reverse engineering|ingeniería inversa/),
    ).toBeInTheDocument();
  });

  it("uses correct namespace for terms", () => {
    render(<LegalPage namespace="terms" />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(
      /Terms and Conditions of Use|Términos y Condiciones de Uso/,
    );
  });
});
