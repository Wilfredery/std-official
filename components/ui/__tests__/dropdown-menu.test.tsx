import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

// ---------------------------------------------------------------------------
// Base UI Menu mock — mirror the pattern used for button.test.tsx
// ---------------------------------------------------------------------------

vi.mock("@base-ui/react/menu", () => {
  const BaseMenuItem = ({
    children,
    className,
    ...props
  }: {
    children?: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }) => (
    <div className={className} data-testid="menu-item-primitive" {...props}>
      {children}
    </div>
  );

  const BaseMenuCheckboxItem = ({
    children,
    className,
    ...props
  }: {
    children?: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }) => (
    <div className={className} data-testid="menu-checkbox-item-primitive" {...props}>
      {children}
    </div>
  );

  const BaseMenuRadioItem = ({
    children,
    className,
    ...props
  }: {
    children?: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }) => (
    <div className={className} data-testid="menu-radio-item-primitive" {...props}>
      {children}
    </div>
  );

  return {
    Menu: {
      Root: ({
        children,
        ...props
      }: {
        children?: React.ReactNode;
        [key: string]: unknown;
      }) => (
        <div data-testid="menu-root-primitive" {...props}>
          {children}
        </div>
      ),
      Portal: ({
        children,
        ...props
      }: {
        children?: React.ReactNode;
        [key: string]: unknown;
      }) => (
        <div data-testid="menu-portal-primitive" {...props}>
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
        <button data-testid="menu-trigger-primitive" {...props}>
          {children}
        </button>
      ),
      Positioner: ({
        children,
        className,
        ...props
      }: {
        children?: React.ReactNode;
        className?: string;
        [key: string]: unknown;
      }) => (
        <div className={className} data-testid="menu-positioner-primitive" {...props}>
          {children}
        </div>
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
        <div className={className} data-testid="menu-popup-primitive" {...props}>
          {children}
        </div>
      ),
      Group: ({
        children,
        ...props
      }: {
        children?: React.ReactNode;
        [key: string]: unknown;
      }) => (
        <div data-testid="menu-group-primitive" {...props}>
          {children}
        </div>
      ),
      GroupLabel: ({
        children,
        className,
        ...props
      }: {
        children?: React.ReactNode;
        className?: string;
        [key: string]: unknown;
      }) => (
        <div className={className} data-testid="menu-grouplabel-primitive" {...props}>
          {children}
        </div>
      ),
      Item: BaseMenuItem,
      SubmenuRoot: ({
        children,
        ...props
      }: {
        children?: React.ReactNode;
        [key: string]: unknown;
      }) => (
        <div data-testid="menu-submenu-root-primitive" {...props}>
          {children}
        </div>
      ),
      SubmenuTrigger: ({
        children,
        className,
        ...props
      }: {
        children?: React.ReactNode;
        className?: string;
        [key: string]: unknown;
      }) => (
        <div className={className} data-testid="menu-submenu-trigger-primitive" {...props}>
          {children}
        </div>
      ),
      CheckboxItem: BaseMenuCheckboxItem,
      CheckboxItemIndicator: ({
        children,
        ...props
      }: {
        children?: React.ReactNode;
        [key: string]: unknown;
      }) => (
        <span data-testid="menu-checkbox-indicator-primitive" {...props}>
          {children}
        </span>
      ),
      RadioGroup: ({
        children,
        ...props
      }: {
        children?: React.ReactNode;
        [key: string]: unknown;
      }) => (
        <div data-testid="menu-radio-group-primitive" {...props}>
          {children}
        </div>
      ),
      RadioItem: BaseMenuRadioItem,
      RadioItemIndicator: ({
        children,
        ...props
      }: {
        children?: React.ReactNode;
        [key: string]: unknown;
      }) => (
        <span data-testid="menu-radio-indicator-primitive" {...props}>
          {children}
        </span>
      ),
      Separator: ({
        className,
        ...props
      }: {
        className?: string;
        [key: string]: unknown;
      }) => (
        <hr className={className} data-testid="menu-separator-primitive" {...props} />
      ),
    },
  };
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("DropdownMenu", () => {
  // ── Smoke: each sub-component renders ──────────────────────────

  it("renders DropdownMenu with data-slot attribute", () => {
    render(
      <DropdownMenu>
        <span>content</span>
      </DropdownMenu>,
    );
    const root = screen.getByTestId("menu-root-primitive");
    expect(root).toBeInTheDocument();
    expect(root.getAttribute("data-slot")).toBe("dropdown-menu");
  });

  it("renders DropdownMenuPortal with data-slot attribute", () => {
    render(
      <DropdownMenuPortal>
        <span>portal</span>
      </DropdownMenuPortal>,
    );
    const portal = screen.getByTestId("menu-portal-primitive");
    expect(portal).toBeInTheDocument();
    expect(portal.getAttribute("data-slot")).toBe("dropdown-menu-portal");
  });

  it("renders DropdownMenuTrigger with data-slot attribute", () => {
    render(
      <DropdownMenuTrigger>
        Open
      </DropdownMenuTrigger>,
    );
    const trigger = screen.getByTestId("menu-trigger-primitive");
    expect(trigger).toBeInTheDocument();
    expect(trigger.getAttribute("data-slot")).toBe("dropdown-menu-trigger");
    expect(trigger).toHaveTextContent("Open");
  });

  it("renders DropdownMenuContent with composed className and data-slot", () => {
    render(<DropdownMenuContent />);
    const popup = screen.getByTestId("menu-popup-primitive");
    expect(popup).toBeInTheDocument();
    expect(popup.getAttribute("data-slot")).toBe("dropdown-menu-content");
    // Should include cn() default classes
    expect(popup.className).toContain("z-50");
    expect(popup.className).toContain("rounded-lg");
  });

  it("appends custom className to DropdownMenuContent", () => {
    render(<DropdownMenuContent className="custom-menu" />);
    const popup = screen.getByTestId("menu-popup-primitive");
    expect(popup.className).toContain("custom-menu");
    // Default classes still present
    expect(popup.className).toContain("bg-popover");
  });

  it("renders DropdownMenuItem with default variant classes", () => {
    render(<DropdownMenuItem>Profile</DropdownMenuItem>);
    const item = screen.getByTestId("menu-item-primitive");
    expect(item).toBeInTheDocument();
    expect(item.getAttribute("data-slot")).toBe("dropdown-menu-item");
    expect(item.getAttribute("data-variant")).toBe("default");
    expect(item).toHaveTextContent("Profile");
    // Should have base item classes
    expect(item.className).toContain("cursor-default");
    expect(item.className).toContain("rounded-md");
  });

  it("renders DropdownMenuItem with destructive variant", () => {
    render(<DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>);
    const item = screen.getByTestId("menu-item-primitive");
    expect(item.getAttribute("data-variant")).toBe("destructive");
    expect(item.className).toContain("data-[variant=destructive]:text-destructive");
  });

  it("renders DropdownMenuItem with inset attribute", () => {
    render(<DropdownMenuItem inset>Indented</DropdownMenuItem>);
    const item = screen.getByTestId("menu-item-primitive");
    // data-inset should be set to true
    expect(item.getAttribute("data-inset")).not.toBeNull();
    expect(item.className).toContain("data-inset:pl-7");
  });

  it("renders DropdownMenuLabel with inset classes", () => {
    render(<DropdownMenuLabel inset>Section</DropdownMenuLabel>);
    const label = screen.getByTestId("menu-grouplabel-primitive");
    expect(label).toBeInTheDocument();
    expect(label.getAttribute("data-slot")).toBe("dropdown-menu-label");
    expect(label.getAttribute("data-inset")).not.toBeNull();
    expect(label.className).toContain("data-inset:pl-7");
    expect(label).toHaveTextContent("Section");
  });

  it("renders DropdownMenuSeparator with data-slot and classes", () => {
    render(<DropdownMenuSeparator />);
    const sep = screen.getByTestId("menu-separator-primitive");
    expect(sep).toBeInTheDocument();
    expect(sep.getAttribute("data-slot")).toBe("dropdown-menu-separator");
    expect(sep.className).toContain("h-px");
    expect(sep.className).toContain("bg-border");
  });

  it("renders DropdownMenuShortcut with data-slot and classes", () => {
    render(<DropdownMenuShortcut>⌘K</DropdownMenuShortcut>);
    const shortcut = screen.getByText("⌘K");
    expect(shortcut).toBeInTheDocument();
    expect(shortcut.getAttribute("data-slot")).toBe("dropdown-menu-shortcut");
    expect(shortcut.className).toContain("tracking-widest");
  });

  it("renders DropdownMenuGroup with data-slot", () => {
    render(
      <DropdownMenuGroup>
        <span>group</span>
      </DropdownMenuGroup>,
    );
    const group = screen.getByTestId("menu-group-primitive");
    expect(group).toBeInTheDocument();
    expect(group.getAttribute("data-slot")).toBe("dropdown-menu-group");
  });

  it("renders DropdownMenuCheckboxItem with indicator", () => {
    render(
      <DropdownMenuCheckboxItem checked>
        Autosave
      </DropdownMenuCheckboxItem>,
    );
    const item = screen.getByTestId("menu-checkbox-item-primitive");
    expect(item).toBeInTheDocument();
    expect(item.getAttribute("data-slot")).toBe("dropdown-menu-checkbox-item");
    expect(item).toHaveTextContent("Autosave");
    // Indicator should render (contains CheckIcon)
    expect(screen.getByTestId("menu-checkbox-indicator-primitive")).toBeInTheDocument();
  });

  it("renders DropdownMenuRadioGroup + DropdownMenuRadioItem with indicator", () => {
    render(
      <DropdownMenuRadioGroup>
        <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>,
    );
    const group = screen.getByTestId("menu-radio-group-primitive");
    expect(group).toBeInTheDocument();
    expect(group.getAttribute("data-slot")).toBe("dropdown-menu-radio-group");

    const items = screen.getAllByTestId("menu-radio-item-primitive");
    expect(items).toHaveLength(2);
    expect(items[0].getAttribute("data-slot")).toBe("dropdown-menu-radio-item");
    expect(items[0]).toHaveTextContent("Light");
    expect(items[1]).toHaveTextContent("Dark");

    // Each radio item has an indicator
    const indicators = screen.getAllByTestId("menu-radio-indicator-primitive");
    expect(indicators).toHaveLength(2);
  });

  it("renders DropdownMenuSub + SubTrigger + SubContent chain", () => {
    render(
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Email</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>,
    );
    // Sub root
    expect(screen.getByTestId("menu-submenu-root-primitive")).toBeInTheDocument();
    expect(screen.getByTestId("menu-submenu-root-primitive").getAttribute("data-slot")).toBe(
      "dropdown-menu-sub",
    );

    // Sub trigger — should contain chevron icon text (check by class or sibling)
    const subTrigger = screen.getByTestId("menu-submenu-trigger-primitive");
    expect(subTrigger).toBeInTheDocument();
    expect(subTrigger.getAttribute("data-slot")).toBe("dropdown-menu-sub-trigger");
    expect(subTrigger).toHaveTextContent("Share");

    // Sub content uses DropdownMenuContent internally, renders as popup
    expect(screen.getByTestId("menu-popup-primitive")).toBeInTheDocument();
    expect(screen.getByTestId("menu-popup-primitive").getAttribute("data-slot")).toBe(
      "dropdown-menu-sub-content",
    );
  });

  // ── Full assembly smoke test ───────────────────────────────────

  it("renders a full dropdown assembly: trigger → content → items", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Account</DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>,
    );

    // All primitives mounted
    expect(screen.getByTestId("menu-root-primitive")).toBeInTheDocument();
    expect(screen.getByTestId("menu-trigger-primitive")).toHaveTextContent("Account");
    expect(screen.getByTestId("menu-grouplabel-primitive")).toHaveTextContent("My Account");
    expect(screen.getByTestId("menu-group-primitive")).toBeInTheDocument();

    const separators = screen.getAllByTestId("menu-separator-primitive");
    expect(separators).toHaveLength(2);

    // Three menu items + separator count
    const items = screen.getAllByTestId("menu-item-primitive");
    expect(items).toHaveLength(4); // Profile, Billing, Settings, Log out
    expect(items[0]).toHaveTextContent("Profile");
    expect(items[3]).toHaveTextContent("Log out");
    expect(items[3].getAttribute("data-variant")).toBe("destructive");
  });

  // ── Edge: className composition ────────────────────────────────

  it("DropdownMenuSeparator appends custom className", () => {
    render(<DropdownMenuSeparator className="my-sep" />);
    const sep = screen.getByTestId("menu-separator-primitive");
    expect(sep.className).toContain("my-sep");
    expect(sep.className).toContain("h-px");
  });

  it("DropdownMenuShortcut appends custom className", () => {
    render(<DropdownMenuShortcut className="extra-shortcut">⌘S</DropdownMenuShortcut>);
    const el = screen.getByText("⌘S");
    expect(el.className).toContain("extra-shortcut");
    expect(el.className).toContain("tracking-widest");
  });

  it("DropdownMenuLabel renders without inset by default", () => {
    render(<DropdownMenuLabel>Label</DropdownMenuLabel>);
    const label = screen.getByTestId("menu-grouplabel-primitive");
    expect(label.getAttribute("data-inset")).toBeNull();
  });

  it("DropdownMenuItem renders without inset by default (no data-inset)", () => {
    render(<DropdownMenuItem>Item</DropdownMenuItem>);
    const item = screen.getByTestId("menu-item-primitive");
    expect(item.getAttribute("data-inset")).toBeNull();
  });

  it("DropdownMenuContent forwards side/align props to Positioner", () => {
    render(
      <DropdownMenuContent side="top" align="end" alignOffset={8} sideOffset={12}>
        <span>content</span>
      </DropdownMenuContent>,
    );
    const positioner = screen.getByTestId("menu-positioner-primitive");
    expect(positioner).toBeInTheDocument();
    expect(positioner.getAttribute("side")).toBe("top");
    expect(positioner.getAttribute("align")).toBe("end");
    expect(positioner.getAttribute("alignoffset")).toBe("8");
    expect(positioner.getAttribute("sideoffset")).toBe("12");
  });
});
