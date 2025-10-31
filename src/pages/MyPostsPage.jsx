import PageWrapper from "@/components/layout/PageWrapper";
import Loader from "@/components/shared/Loader";
import PostList from "@/components/shared/PostList";
import SearchModal from "@/components/shared/SearchModal";
import { useAuth } from "@/providers/AuthProvider";
import { usePosts } from "@/providers/PostsProvider";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { useEffect } from "react";

/**
 * MyPostsPage — displays a list of all published blog posts belonging to the current user.
 *
 * Fetches posts via the `usePosts()` hook passed the current's user `id` and renders them
 * using the `PostList` component.
 *
 * @page
 * @route /my-posts
 * @protected true
 *
 * @returns {JSX.Element} The `my-posts` page displaying a list of posts.
 */


export default function MyPostsPage() {
    const { user, error } = useAuth();
    const { myPosts, loading, fetchMyPosts } = usePosts(user?.id);

    useEffect(() => {
        if (user?.id) {
            fetchMyPosts(user?.id);
        }
    }, [fetchMyPosts, user?.id]);

    if (loading) return <Loader />

    return (
        <Box>
            <Heading as="h1" size="4xl">
                All Your Posts
            </Heading>
            <Box
                paddingTop={6}
                paddingBottom={12}
            >
                <SearchModal posts={myPosts} loading={loading} />
            </Box>
            <PostList posts={myPosts} />
        </Box>
    )
}