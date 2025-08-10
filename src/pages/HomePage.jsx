import PostList from "@/components/shared/PostList";
import SearchModal from "@/components/shared/SearchModal";
import { posts } from "@/data/posts";
import { Box, Flex, Heading } from "@chakra-ui/react";

export default function HomePage() {
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
            <PostList posts={posts}/>
        </Box>
    )
}