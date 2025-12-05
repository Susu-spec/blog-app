import { render, screen } from "@testing-library/react";
import PostList from "./PostList";
import { vi } from "vitest";
import { renderWithChakra } from "@/tests/test-utils";

// Mock PostCard so we don’t need its full implementation
vi.mock("./PostCard", () => ({
  default: ({ post }) => <div data-testid="post-card">{post.title}</div>
}));

describe("PostList", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
});

  it("renders empty state when no posts", () => {
    renderWithChakra(<PostList posts={[]} />);
    expect(screen.getByText("No posts available.")).toBeInTheDocument();
  });


  it("renders posts in pairs", () => {
    const posts = [
      { id: "1", title: "Post 1" },
      { id: "2", title: "Post 2" },
      { id: "3", title: "Post 3" },
      { id: "4", title: "Post 4" }
    ];
    renderWithChakra(<PostList posts={posts} />);
    const cards = screen.getAllByTestId("post-card");
    expect(cards.map(c => c.textContent)).toEqual(["Post 1", "Post 2", "Post 3", "Post 4"]);
  });


  it("renders divider when there is a next post", () => {
    const posts = [
      { id: "1", title: "Post 1" },
      { id: "2", title: "Post 2" }
    ];
    renderWithChakra(<PostList posts={posts} />);
    expect(screen.getByRole("separator", { hidden: true })).toBeInTheDocument();
  });


  it("renders empty space when odd number of posts", () => {
    const posts = [
      { id: "1", title: "Post 1" },
      { id: "2", title: "Post 2" },
      { id: "3", title: "Post 3" }
    ];
    renderWithChakra(<PostList posts={posts} />);
    expect(screen.getByText("Post 3")).toBeInTheDocument();
    expect(screen.getByTestId("empty-box")).toBeInTheDocument();
  });
});
