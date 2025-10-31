import PageWrapper from "@/components/layout/PageWrapper";
import Loader from "@/components/shared/Loader";
import PostList from "@/components/shared/PostList";
import SearchModal from "@/components/shared/SearchModal";
import { usePosts } from "@/providers/PostsProvider";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { useEffect } from "react";

/**
 * HomePage — displays a list of all published blog posts.
 *
 * This is the main landing page of the application.
 * Fetches posts via the `usePosts()` hook and renders them
 * using the `PostList` component.
 *
 * @page
 * @route /
 *
 * @returns {JSX.Element} The home page displaying a list of posts.
 */

export default function HomePage() {
    const { allPosts, loading, fetchAllPosts } = usePosts();

    useEffect(() => {
        fetchAllPosts();
    }, [fetchAllPosts])

    
    if (loading) return <Loader />

    return (
        <Box>
            <Heading as="h1" size="4xl">
                Now
            </Heading>
            <Box
                paddingTop={6}
                paddingBottom={12}
            >
                <SearchModal posts={allPosts} loading={loading}/>
            </Box>
            <PostList posts={allPosts} />
        </Box>
    )
}