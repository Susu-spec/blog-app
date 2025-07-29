import { Box, Container, Flex } from "@chakra-ui/react";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout({ children }) {
    return (
        <Flex direction="column" minHeight="100vh">
            <Navbar />
            <Box flex="1" as="main">
                <Container maxW="6xl" py={8}>
                    {children}
                </Container>
            </Box>
            <Footer />
        </Flex>
    )
}