import { describe, expect, it, vi } from "vitest";
import { savePost } from "./post";

vi.mock("./supabase", () => ({
  supabase: supabaseMock,
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

    expect(supabaseMock.from).toHaveBeenCalledWith("posts");
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

    expect(supabaseMock.from().update).toHaveBeenCalled();
    expect(supabaseMock.from().update().eq).toHaveBeenCalledWith("id", "abc123");
  });
});