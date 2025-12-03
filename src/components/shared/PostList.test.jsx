import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PostList from "./PostList";
import PostCard from "@/components/shared/PostCard";
import { renderWithProviders } from "@/tests/test-utils";

// Mock PostCard to avoid rendering the entire component
vi.mock("@/components/shared/PostCard", () => ({
  __esModule: true,
  default: ({ post }) => (
    <div data-testid="post-card">{post.title}</div>
  ),
}));

describe("PostList", () => {

  it("renders empty state when no posts exist", () => {
    renderWithProviders(<PostList posts={[]} />);
    expect(screen.getByText(/no posts available/i)).toBeInTheDocument();
  });

  it("renders one PostCard when posts length = 1", () => {
    const posts = [
      { id: "1", title: "Post 1" },
    ];

    renderWithProviders(<PostList posts={posts} />);

    const cards = screen.getAllByTestId("post-card");
    expect(cards).toHaveLength(1);
    expect(cards[0]).toHaveTextContent("Post 1");
  });

  it("renders two PostCards in a pair with a divider", () => {
    const posts = [
      { id: "1", title: "Post 1" },
      { id: "2", title: "Post 2" },
    ];

    renderWithProviders(<PostList posts={posts} />);

    const cards = screen.getAllByTestId("post-card");
    expect(cards).toHaveLength(2);

    const dividers = screen.getAllByRole("separator", { hidden: true });
    expect(dividers).toHaveLength(1);
  });

  it("renders correct number of pairs and dividers for 3 posts", () => {
    const posts = [
      { id: "1", title: "Post 1" },
      { id: "2", title: "Post 2" },
      { id: "3", title: "Post 3" },
    ];

    renderWithProviders(<PostList posts={posts} />);

    const cards = screen.getAllByTestId("post-card");
    expect(cards).toHaveLength(3);

    // Only 1 divider (between post 1 & 2)
    const dividers = screen.getAllByRole("separator", { hidden: true });
    expect(dividers).toHaveLength(1);
  });

  it("renders correct number of pairs and dividers for 4 posts", () => {
    const posts = [
      { id: "1", title: "Post 1" },
      { id: "2", title: "Post 2" },
      { id: "3", title: "Post 3" },
      { id: "4", title: "Post 4" },
    ];

    renderWithProviders(<PostList posts={posts} />);

    const cards = screen.getAllByTestId("post-card");
    expect(cards).toHaveLength(4);

    // Divider between pair 1-2 and pair 3-4 → 2 dividers
    const dividers = screen.getAllByRole("separator", { hidden: true });
    expect(dividers).toHaveLength(2);
  });
});
