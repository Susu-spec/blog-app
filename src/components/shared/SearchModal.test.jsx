import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SearchModal from "./SearchModal";
import { renderWithProviders } from "@/tests/test-utils";


vi.mock("lodash.debounce", () => ({
  default: (fn) => fn,
}));

vi.mock("@/components/ui/dialog", () => ({
  Dialog: {
    Root: ({ children }) => <div>{children}</div>,
    Trigger: ({ children }) => <div>{children}</div>,
    Backdrop: () => <div />,
    Positioner: ({ children }) => <div>{children}</div>,
    Content: ({ children }) => <div>{children}</div>,
    Body: ({ children }) => <div>{children}</div>,
  },
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }) => (
    <button {...props}>{children}</button>
  ),
}));

// Mock react-router Link so it doesn't navigate
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    Link: ({ children }) => <div>{children}</div>,
  };
});

describe("SearchModal filtering", () => {
  const posts = [
    { id: "1", title: "Hello World", slug: "hello-world" },
    { id: "2", title: "React Tips", slug: "react-tips" },
    { id: "3", title: "Javascript Guide", slug: "js-guide" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows all posts by default when query is empty", () => {
    renderWithProviders(<SearchModal posts={posts} loading={false} />);

    const results = screen.getAllByText(/hello world|react tips|javascript guide/i);
    expect(results).toHaveLength(3);
  });

  it("filters posts based on search query", () => {
    renderWithProviders(<SearchModal posts={posts} loading={false} />);

    const input = screen.getByPlaceholderText(/search now/i);

    fireEvent.change(input, { target: { value: "react" } });

    expect(screen.getByText("React Tips")).toBeInTheDocument();
    expect(screen.queryByText("Hello World")).toBeNull();
    expect(screen.queryByText("Javascript Guide")).toBeNull();
  });

  it("is case-insensitive when filtering", () => {
    renderWithProviders(<SearchModal posts={posts} loading={false} />);

    const input = screen.getByPlaceholderText(/search now/i);

    fireEvent.change(input, { target: { value: "WORLD" } });

    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("shows 'No results found' when no post matches query", () => {
    renderWithProviders(<SearchModal posts={posts} loading={false} />);

    const input = screen.getByPlaceholderText(/search now/i);

    fireEvent.change(input, { target: { value: "qwerty" } });

    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it("shows spinner when loading", () => {
    renderWithProviders(<SearchModal posts={posts} loading={true} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
