
import { beforeEach, describe, expect, it, vi } from "vitest";
import { supabase } from "@/lib/supabase";
import { uploadCoverImage } from "./storage";

const mockUpload = vi.fn();
const mockGetPublicUrl = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabase: {
    storage: {
      from: vi.fn(() => ({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      })),
    },
  },
}));

describe("uploadCoverImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates correct file path and returns public URL", async () => {
    const fakeFile = new File(["content"], "cover.png", { type: "image/png" });
    mockUpload.mockResolvedValueOnce({ error: null });
    mockGetPublicUrl.mockReturnValueOnce({ data: { publicUrl: "http://mock-url" } });

    const result = await uploadCoverImage(fakeFile, "user-123");

    expect(supabase.storage.from).toHaveBeenCalledWith("post-covers");
    expect(mockUpload).toHaveBeenCalledWith(
      expect.stringMatching(/^user-123\/\d+\.png$/),
      fakeFile,
      { upsert: true }
    );
    expect(mockGetPublicUrl).toHaveBeenCalledWith(expect.stringMatching(/^user-123\/\d+\.png$/));
    expect(result).toBe("http://mock-url");
  });

  it("throws error if upload fails", async () => {
    const fakeFile = new File(["content"], "cover.jpg", { type: "image/jpeg" });
    const error = { message: "Upload failed" };
    mockUpload.mockResolvedValueOnce({ error });

    await expect(uploadCoverImage(fakeFile, "user-123")).rejects.toEqual(error);
  });
});
