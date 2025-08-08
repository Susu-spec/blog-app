import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Flex, Box, Heading, Button, Container } from '@chakra-ui/react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <Box
      as="nav"
      p={4}
      boxShadow="md"
      position="sticky"
      top={0}
      borderBottom=".5px solid hsl(0, 0%, 100%, .05)"
      width="100%"
      backgroundColor="#0a0a0a"
    >
      <Flex
        maxWidth={1024}
        justify="space-between"
        align="center"
        className='w-full'
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
        >
          <Button
            variant="link"
            height="2rem"
            padding={"0 .75rem"}
            color={isActive('/') ? "#f7f8f8" : "#8a8f98"}
            borderRadius=".5rem"
            onClick={() => navigate('/')}
            backgroundColor={isActive('/') ? "hsla(0, 0%, 100%, .08)" : "transparent"}
            _hover={{ 
              color: "#f7f8f8",
              backgroundColor: "hsla(0, 0%, 100%, .08)", 
            }}
            _active={{
              color: "#f7f8f8",
              backgroundColor: "hsla(0, 0%, 100%, .08)", 
            }}
          >
            Home
          </Button>
          <Button
            variant="link"
            height="2rem"
            padding="0 .75rem"
            borderRadius=".5rem"
            fontWeight={500}
            color={isActive('/posts') ? "#f7f8f8" : "#8a8f98"}
            backgroundColor={isActive('/posts') ? "hsla(0, 0%, 100%, .08)" : "transparent"}
            onClick={() => navigate('/posts')}
            _hover={{ 
              color: "#f7f8f8",
              backgroundColor: "hsla(0, 0%, 100%, .08)", 
            }}
             _active={{
              color: "#f7f8f8",
              backgroundColor: "hsla(0, 0%, 100%, .08)", 
            }}
          >
            Posts
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;