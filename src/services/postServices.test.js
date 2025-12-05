import { fetchAllPostsFromApi, fetchMyPostsFromApi, fetchPostFromApi } from "@/services/postServices";
import { vi } from "vitest";
import { supabase } from "@/lib/supabase";

describe("postServices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches all posts", async () => {
    const mockOrder = vi.fn().mockReturnValue("allPostsResult");
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    supabase.from = mockFrom;

    const result = await fetchAllPostsFromApi();

    expect(mockFrom).toHaveBeenCalledWith("posts");
    expect(mockSelect).toHaveBeenCalledWith("*, author:author_id(name)");
    expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(result).toBe("allPostsResult");
  });

  it("fetches my posts by userId", async () => {
    const mockEq = vi.fn().mockReturnValue({ order: vi.fn().mockReturnValue("myPostsResult") });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    supabase.from = mockFrom;

    const result = await fetchMyPostsFromApi("user123");
    expect(mockFrom).toHaveBeenCalledWith("posts");
    expect(mockEq).toHaveBeenCalledWith("author_id", "user123");
    expect(result).toBe("myPostsResult");
  });

  it("fetches a single post by slug", async () => {
    const mockEq = vi.fn().mockReturnValue({ single: vi.fn().mockReturnValue("postResult") });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    supabase.from = mockFrom;

    const result = await fetchPostFromApi("slug-99");
    expect(mockFrom).toHaveBeenCalledWith("posts");
    expect(mockEq).toHaveBeenCalledWith("slug", "slug-99");
    expect(result).toBe("postResult");
  });
});
