import PostList from "@/components/shared/PostList";
import SearchModal from "@/components/shared/SearchModal";
import { posts } from "@/data/posts";
import { usePosts } from "@/hooks/usePosts";
import { Box, Flex, Heading } from "@chakra-ui/react";

export default function HomePage() {
    const { posts, loading } = usePosts();
    // console.log(posts);

    if (loading) return <p>Loading posts...</p>;

    return (
        <Box>
            <Heading as="h1" size="4xl">
                Now
            </Heading>
            <Box
                paddingTop={6}
                paddingBottom={12}
            >
                <SearchModal />
            </Box>
            {/* <PostList posts={posts}/> */}
        </Box>
    )
}