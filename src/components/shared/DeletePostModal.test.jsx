import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";
import DeletePost from "./DeletePostModal";
import { renderWithChakra } from "@/tests/test-utils";


vi.mock("@supabase/auth-helpers-react", () => ({
  useUser: () => ({ user: { id: "user-123" } }),
}));

vi.mock("@/hooks/usePosts", () => ({
  usePosts: () => ({ refetchPosts: mockRefetch }),
}));

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});


const mockEq = vi.fn();
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({
      delete: () => ({
        eq: (col, val) => mockEq(col, val),
      }),
    }),
  },
}));


const mockNavigate = vi.fn();

const { mockToaster } = vi.hoisted(() => ({
  mockToaster: { create: vi.fn() },
}));
vi.mock("@/components/ui/toaster", () => ({ toaster: mockToaster }));

const mockRefetch = vi.fn();




describe("DeletePost", () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
    mockEq.mockResolvedValue({ error: null });
  });

  it("renders delete trigger icon", () => {
    renderWithChakra(<DeletePost postId="123" />);
    expect(screen.getByTestId("delete-post")).toBeInTheDocument();
  });

  it("opens dialog when trigger clicked", async () => {
    renderWithChakra(<DeletePost postId="123" />);
    fireEvent.click(screen.getByTestId("delete-post"));
    const deleteButton = await screen.findByRole("button", { name: "Delete" });
    fireEvent.click(deleteButton);
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /delete/i })).toBeInTheDocument();
    });
    expect(
      screen.getByText("Are you sure want to delete this post?")
    ).toBeInTheDocument();
  });

  it("shows spinner when loading", async () => {
    mockEq.mockResolvedValueOnce({ error: null });
    renderWithChakra(<DeletePost postId="123" />);
    fireEvent.click(screen.getByTestId("delete-post"));
    const deleteButton = await screen.findByRole("button", { name: "Delete" });
    fireEvent.click(deleteButton);
    expect(await screen.findByRole("loading")).toBeInTheDocument();
  });

  it("calls supabase delete and shows success toaster", async () => {
    mockEq.mockResolvedValueOnce({ error: null });
    renderWithChakra(<DeletePost postId="123" />);
    fireEvent.click(screen.getByTestId("delete-post"));
    const deleteButton = await screen.findByRole("button", { name: "Delete" });
    fireEvent.click(deleteButton);
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockEq).toHaveBeenCalledWith("id","123");
      expect(mockToaster.create).toHaveBeenCalledWith(
        expect.objectContaining({ description: "Post deleted..." })
      );
      expect(mockNavigate).toHaveBeenCalledWith("/my-posts");
    });
  });

  it("shows error toaster if supabase fails", async () => {
    mockEq.mockResolvedValueOnce({ error: { message: "fail" } });

    renderWithChakra(<DeletePost postId="123" />);
    fireEvent.click(screen.getByTestId("delete-post"));

    const deleteButton = await screen.findByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockToaster.create).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Error", description: "fail" })
      );
    });
  });


  it("closes dialog when cancel clicked", async () => {
    renderWithChakra(<DeletePost postId="123" />);
    fireEvent.click(screen.getByTestId("delete-post"));
    const deleteButton = await screen.findByRole("button", { name: "Delete" });
    fireEvent.click(deleteButton);
    fireEvent.click(screen.getByText("Cancel"));
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
    });
  });
});
