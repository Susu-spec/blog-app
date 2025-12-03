import { describe, expect, it, vi } from "vitest";
import { uploadCoverImage } from "./storage";
import supabaseMock from "@/tests/__mocks__/supabaseMock"

vi.mock("./supabase", () => ({
  supabase: supabaseMock,
}));


beforeEach(() => {
  vi.clearAllMocks();
});

describe("uploadCoverImage", () => {
  it("uploads a file and returns public URL", async () => {
    const file = new File(["content"], "test.png", { type: "image/png" });

    supabaseMock.storage.from().upload.mockResolvedValue({ error: null });

    const result = await uploadCoverImage(file, "user123");

    expect(result).toContain("https://example.com");
    expect(supabaseMock.storage.from).toHaveBeenCalledWith("post-covers");
    expect(supabaseMock.storage.from().upload).toHaveBeenCalled();
  });

  it("throws if upload fails", async () => {
    supabaseMock.storage.from().upload.mockResolvedValue({
      error: { message: "Upload failed" }
    });

    const file = new File(["content"], "test.png", { type: "image/png" });

    await expect(uploadCoverImage(file, "user123")).rejects.toThrow();
  });
});
