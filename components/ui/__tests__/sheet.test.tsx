import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

// ---------------------------------------------------------------------------
// Mock @base-ui/react/dialog to isolate custom wrapper logic
// ---------------------------------------------------------------------------

vi.mock("@base-ui/react/dialog", () => {
  const BaseDialogClose = ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <button data-testid="dialog-close-primitive" {...props}>
      {children}
    </button>
  );

  return {
    Dialog: {
      Root: ({
        children,
        ...props
      }: {
        children?: React.ReactNode;
        [key: string]: unknown;
      }) => (
        <div data-testid="dialog-root-primitive" {...props}>
          {children}
        </div>
      ),
      Trigger: ({
        children,
        ...props
      }: {
        children?: React.ReactNode;
        [key: string]: unknown;
      }) => (
        <button data-testid="dialog-trigger-primitive" {...props}>
          {children}
        </button>
      ),
      Close: BaseDialogClose,
      Portal: ({
        children,
        ...props
      }: {
        children?: React.ReactNode;
        [key: string]: unknown;
      }) => (
        <div data-testid="dialog-portal-primitive" {...props}>
          {children}
        </div>
      ),
      Backdrop: ({
        className,
        ...props
      }: {
        className?: string;
        [key: string]: unknown;
      }) => (
        <div className={className} data-testid="dialog-backdrop-primitive" {...props} />
      ),
      Popup: ({
        children,
        className,
        ...props
      }: {
        children?: React.ReactNode;
        className?: string;
        [key: string]: unknown;
      }) => (
        <div className={className} data-testid="dialog-popup-primitive" {...props}>
          {children}
        </div>
      ),
      Title: ({
        children,
        className,
        ...props
      }: {
        children?: React.ReactNode;
        className?: string;
        [key: string]: unknown;
      }) => (
        <h2 className={className} data-testid="dialog-title-primitive" {...props}>
          {children}
        </h2>
      ),
      Description: ({
        children,
        className,
        ...props
      }: {
        children?: React.ReactNode;
        className?: string;
        [key: string]: unknown;
      }) => (
        <p className={className} data-testid="dialog-description-primitive" {...props}>
          {children}
        </p>
      ),
    },
  };
});

// ---------------------------------------------------------------------------
// Mock Button — SheetContent uses Button for the close trigger
// ---------------------------------------------------------------------------

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    className,
    variant,
    size,
    ...props
  }: {
    children?: React.ReactNode;
    className?: string;
    variant?: string;
    size?: string;
    [key: string]: unknown;
  }) => (
    <button
      className={className}
      data-testid="button-mock"
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Sheet", () => {
  // ── Basic renders ──────────────────────────────────────────────

  it("renders Sheet with data-slot attribute", () => {
    render(
      <Sheet>
        <span>sheet children</span>
      </Sheet>,
    );
    const root = screen.getByTestId("dialog-root-primitive");
    expect(root).toBeInTheDocument();
    expect(root.getAttribute("data-slot")).toBe("sheet");
  });

  it("renders SheetTrigger with data-slot attribute", () => {
    render(<SheetTrigger>Open sheet</SheetTrigger>);
    const trigger = screen.getByTestId("dialog-trigger-primitive");
    expect(trigger).toBeInTheDocument();
    expect(trigger.getAttribute("data-slot")).toBe("sheet-trigger");
    expect(trigger).toHaveTextContent("Open sheet");
  });

  it("renders SheetClose with data-slot attribute", () => {
    render(<SheetClose>Close</SheetClose>);
    const close = screen.getByTestId("dialog-close-primitive");
    expect(close).toBeInTheDocument();
    expect(close.getAttribute("data-slot")).toBe("sheet-close");
  });

  it("renders SheetContent with overlay, popup and close button", () => {
    render(
      <SheetContent>
        <p>Sheet body</p>
      </SheetContent>,
    );
    // Overlay should be present
    expect(screen.getByTestId("dialog-backdrop-primitive")).toBeInTheDocument();
    // Popup should render
    const popup = screen.getByTestId("dialog-popup-primitive");
    expect(popup).toBeInTheDocument();
    expect(popup.getAttribute("data-slot")).toBe("sheet-content");
    expect(popup).toHaveTextContent("Sheet body");
    // Close button renders by default (showCloseButton=true)
    expect(screen.getByTestId("dialog-close-primitive")).toBeInTheDocument();
  });

  // ── Side variant classes ───────────────────────────────────────

  it("applies 'right' side classes (default)", () => {
    render(<SheetContent>Right sheet</SheetContent>);
    const popup = screen.getByTestId("dialog-popup-primitive");
    expect(popup.getAttribute("data-side")).toBe("right");
    // Right-side specific class
    expect(popup.className).toContain("data-[side=right]:inset-y-0");
    expect(popup.className).toContain("data-[side=right]:right-0");
    expect(popup.className).toContain("data-[side=right]:w-3/4");
  });

  it("applies 'top' side classes and data-side attribute", () => {
    render(<SheetContent side="top">Top sheet</SheetContent>);
    const popup = screen.getByTestId("dialog-popup-primitive");
    expect(popup.getAttribute("data-side")).toBe("top");
    expect(popup.className).toContain("data-[side=top]:inset-x-0");
    expect(popup.className).toContain("data-[side=top]:top-0");
    expect(popup.className).toContain("data-[side=top]:h-auto");
    expect(popup.className).toContain("data-[side=top]:border-b");
  });

  it("applies 'bottom' side classes and data-side attribute", () => {
    render(<SheetContent side="bottom">Bottom sheet</SheetContent>);
    const popup = screen.getByTestId("dialog-popup-primitive");
    expect(popup.getAttribute("data-side")).toBe("bottom");
    expect(popup.className).toContain("data-[side=bottom]:inset-x-0");
    expect(popup.className).toContain("data-[side=bottom]:bottom-0");
    expect(popup.className).toContain("data-[side=bottom]:h-auto");
    expect(popup.className).toContain("data-[side=bottom]:border-t");
  });

  it("applies 'left' side classes and data-side attribute", () => {
    render(<SheetContent side="left">Left sheet</SheetContent>);
    const popup = screen.getByTestId("dialog-popup-primitive");
    expect(popup.getAttribute("data-side")).toBe("left");
    expect(popup.className).toContain("data-[side=left]:inset-y-0");
    expect(popup.className).toContain("data-[side=left]:left-0");
    expect(popup.className).toContain("data-[side=left]:h-full");
    expect(popup.className).toContain("data-[side=left]:w-3/4");
    expect(popup.className).toContain("data-[side=left]:border-r");
  });

  // ── showCloseButton prop ───────────────────────────────────────

  it("hides close button when showCloseButton is false", () => {
    render(
      <SheetContent showCloseButton={false}>
        <p>No close</p>
      </SheetContent>,
    );
    // Should NOT render the close button (only the popup + overlay)
    expect(screen.queryByTestId("dialog-close-primitive")).toBeNull();
    expect(screen.getByTestId("dialog-popup-primitive")).toBeInTheDocument();
  });

  // ── Custom className ──────────────────────────────────────────

  it("SheetContent appends custom className", () => {
    render(
      <SheetContent className="custom-sheet">
        <p>Custom</p>
      </SheetContent>,
    );
    const popup = screen.getByTestId("dialog-popup-primitive");
    expect(popup.className).toContain("custom-sheet");
    // Default fixed class still present
    expect(popup.className).toContain("fixed");
  });

  // ── Accessory components ──────────────────────────────────────

  it("renders SheetHeader with data-slot and classes", () => {
    render(
      <SheetHeader>
        <span>header content</span>
      </SheetHeader>,
    );
    const headerEl = document.querySelector('[data-slot="sheet-header"]');
    expect(headerEl).toBeInTheDocument();
    expect(headerEl?.className).toContain("flex");
    expect(headerEl?.className).toContain("flex-col");
    expect(headerEl).toHaveTextContent("header content");
  });

  it("renders SheetFooter with data-slot and mt-auto", () => {
    render(
      <SheetFooter>
        <button>Save</button>
      </SheetFooter>,
    );
    const footerEl = document.querySelector('[data-slot="sheet-footer"]');
    expect(footerEl).toBeInTheDocument();
    expect(footerEl?.className).toContain("mt-auto");
    expect(footerEl?.className).toContain("flex-col");
  });

  it("renders SheetTitle with data-slot, classes, and content", () => {
    render(<SheetTitle>Edit Profile</SheetTitle>);
    const title = screen.getByTestId("dialog-title-primitive");
    expect(title).toBeInTheDocument();
    expect(title.getAttribute("data-slot")).toBe("sheet-title");
    expect(title.className).toContain("text-base");
    expect(title.className).toContain("font-medium");
    expect(title).toHaveTextContent("Edit Profile");
  });

  it("renders SheetDescription with data-slot, classes, and content", () => {
    render(<SheetDescription>Make changes to your profile</SheetDescription>);
    const desc = screen.getByTestId("dialog-description-primitive");
    expect(desc).toBeInTheDocument();
    expect(desc.getAttribute("data-slot")).toBe("sheet-description");
    expect(desc.className).toContain("text-muted-foreground");
    expect(desc).toHaveTextContent("Make changes to your profile");
  });

  // ── Full assembly ─────────────────────────────────────────────

  it("renders a full sheet assembly with header, content, footer", () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Browse sections</SheetDescription>
          </SheetHeader>
          <div>body</div>
          <SheetFooter>
            <button>Action</button>
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    );

    // Trigger renders
    expect(screen.getByTestId("dialog-trigger-primitive")).toBeInTheDocument();
    // Content renders
    const popup = screen.getByTestId("dialog-popup-primitive");
    expect(popup).toBeInTheDocument();
    expect(popup.getAttribute("data-side")).toBe("left");
    // Title + description inside
    expect(screen.getByTestId("dialog-title-primitive")).toHaveTextContent("Navigation");
    expect(screen.getByTestId("dialog-description-primitive")).toHaveTextContent("Browse sections");
  });
});
