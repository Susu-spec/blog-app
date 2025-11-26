import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Flex, Box, Heading, Button, Container, chakra } from '@chakra-ui/react';
import Loader from '../shared/Loader';
import { useAuth } from '@/providers/AuthProvider';
import { toaster } from '../ui/toaster';
import NavButton from '../shared/NavButton';


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useAuth();

  const isActive = (path) => location.pathname.startsWith(path);

  if (loading) return <Loader />

  return (
    <Box
      as="nav"
      p={{ 
        base: "6", 
        lg: "4"
      }}
      boxShadow="md"
      position="sticky"
      top={0}
      zIndex={999}
      width="100%"
      backgroundColor="navBg"
      transition="all 0.3s ease-in-out"
    >
      <Flex
        maxWidth={1024}
        justify="space-between"
        align="center"
        width="100%"
        marginX="auto"
      >
        <Heading 
          size="2xl" 
          cursor="pointer" 
          onClick={() => navigate('/')}
          fontWeight={500}
        >
          Suwayba
        </Heading>

        <Flex
          gap={2}
          align="center"
          display={{
            base: "none",
            lg: "flex"
          }}
        >
          <NavButton to="/" label="Home" />
          {user ? (
            <NavButton  to="/my-posts" label="Your Posts" />
          ) : (
            <NavButton to="/" label="Posts" condition={isActive('/posts')} />
          )}
           <NavButton data-cy="create-post-nav-desktop" to="/post/create" label="Start Writing" />
          {user ? 
            <Button
                variant="link"
                title="Click to log out"
                data-cy="logout-button-desktop"
                height="2rem"
                padding={"0 .75rem"}
                color="buttonText"
                borderRadius=".5rem"
                onClick={() => logout()}
                backgroundColor="transparent"
                _hover={{ 
                  color: "buttonActiveText",
                  backgroundColor: "buttonBg", 
                }}
                _active={{
                  color: "buttonActiveText",
                  backgroundColor: "buttonBg", 
                }}
              >
                Log out
              </Button> : ''
            }
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;