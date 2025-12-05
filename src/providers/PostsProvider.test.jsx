import { render, act } from "@testing-library/react";
import { PostsProvider, PostsContext } from "./PostsProvider";
import { vi } from "vitest";

const { mockFetchAll, mockFetchMy, mockFetchPost } = vi.hoisted(() => ({
  mockFetchAll: vi.fn(),
  mockFetchMy: vi.fn(),
  mockFetchPost: vi.fn(),
}));

vi.mock("@/services/postServices", () => ({
  fetchAllPostsFromApi: mockFetchAll,
  fetchMyPostsFromApi: mockFetchMy,
  fetchPostFromApi: mockFetchPost,
}));

vi.mock("@/utils/errors", () => ({
  parseFetchPostsError: (err) => ({ title: "Error", description: err.message }),
}));

const { mockToaster } = vi.hoisted(() => ({
  mockToaster: { create: vi.fn() },
}))

vi.mock("@/components/ui/toaster", () => ({ toaster: mockToaster }));


describe("PostsProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches all posts successfully", async () => {
    vi.useFakeTimers();

    mockFetchAll.mockResolvedValueOnce({
        data: [{ id: 1, title: "This is what I'm talking about" }],
        error: null,
    });

    let context;
    render(
        <PostsProvider>
            <PostsContext.Consumer>{(value) => { context = value; return null; }}</PostsContext.Consumer>
        </PostsProvider>
    );

    await act(async () => { await context.fetchAllPosts(); });

    act(() => {
        vi.runAllTimers();
    });

        expect(context.allPosts[0]).toEqual({ id: 1, title: "This is what I'm talking about" });
        expect(context.loading).toBe(false);

        vi.useRealTimers();
    });


  it("handles error when fetching my posts", async () => {
    mockFetchMy.mockResolvedValueOnce({
    data: null,
    error: { message: "fail" },
    });

    let context;
    render(
        <PostsProvider>
            <PostsContext.Consumer>
                {(value) => { context = value; return null; }}
            </PostsContext.Consumer>
        </PostsProvider>
    );

    await act(async () => { await context.fetchMyPosts("user123"); });

    expect(mockToaster.create).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Error", description: "fail" })
    );
  });

    it("caches post details", async () => {
        mockFetchPost.mockResolvedValueOnce({
            data: { id: 99, title: "Detail Post" },
            error: null,
        });

        let context;
        render(
            <PostsProvider>
                <PostsContext.Consumer>
                {(value) => { context = value; return null; }}
                </PostsContext.Consumer>
            </PostsProvider>
        );

        await act(async () => { await context.fetchPost("slug-99"); });

        expect(context.postDetails["slug-99"]).toEqual({ id: 99, title: "Detail Post" });
    });


    it("returns cached allPosts on second call", async () => {
        mockFetchAll.mockResolvedValueOnce({
            data: [{ id: 1, title: "Cached Post" }],
            error: null,
        });

        let context;
        render(
            <PostsProvider>
            <PostsContext.Consumer>{(value) => { context = value; return null; }}</PostsContext.Consumer>
            </PostsProvider>
        );

        await act(async () => { await context.fetchAllPosts(); });
        await act(async () => { await context.fetchAllPosts(); });

        expect(mockFetchAll).toHaveBeenCalledTimes(1);
        expect(context.allPosts[0]).toEqual({ id: 1, title: "Cached Post" });
    });


    it("returns cached myPosts on second call", async () => {
        mockFetchMy.mockResolvedValueOnce({
            data: [{ id: 2, title: "My Post" }],
            error: null,
        });

        let context;
        render(
            <PostsProvider>
                <PostsContext.Consumer>{(value) => { context = value; return null; }}</PostsContext.Consumer>
            </PostsProvider>
        );

        await act(async () => { await context.fetchMyPosts("user123"); });
        await act(async () => { await context.fetchMyPosts("user123"); });

        expect(mockFetchMy).toHaveBeenCalledTimes(1);
        expect(context.myPosts[0]).toEqual({ id: 2, title: "My Post" });
    });


    it("returns cached post details on second call", async () => {
        mockFetchPost.mockResolvedValueOnce({
            data: { id: 99, title: "Detail Post" },
            error: null,
        });

        let context;
        render(
            <PostsProvider>
                <PostsContext.Consumer>{(value) => { context = value; return null; }}</PostsContext.Consumer>
            </PostsProvider>
        );

        await act(async () => { await context.fetchPost("slug-99"); });
        await act(async () => { await context.fetchPost("slug-99"); });

        expect(mockFetchPost).toHaveBeenCalledTimes(1);
        expect(context.postDetails["slug-99"]).toEqual({ id: 99, title: "Detail Post" });
    });

    it("handles error when fetching a post", async () => {
        mockFetchPost.mockResolvedValueOnce({
            data: null,
            error: { message: "fail" },
        });

        let context;
        render(
            <PostsProvider>
                <PostsContext.Consumer>{(value) => { context = value; return null; }}</PostsContext.Consumer>
            </PostsProvider>
        );

        await act(async () => { await context.fetchPost("slug-error"); });

        expect(mockToaster.create).toHaveBeenCalledWith(
            expect.objectContaining({ title: "Error", description: "fail" })
        );
    });

    it("refetches posts and updates caches", async () => {
        mockFetchAll.mockResolvedValueOnce({
            data: [{ id: 1, title: "All Post" }],
            error: null,
        });
        mockFetchMy.mockResolvedValueOnce({
            data: [{ id: 2, title: "My Post" }],
            error: null,
        });
        mockFetchPost.mockResolvedValueOnce({
            data: { id: 3, title: "Detail Post" },
            error: null,
        });

        let context;
        render(
            <PostsProvider>
                <PostsContext.Consumer>{(value) => { context = value; return null; }}</PostsContext.Consumer>
            </PostsProvider>
        );

        await act(async () => {
            await context.refetchPosts({ userId: "user123", slug: "slug-3" });
        });

        expect(mockFetchAll).toHaveBeenCalled();
        expect(mockFetchMy).toHaveBeenCalledWith("user123");
        expect(mockFetchPost).toHaveBeenCalledWith("slug-3");
        expect(context.allPosts[0]).toEqual({ id: 1, title: "All Post" });
        expect(context.myPosts[0]).toEqual({ id: 2, title: "My Post" });
        expect(context.postDetails["slug-3"]).toEqual({ id: 3, title: "Detail Post" });
    });


    it("invalidates cache", () => {
        let context;
        render(
            <PostsProvider>
                <PostsContext.Consumer>
                    {(value) => { context = value; return null; }}
                </PostsContext.Consumer>
            </PostsProvider>
        );

        act(() => { context.invalidateCache(); });

        expect(context.allPosts).toEqual([]);
        expect(context.myPosts).toEqual([]);
        expect(context.postDetails).toEqual({});
    });
});