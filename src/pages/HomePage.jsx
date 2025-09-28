import PageWrapper from "@/components/layout/PageWrapper";
import Loader from "@/components/shared/Loader";
import PostList from "@/components/shared/PostList";
import SearchModal from "@/components/shared/SearchModal";
import { usePosts } from "@/hooks/usePosts";
import { Box, Flex, Heading } from "@chakra-ui/react";

export default function HomePage() {
    const { posts, loading, getPosts } = usePosts();

    if (loading) return <Loader />

    return (
        <PageWrapper>
            <Box>
                <Heading as="h1" size="4xl">
                    Now
                </Heading>
                <Box
                    paddingTop={6}
                    paddingBottom={12}
                >
                    <SearchModal posts={posts} loading={loading}/>
                </Box>
                <PostList posts={posts} getPosts={getPosts} />
            </Box>
        </PageWrapper>
    )
}