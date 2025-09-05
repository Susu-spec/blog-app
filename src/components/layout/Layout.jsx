import { Box, Container, Flex } from "@chakra-ui/react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router";

export default function Layout() {
    const location = useLocation();
    const state = location.state;

    return (
        <Flex direction="column" minHeight="100vh">
            <Navbar />
            <Box flex="1" as="main">
                <Container 
                    maxW="1024px"
                    h="100%"
                    py={{ base: "3rem", lg: "5rem"}} 
                    px={6} 
                    marginX="auto"
                >
                    <Outlet context={{ backgroundLocation: state?.backgroundLocation }}/>
                    {state?.backgroundLocation && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                            <Outlet />
                        </div>
                    )}
                </Container>
            </Box>
            <Footer />
        </Flex>
    )
}