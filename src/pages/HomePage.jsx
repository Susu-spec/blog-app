import SearchModal from "@/components/shared/SearchModal";
import { Box, Flex, Heading } from "@chakra-ui/react";

export default function HomePage() {
    return (
        <Box>
            <Heading as="h1" size="4xl">
                Home
            </Heading>
            <Flex
                align="center"
                justify="space-between"
                paddingTop={6}
                paddingBottom={12}
            >
                <SearchModal />
            </Flex>
        </Box>
    )
}