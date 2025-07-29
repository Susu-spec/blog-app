import { SearchIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Icon, InputGroup } from "@chakra-ui/react";


export default function Navbar() {
    return (
        <Box as="nav">
            <Flex>
                <Heading>
                    Susu's Blog
                </Heading>

                {/* <InputGroup> */}
                    {/* <Icon as={SearchIcon} size={10}/> */}
                {/* </InputGroup> */}
            </Flex>
        </Box>
    )
}