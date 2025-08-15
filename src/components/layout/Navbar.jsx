import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Flex, Box, Heading, Button, Container, chakra } from '@chakra-ui/react';


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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
        >
          <Button
            variant="link"
            height="2rem"
            padding={"0 .75rem"}
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
          {/* <Button
            variant="link"
            height="2rem"
            padding="0 .75rem"
            borderRadius=".5rem"
            fontWeight={500}
            color={isActive('/posts') ? "buttonActiveText" : "buttonText"}
            onClick={() => navigate('/posts')}
            backgroundColor={isActive('/posts') ? "buttonBg" : "transparent"}
            _hover={{ 
              color: "buttonActiveText",
              backgroundColor: "buttonBg", 
            }}
            _active={{
              color: "buttonActiveText",
              backgroundColor: "buttonBg", 
            }}
          >
            Posts
          </Button> */}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;