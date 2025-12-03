import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { usePosts } from "@/hooks/usePosts";
import { useNavigate } from "react-router";
import { toaster } from "@/components/ui/toaster";
import DeletePost from "./DeletePostModal";
import supabaseMock from "@/tests/__mocks__/supabaseMock"
import { useAuth } from "@/hooks/useAuth";
import { renderWithProviders } from "@/tests/test-utils";

vi.mock("@/hooks/useAuth");
vi.mock("@/hooks/usePosts");
vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: supabaseMock,
}));

vi.mock("@/components/ui/toaster", () => ({
  toaster: { create: vi.fn() },
}));

describe("DeletePost", () => {
  const mockNavigate = vi.fn();
  const mockRefetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useAuth.mockReturnValue({
      user: { id: "user-123" },
    });

    usePosts.mockReturnValue({
      refetchPosts: mockRefetch,
    });

    useNavigate.mockReturnValue(mockNavigate);
  });

  it("opens the dialog on trigger click", () => {
    renderWithProviders(<DeletePost postId="abc123" />);

    // Trigger is an icon, so click it
    const trigger = screen.getByTestId("delete-post-trigger");
    fireEvent.click(trigger);

    expect(
      screen.getByText(/are you sure want to delete this post/i)
    ).toBeInTheDocument();
  });

  it("deletes the post successfully", async () => {
    supabaseMock.eq.mockResolvedValue({ error: null });

    renderWithProviders(<DeletePost postId="abc123" />);

    // open dialog
    fireEvent.click(screen.getByTestId("delete-post-trigger"));

    fireEvent.click(screen.getByTestId("delete-post-button"));

    // wait for promise resolution
    await waitFor(() => {
      expect(supabaseMock.from).toHaveBeenCalledWith("posts");
      expect(supabaseMock.delete).toHaveBeenCalled();
      expect(supabaseMock.eq).toHaveBeenCalledWith("id", "abc123");
    });

    expect(mockRefetch).toHaveBeenCalledWith("user-123");
    expect(mockNavigate).toHaveBeenCalledWith("/my-posts");

    expect(toaster.create).toHaveBeenCalledWith({
      description: "Post deleted...",
      type: "info",
    });
  });

  it("handles delete error", async () => {
    supabaseMock.eq.mockResolvedValue({ error: { message: "Fail" } });

    renderWithProviders(<DeletePost postId="abc123" />);

    fireEvent.click(screen.getByTestId("delete-post-trigger"));

    fireEvent.click(screen.getByTestId("delete-post-button"));

    await waitFor(() => {
      expect(toaster.create).toHaveBeenCalledWith({
        title: "Error",
        description: "Fail",
        type: "error",
      });
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
