import { Box, Button, Flex } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router";
import ToggleThemeButton from "../shared/ToggleThemeButton";
import { HiLockOpen, HiPower } from "react-icons/hi2";
import { useColorMode } from "../ui/color-mode";
import Loader from "../shared/Loader";
import { useAuth } from "@/providers/AuthProvider";
import { toaster } from "../ui/toaster";
import NavButton from "../shared/NavButton";

export default function MobileNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loading, logout } = useAuth();
    const { colorMode } = useColorMode();


    const isActive = (path) => location.pathname.startsWith(path);

    if (loading) return <Loader />

    return (
        <Box 
            as="nav"
            width="100%"
            maxWidth={{
                base: "fit",
                md: "50%"
            }}
            marginX="auto"
            position="fixed"
            left="50%"
            transform="translate(-50%, -50%)"
            bottom={-6}
            zIndex={99999}
            backgroundColor="navBg"
            p={4}
            boxShadow="lg"
            borderRadius="2xl"
            display={{
                lg: "none"
            }}
            transition="all 0.3s ease-in-out"
        >
            <Flex
                alignItems="center"
                justifyContent="center"
                gap={{
                    base: 2,
                    md: 8
                }}
                width="100%"
                marginX="auto"
            >
                <ToggleThemeButton />
                <NavButton data-cy="home-button" to="/" label="Home" />
                {user ? (
                    <NavButton data-cy="my-posts-button" to="/my-posts" label="Your Posts" />
                ) : (
                    <NavButton to="/" label="Posts" condition={isActive('/posts')} />
                )}

                    <NavButton data-cy="create-post-nav-mobile" to="/post/create" label="Create" />

                    {user ?
                        <Button
                            title="Click to log out"
                            data-cy="logout-button-mobile"
                            backgroundColor="transparent"
                            color={colorMode === "light" ? "buttonActiveText" : "buttonText"}
                            padding={0}
                            onClick={() => logout()}
                            _hover={{ 
                                color: "buttonActiveText",
                                backgroundColor: "buttonBg", 
                            }}
                        >
                            <HiPower />
                        </Button> : ''
                    }
                </Flex>
        </Box>
    )
}