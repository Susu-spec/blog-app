import { PostsContext } from "@/providers/PostsProvider";
import { useContext } from "react";

/**
 * Custom React hook to access blog post data.
 * Must be used within a `<PostsProvider>`.
 *
 * @throws {Error} If called outside of a PostsProvider.
 * @returns {PostsContextType} The posts context object.
 */
export function usePosts() {
    const context = useContext(PostsContext);
    if (!context) {
        throw new Error('usePosts must be used within PostsProvider');
    }
    return context;
}