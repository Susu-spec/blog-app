import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChakraProvider } from "@chakra-ui/react";
import SearchModal from "./SearchModal";
import { renderWithChakra } from "@/tests/test-utils";

describe("SearchModal", () => {
  beforeAll(() => {
    window.scrollTo = vi.fn();
  });

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

  const posts = [
    { id: "1", title: "Hello World", slug: "hello-world" },
    { id: "2", title: "React Tips", slug: "react-tips" },
    { id: "3", title: "Testing Library", slug: "testing-library" },
  ];

  it("shows spinner when loading is true", () => {
    renderWithChakra(<SearchModal posts={posts} loading={true} />);
    expect(screen.getByRole("loading")).toBeInTheDocument();
  });

  it("renders search trigger button when loading is false", () => {
    renderWithChakra(<SearchModal posts={posts} loading={false} />);
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("displays all posts when search query is empty", async () => {
    renderWithChakra(<SearchModal posts={posts} loading={false} />);
    // Open modal
    userEvent.click(screen.getByRole("button", { name: /search/i }));
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search now...")).toBeInTheDocument();
    });
    posts.forEach((p) => {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    });
  });

  it("filters posts based on search query", async () => {
    renderWithChakra(<SearchModal posts={posts} loading={false} />);
    userEvent.click(screen.getByRole("button", { name: /search/i }));
    const input = await screen.findByPlaceholderText("Search now...");
    await userEvent.type(input, "React");
    await waitFor(() => {
      expect(screen.getByText("React Tips")).toBeInTheDocument();
      expect(screen.queryByText("Hello World")).not.toBeInTheDocument();
    });
  });

  it("performs case-insensitive search", async () => {
    renderWithChakra(<SearchModal posts={posts} loading={false} />);
    userEvent.click(screen.getByRole("button", { name: /search/i }));
    const input = await screen.findByPlaceholderText("Search now...");
    await userEvent.type(input, "hello");
    await waitFor(() => {
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });
  });

  it("shows 'No results found' when no posts match query", async () => {
    renderWithChakra(<SearchModal posts={posts} loading={false} />);
    userEvent.click(screen.getByRole("button", { name: /search/i }));
    const input = await screen.findByPlaceholderText("Search now...");
    await userEvent.type(input, "nonexistent");
    await waitFor(() => {
      expect(screen.getByText("No results found.")).toBeInTheDocument();
    });
  });

  it("handles empty posts array gracefully", async () => {
    renderWithChakra(<SearchModal posts={[]} loading={false} />);
    userEvent.click(screen.getByRole("button", { name: /search/i }));
    const input = await screen.findByPlaceholderText("Search now...");
    await userEvent.type(input, "anything");
    await waitFor(() => {
      expect(screen.getByText("No results found.")).toBeInTheDocument();
    });
  });

  it("handles posts with missing title field", async () => {
    const badPosts = [{ id: "99", slug: "no-title" }];
    renderWithChakra(<SearchModal posts={badPosts} loading={false} />);
    userEvent.click(screen.getByRole("button", { name: /search/i }));
    const input = await screen.findByPlaceholderText("Search now...");

    await waitFor(() => {
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/posts/no-title");
      expect(link).toHaveTextContent("");
    });
  });

  it("clears search when modal is opened", async () => {
    renderWithChakra(<SearchModal posts={posts} loading={false} />);
    userEvent.click(screen.getByRole("button", { name: /search/i }));
    const input = await screen.findByPlaceholderText("Search now...");
    expect(input).toHaveValue("");
  });

  it("renders search trigger button with correct text", () => {
    renderWithChakra(<SearchModal posts={posts} loading={false} />);
    expect(screen.getByText("Search...")).toBeInTheDocument();
  });

  it("renders search input when modal is opened", async () => {
    renderWithChakra(<SearchModal posts={posts} loading={false} />);
    userEvent.click(screen.getByRole("button", { name: /search/i }));
    expect(await screen.findByPlaceholderText("Search now...")).toBeInTheDocument();
  });

  it("renders links for each post result", async () => {
    renderWithChakra(<SearchModal posts={posts} loading={false} />);
    userEvent.click(screen.getByRole("button", { name: /search/i }));
    await waitFor(() => {
      posts.forEach((p) => {
        expect(screen.getByRole("link", { name: p.title })).toHaveAttribute("href", `/posts/${p.slug}`);
      });
    });
  });

  it("handles missing posts prop with default empty array", async () => {
    renderWithChakra(<SearchModal loading={false} />);
    userEvent.click(screen.getByRole("button", { name: /search/i }));
    const input = await screen.findByPlaceholderText("Search now...");
    await userEvent.type(input, "anything");
    await waitFor(() => {
      expect(screen.getByText("No results found.")).toBeInTheDocument();
    });
  });
});
