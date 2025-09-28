import useAuthUser from "@/hooks/useAuthUser";
import { Box, Button, Flex } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router";
import ToggleThemeButton from "../shared/ToggleThemeButton";

export default function MobileNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthUser();


    const isActive = (path) => location.pathname === path;

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
            zIndex={999}
            backgroundColor="navBg"
            p={4}
            boxShadow="lg"
            borderRadius="2xl"
            display={{
                lg: "none"
            }}
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
                <Button
                    variant="link"
                    padding={".75rem 1rem"}
                    color={isActive('/') ? "buttonActiveText" : "buttonText"}
                    borderRadius=".5rem"
                    onClick={() => navigate('/')}
                    backgroundColor={isActive('/') ? "buttonBg" : "transparent"}
                    _hover={{ 
                        color: "buttonActiveText",
                        backgroundColor: "buttonBg", 
                    }}
                    _active={{
                        color: "buttonActiveText",
                        backgroundColor: "buttonBg", 
                    }}
                    >
                        Home
                    </Button>
                    {user ?
                        <Button
                        variant="link"
                        padding={".75rem 1rem"}
                        color={isActive('/my-posts') ? "buttonActiveText" : "buttonText"}
                        borderRadius=".5rem"
                        onClick={() => navigate('/my-posts')}
                        backgroundColor={isActive('/my-posts') ? "buttonBg" : "transparent"}
                        _hover={{ 
                        color: "buttonActiveText",
                        backgroundColor: "buttonBg", 
                        }}
                        _active={{
                        color: "buttonActiveText",
                        backgroundColor: "buttonBg", 
                        }}
                    >
                        Your Posts
                    </Button> : ''
                    }
                    <Button
                        variant="link"
                        padding={".75rem 1rem"}
                        color={isActive('/post/create') ? "buttonActiveText" : "buttonText"}
                        borderRadius=".5rem"
                        onClick={() => navigate('/post/create')}
                        backgroundColor={isActive('/post/create') ? "buttonBg" : "transparent"}
                        _hover={{ 
                            color: "buttonActiveText",
                            backgroundColor: "buttonBg", 
                        }}
                        _active={{
                            color: "buttonActiveText",
                            backgroundColor: "buttonBg", 
                        }}
                    >
                        Create
                    </Button>
                    <ToggleThemeButton />
                </Flex>
        </Box>
    )
}