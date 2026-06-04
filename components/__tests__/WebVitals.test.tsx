import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

const { mockReportWebVitals } = vi.hoisted(() => ({
  mockReportWebVitals: vi.fn(),
}));

vi.mock("@/lib/web-vitals", () => ({
  reportWebVitals: mockReportWebVitals,
}));

import WebVitals from "@/components/WebVitals";

describe("WebVitals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    const { container } = render(<WebVitals />);
    // WebVitals renders no visible DOM — it only has side effects
    expect(container).toBeTruthy();
  });

  it("calls reportWebVitals on mount", () => {
    render(<WebVitals />);
    expect(mockReportWebVitals).toHaveBeenCalled();
  });

  it("renders nothing visible", () => {
    const { container } = render(<WebVitals />);
    expect(container.firstChild).toBeNull();
  });
});
