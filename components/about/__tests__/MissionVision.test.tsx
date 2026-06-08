import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import { MissionVision } from "@/components/about/missionVission/AboutMissionVision";
import enMessages from "@/messages/en.json";

// ---------------------------------------------------------------------------
// Shared mutable references
// ---------------------------------------------------------------------------

const mockHydrated = vi.hoisted(() => vi.fn<() => boolean>());

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock("@/lib/theme/ThemeContext", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
    resolvedTheme: "light",
    themes: ["light", "dark", "system"],
  }),
}));

vi.mock("@/hooks/useHydrated", () => ({
  useHydrated: () => mockHydrated(),
}));

// next/image is replaced with a plain img that forwards props we care about
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill,
    priority,
    fetchPriority,
    className,
    sizes,
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    fetchPriority?: string;
    className?: string;
    sizes?: string;
  }) => (
    <img
      src={src}
      alt={alt}
      data-fill={fill ? "true" : "false"}
      data-priority={priority ? "true" : "false"}
      fetchPriority={fetchPriority}
      className={className}
      sizes={sizes}
    />
  ),
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("MissionVision", () => {
  describe("when mounted", () => {
    it("renders mission title and description", () => {
      mockHydrated.mockReturnValue(true);
      render(<MissionVision locale="en" />);

      expect(
        screen.getByText(enMessages.about.mission.title),
      ).toBeInTheDocument();
      expect(
        screen.getByText(enMessages.about.mission.description),
      ).toBeInTheDocument();
    });

    it("renders vision title and description", () => {
      mockHydrated.mockReturnValue(true);
      render(<MissionVision locale="en" />);

      expect(
        screen.getByText(enMessages.about.vision.title),
      ).toBeInTheDocument();
      expect(
        screen.getByText(enMessages.about.vision.description),
      ).toBeInTheDocument();
    });

    it("renders the logo image (light theme by default)", () => {
      mockHydrated.mockReturnValue(true);
      render(<MissionVision locale="en" />);

      const img = screen.getByAltText("ShineTechData");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute(
        "src",
        "/images/about/about-light.webp",
      );
    });

    it("includes sizes attribute on the image for responsive loading", () => {
      mockHydrated.mockReturnValue(true);
      render(<MissionVision locale="en" />);

      const img = screen.getByAltText("ShineTechData");
      expect(img).toHaveAttribute(
        "sizes",
        "(max-width: 1024px) 100vw, 50vw",
      );
    });

    it("renders exactly two content sections (mission + vision)", () => {
      mockHydrated.mockReturnValue(true);
      render(<MissionVision locale="en" />);

      // Verify both mission and vision content is present
      expect(
        screen.getByText(enMessages.about.mission.title),
      ).toBeInTheDocument();
      expect(
        screen.getByText(enMessages.about.vision.title),
      ).toBeInTheDocument();
    });

    it("about image has fetchpriority='high' for LCP priority", () => {
      mockHydrated.mockReturnValue(true);
      render(<MissionVision locale="en" />);
      const img = screen.getByAltText("ShineTechData");
      expect(img.getAttribute("fetchpriority")).toBe("high");
    });

    it("about image retains priority marker for preload scanning", () => {
      mockHydrated.mockReturnValue(true);
      render(<MissionVision locale="en" />);
      const img = screen.getByAltText("ShineTechData");
      expect(img.getAttribute("data-priority")).toBe("true");
    });
  });

  describe("when not mounted (SSR state)", () => {
    it("renders a skeleton placeholder instead of the image", () => {
      mockHydrated.mockReturnValue(false);
      const { container } = render(<MissionVision locale="en" />);

      // Skeleton uses animate-pulse
      const skeleton = container.querySelector(".animate-pulse");
      expect(skeleton).toBeInTheDocument();
    });

    it("still renders mission and vision text content", () => {
      mockHydrated.mockReturnValue(false);
      render(<MissionVision locale="en" />);

      expect(
        screen.getByText(enMessages.about.mission.title),
      ).toBeInTheDocument();
      expect(
        screen.getByText(enMessages.about.vision.title),
      ).toBeInTheDocument();
    });
  });
});
