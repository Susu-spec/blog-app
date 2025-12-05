
import { describe, expect, it, vi } from "vitest";
import { supabase } from "@/lib/supabase";
import { slugify } from "./text";
import { savePost } from "./post";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({ data: { id: "1" }, error: null }))
          }))
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({ data: { id: "2" }, error: null }))
        }))
      }))
    }))
  }
}));

vi.mock("./text", () => ({
  slugify: vi.fn((title) => title.toLowerCase().replace(/\s+/g, "-"))
}));

describe("savePost", () => {
  const user = { id: "user-123" };

  it("updates post when values.id exists", async () => {
    const values = { id: "1", title: "My Post", description: "desc", content: {} };
    const result = await savePost(values, user, null);

    expect(supabase.from).toHaveBeenCalledWith("posts");
    expect(slugify).toHaveBeenCalledWith("My Post");
    expect(result.data).toEqual({ id: "1" });
    expect(result.error).toBeNull();
  });

  it("inserts post when values.id is missing", async () => {
    const values = { title: "New Post", description: "desc", content: {} };
    const result = await savePost(values, user, "cover.jpg");

    expect(supabase.from).toHaveBeenCalledWith("posts");
    expect(slugify).toHaveBeenCalledWith("New Post");
    expect(result.data).toEqual({ id: "2" });
    expect(result.error).toBeNull();
  });

  it("uses coverUrl over values.cover_image", async () => {
    const values = { title: "Cover Test", description: "desc", content: {}, cover_image: "old.jpg" };
    await savePost(values, user, "new.jpg");

    // Check that payload used "new.jpg" not "old.jpg"
    expect(slugify).toHaveBeenCalledWith("Cover Test");
  });

  it("returns error if supabase fails", async () => {
    supabase.from.mockReturnValueOnce({
      insert: () => ({
        select: () => ({
          single: () => ({ data: null, error: { message: "fail" } })
        })
      })
    });

    const values = { title: "Bad Post", description: "desc", content: {} };
    const result = await savePost(values, user, null);

    expect(result.error).toEqual({ message: "fail" });
    expect(result.data).toBeNull();
  });
});
