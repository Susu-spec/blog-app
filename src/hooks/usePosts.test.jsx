import { renderHook } from "@testing-library/react";
import { usePosts } from "./usePosts";
import { PostsContext } from "@/providers/PostsProvider";
import { describe, it } from "vitest";

describe("usePosts", () => {
  it("throws error when used outside PostsProvider", () => {
    expect(() => renderHook(() => usePosts())).toThrow(
      "usePosts must be used within PostsProvider"
    );
  });


  it("returns context when used inside PostsProvider", () => {
    const mockContext = { posts: [{ id: "1", title: "Test Post" }], refetchPosts: vi.fn() };
    const wrapper = ({ children }) => (
      <PostsContext.Provider value={mockContext}>
        {children}
      </PostsContext.Provider>
    );

    const { result } = renderHook(() => usePosts(), { wrapper });
    expect(result.current).toBe(mockContext);
    expect(result.current.posts[0].title).toBe("Test Post");
  });
});
