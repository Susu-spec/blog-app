import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Flex, Box, Heading, Button } from '@chakra-ui/react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <Flex
      as="nav"
      bg="blue.600"
      p={4}
      color="white"
      justify="space-between"
      align="center"
      boxShadow="md"
      className='w-full'
    >
      <Heading size="md" cursor="pointer" onClick={() => navigate('/')}>
        My Blog
      </Heading>

      <Box>
        <Button
          variant="link"
          color={isActive('/') ? 'yellow.300' : 'white'}
          mr={4}
          onClick={() => navigate('/')}
        >
          Home
        </Button>
        <Button
          variant="link"
          color={isActive('/posts') ? 'yellow.300' : 'white'}
          onClick={() => navigate('/posts')}
        >
          Posts
        </Button>
      </Box>
    </Flex>
  );
};

export default Navbar;