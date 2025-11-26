import { supabase } from "@/lib/supabase";
import { describe, expect, it, vi } from "vitest";
import { savePost } from "./post";

vi.mock("./supabase", () => ({
  supabase: {
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: "https://example.com/file.jpg" } }))
      }))
    },
    from: vi.fn(() => ({
      update: vi.fn(() => ({ select: vi.fn() })),
      insert: vi.fn(() => ({ select: vi.fn() })),
      eq: vi.fn()
    }))
  }
}));


beforeEach(() => {
  vi.clearAllMocks();
});


describe("savePost", () => {
  it("creates a new post", async () => {
    const values = {
      title: "My Post",
      description: "Desc",
      content: "Body",
      id: undefined
    };

    const user = { id: "user123" };
    const coverUrl = "https://example.com/test.jpg";

    await savePost(values, user, coverUrl);

    expect(supabase.from).toHaveBeenCalledWith("posts");
  });

  it("updates an existing post", async () => {
    const values = {
      id: "abc123",
      title: "Updated",
      description: "Desc",
      content: "Content"
    };

    const user = { id: "user123" };
    const coverUrl = "url";

    await savePost(values, user, coverUrl);

    expect(supabase.from().update).toHaveBeenCalled();
    expect(supabase.from().update().eq).toHaveBeenCalledWith("id", "abc123");
  });
});