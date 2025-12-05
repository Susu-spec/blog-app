import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react"
import DeletePost from "@/components/shared/DeletePostModal";
import { renderWithChakra } from "@/tests/test-utils";
import PostCard from "./PostCard";
import { useNavigate } from "react-router";

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user-123" } }),
}));

vi.mock("@supabase/auth-helpers-react", () => ({
  useUser: () => ({ user: { id: "user-123" } }),
}));

const mockRefetch = vi.fn();
vi.mock("@/hooks/usePosts", () => ({
  usePosts: () => ({ refetchPosts: mockRefetch }),
}));

describe("PostCard", () => {
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

  const basePost = {
    id: "1",
    slug: "test-slug",
    title: "Test Title",
    description: "Test Description",
    author_id: "user-123",
    author_name: "Jane Doe",
    cover_image: "cover.jpg",
    created_at: "2025-01-01T00:00:00Z",
    author: { id: "user-123" },
    content: { blocks: [] },
  };

  it("renders title and description", () => {
    renderWithChakra(<PostCard post={basePost} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("shows skeleton when no cover image", () => {
    renderWithChakra(<PostCard post={{ ...basePost, cover_image: null }} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("shows DeletePost if user is author", () => {
    renderWithChakra(<PostCard post={basePost} />);
    expect(screen.getByTestId("delete-post")).toBeInTheDocument();
  });

  it("navigates to /my-posts/:slug if user is author", () => {
    const navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);

    renderWithChakra(<PostCard post={basePost} />);
    fireEvent.click(screen.getByTestId("post-card"));
    expect(navigate).toHaveBeenCalledWith("/my-posts/test-slug");
  });

  it("navigates to /posts/:slug if user is not author", () => {
    const navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);

    const post = { ...basePost, author_id: "other-user", author: { id: "other-user" } };
    renderWithChakra(<PostCard post={post} />);
    fireEvent.click(screen.getByTestId("post-card"));
    expect(navigate).toHaveBeenCalledWith("/posts/test-slug");
  });
});
