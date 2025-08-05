import { Box, Container, Flex } from "@chakra-ui/react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Outlet } from "react-router";

export default function Layout() {
    return (
        <Flex direction="column" minHeight="100vh">
            <Navbar />
            <Box flex="1" as="main">
                <Container maxW="6xl" py={8}>
                    <Outlet />
                </Container>
            </Box>
            <Footer />
        </Flex>
    )
}