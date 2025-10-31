import { Box, Container, Flex } from "@chakra-ui/react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router";
import ScrollToTop from "../shared/ScrollToTop";
import MobileNav from "./MobileNav";
import BackToTopButton from "../shared/BackToTopButton";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "./PageWrapper";

export default function Layout() {
    const location = useLocation();
    const state = location.state;

    return (
        <AnimatePresence mode="wait">
            <Flex direction="column" minHeight="100vh">
                <ScrollToTop />
                <Navbar />
                <PageWrapper>
                    <Box flex="1" as="main">
                        <Container 
                            maxW="1024px"
                            h="100%" 
                            p={{
                                base: "3rem 1.5rem 6rem 1.5rem",
                                lg: "5rem 1.5rem"
                            }}
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
                </PageWrapper>
                <Footer />
                <MobileNav />
                <BackToTopButton />
            </Flex>
        </AnimatePresence>
    )
}