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
      borderBottom={"1px solid"}
      width={"100%"}
      className='border-b-bg-primary'
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
            className={isActive('/') ? 'text-primary' : 'text-nav'}
            fontWeight={500}
            onClick={() => navigate('/')}
            _hover={{ 
              backgroundColor: "hsla(0, 0%, 100%, .08)", 
              borderRadius: ".5rem"
            }}
          >
            Home
          </Button>
          <Button
            variant="link"
            height="2rem"
            padding={"0 .75rem"}
            fontWeight={500}
            className={isActive('/posts') ? 'text-text-primary' : 'text-text-nav'}
            onClick={() => navigate('/posts')}
            _hover={{ 
              backgroundColor: "hsla(0, 0%, 100%, .08)", 
              borderRadius: ".5rem"
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