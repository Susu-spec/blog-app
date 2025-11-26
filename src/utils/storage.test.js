import { supabase } from "@/lib/supabase";
import { describe, expect, it, vi } from "vitest";
import { uploadCoverImage } from "./storage";

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

describe("uploadCoverImage", () => {
  it("uploads a file and returns public URL", async () => {
    const file = new File(["content"], "test.png", { type: "image/png" });

    supabase.storage.from().upload.mockResolvedValue({ error: null });

    const result = await uploadCoverImage(file, "user123");

    expect(result).toContain("https://example.com");
    expect(supabase.storage.from).toHaveBeenCalledWith("post-covers");
    expect(supabase.storage.from().upload).toHaveBeenCalled();
  });

  it("throws if upload fails", async () => {
    supabase.storage.from().upload.mockResolvedValue({
      error: { message: "Upload failed" }
    });

    const file = new File(["content"], "test.png", { type: "image/png" });

    await expect(uploadCoverImage(file, "user123")).rejects.toThrow();
  });
});
