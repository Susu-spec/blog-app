import { Box, Flex } from "@chakra-ui/react";
import ToggleThemeButton from "../shared/ToggleThemeButton";

export default function Footer() {
    return (
        <Box as="footer"
                p={{ 
                base: "6", 
                lg: "4"
            }}
            boxShadow="md"
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
                <ToggleThemeButton />
            </Flex>  

        </Box>
    )
}