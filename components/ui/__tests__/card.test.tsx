import { describe, it, expect } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card body</Card>);
    expect(screen.getByText("Card body")).toBeInTheDocument();
  });

  it('has data-slot="card" attribute', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.querySelector('[data-slot="card"]');
    expect(card).toBeInTheDocument();
  });

  it("applies rounded-xl and bg-card classes", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.querySelector('[data-slot="card"]');
    expect(card?.className).toContain("rounded-xl");
    expect(card?.className).toContain("bg-card");
  });
});

describe("CardHeader", () => {
  it("renders children", () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText("Header content")).toBeInTheDocument();
  });

  it('has data-slot="card-header" attribute', () => {
    const { container } = render(<CardHeader>Title</CardHeader>);
    const header = container.querySelector('[data-slot="card-header"]');
    expect(header).toBeInTheDocument();
  });

  it("applies px-4 class", () => {
    const { container } = render(<CardHeader>Title</CardHeader>);
    const header = container.querySelector('[data-slot="card-header"]');
    expect(header?.className).toContain("px-4");
  });
});

describe("CardTitle", () => {
  it("renders children", () => {
    render(<CardTitle>My Title</CardTitle>);
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });

  it('has data-slot="card-title" attribute', () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    const title = container.querySelector('[data-slot="card-title"]');
    expect(title).toBeInTheDocument();
  });

  it("applies font-medium class", () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    const title = container.querySelector('[data-slot="card-title"]');
    expect(title?.className).toContain("font-medium");
  });
});

describe("CardDescription", () => {
  it("renders children", () => {
    render(<CardDescription>A description</CardDescription>);
    expect(screen.getByText("A description")).toBeInTheDocument();
  });

  it('has data-slot="card-description" attribute', () => {
    const { container } = render(<CardDescription>Desc</CardDescription>);
    const desc = container.querySelector('[data-slot="card-description"]');
    expect(desc).toBeInTheDocument();
  });

  it("applies text-muted-foreground class", () => {
    const { container } = render(<CardDescription>Desc</CardDescription>);
    const desc = container.querySelector('[data-slot="card-description"]');
    expect(desc?.className).toContain("text-muted-foreground");
  });
});

describe("CardContent", () => {
  it("renders children", () => {
    render(<CardContent>Body text</CardContent>);
    expect(screen.getByText("Body text")).toBeInTheDocument();
  });

  it('has data-slot="card-content" attribute', () => {
    const { container } = render(<CardContent>Content</CardContent>);
    const content = container.querySelector('[data-slot="card-content"]');
    expect(content).toBeInTheDocument();
  });

  it("applies px-4 class", () => {
    const { container } = render(<CardContent>Content</CardContent>);
    const content = container.querySelector('[data-slot="card-content"]');
    expect(content?.className).toContain("px-4");
  });
});

describe("CardFooter", () => {
  it("renders children", () => {
    render(<CardFooter>Footer actions</CardFooter>);
    expect(screen.getByText("Footer actions")).toBeInTheDocument();
  });

  it('has data-slot="card-footer" attribute', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    const footer = container.querySelector('[data-slot="card-footer"]');
    expect(footer).toBeInTheDocument();
  });

  it("applies border-t and rounded-b-xl classes", () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    const footer = container.querySelector('[data-slot="card-footer"]');
    expect(footer?.className).toContain("border-t");
    expect(footer?.className).toContain("rounded-b-xl");
  });
});

describe("CardAction", () => {
  it("renders children", () => {
    render(<CardAction>⚙️</CardAction>);
    expect(screen.getByText("⚙️")).toBeInTheDocument();
  });

  it('has data-slot="card-action" attribute', () => {
    const { container } = render(<CardAction>Action</CardAction>);
    const action = container.querySelector('[data-slot="card-action"]');
    expect(action).toBeInTheDocument();
  });
});

describe("Card composition", () => {
  it("renders a full card with header, title, description, content, and footer", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>This is a sample card</CardDescription>
        </CardHeader>
        <CardContent>Main content here</CardContent>
        <CardFooter>Footer actions</CardFooter>
      </Card>
    );

    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(screen.getByText("This is a sample card")).toBeInTheDocument();
    expect(screen.getByText("Main content here")).toBeInTheDocument();
    expect(screen.getByText("Footer actions")).toBeInTheDocument();
  });

  it("renders CardAction inside CardHeader alongside CardTitle", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardAction>⭐</CardAction>
        </CardHeader>
      </Card>
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("⭐")).toBeInTheDocument();
  });
});
