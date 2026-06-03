import { describe, it, expect } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import Loading from "@/app/[locale]/loading";

describe("Loading (locale-level loading.tsx)", () => {
  it("renders a loading spinner with status role", () => {
    render(<Loading />);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
  });

  it("renders the 'Loading...' text below the spinner", () => {
    render(<Loading />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the loading container centered in the viewport", () => {
    const { container } = render(<Loading />);
    // The outer container should use min-h to fill at least 50% of viewport
    const section = container.firstElementChild as HTMLElement;
    expect(section).toBeInTheDocument();
    expect(section.className).toContain("min-h-[50vh]");
    expect(section.className).toContain("flex");
    expect(section.className).toContain("items-center");
    expect(section.className).toContain("justify-center");
  });
});
