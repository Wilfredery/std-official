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
});
