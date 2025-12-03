import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { usePosts } from "./usePosts";
import { PostsProvider } from "@/providers/PostsProvider";

describe("usePosts", () => {
  it("throws outside provider", () => {
    expect(() => renderHook(() => usePosts()))
      .toThrow("usePosts must be used within PostsProvider");
  });

  it("returns context inside provider", () => {
    const wrapper = ({ children }) => (
      <PostsProvider>{children}</PostsProvider>
    );

    const { result } = renderHook(() => usePosts(), { wrapper });

    expect(result.current).toHaveProperty("fetchAllPosts");
    expect(result.current).toHaveProperty("fetchMyPosts");
    expect(result.current).toHaveProperty("allPosts");
  });
});
