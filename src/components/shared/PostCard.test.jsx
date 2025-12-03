import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PostCard from "./PostCard";
import DeletePost from "@/components/shared/DeletePostModal";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { renderWithProviders } from "@/tests/test-utils";

// ---- MOCKS ----
vi.mock("@/hooks/useAuth");
vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}));
vi.mock("@/components/shared/DeletePost", () => ({
  __esModule: true,
  default: ({ postId }) => <div data-testid="delete-post-btn">Delete {postId}</div>,
}));

describe("PostCard", () => {
  const mockNavigate = vi.fn();

  const post = {
    id: "p1",
    slug: "my-post",
    title: "Test Title",
    description: "Test Description",
    author_id: "author-123",
    author_name: "Susu",
    cover_image: "/cover.jpg",
    created_at: "2025-10-31T12:00:00Z",
    author: { id: "author-123", name: "Susu" },
    content: { blocks: [] }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it("navigates to /my-posts/<slug> if user is the author", () => {
    useAuth.mockReturnValue({
      user: { id: "author-123" }, // same as post.author_id
    });

    renderWithProviders(<PostCard post={post} />);

    fireEvent.click(screen.getByTestId("post-card"));

    expect(mockNavigate).toHaveBeenCalledWith("/my-posts/my-post");
  });

  it("navigates to /posts/<slug> if user is NOT the author", () => {
    useAuth.mockReturnValue({
      user: { id: "random-user" },
    });

    renderWithProviders(<PostCard post={post} />);

    fireEvent.click(screen.getByTestId("post-card"));

    expect(mockNavigate).toHaveBeenCalledWith("/posts/my-post");
  });

  it("shows delete button for the author's own post", () => {
    useAuth.mockReturnValue({
      user: { id: "author-123" },
    });

    renderWithProviders(<PostCard post={post} />);

    expect(screen.getByTestId("delete-post-btn")).toBeInTheDocument();
  });

  it("hides delete button if user is NOT the author", () => {
    useAuth.mockReturnValue({
      user: { id: "not-author" },
    });

    renderWithProviders(<PostCard post={post} />);

    expect(screen.queryByTestId("delete-post-btn")).toBeNull();
  });
});
