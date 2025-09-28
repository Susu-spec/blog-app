import { Box, Flex } from "@chakra-ui/react";
import ToggleThemeButton from "../shared/ToggleThemeButton";
import BackToTopButton from "../shared/BackToTopButton";

export default function Footer() {

    return (
        <Box 
            as="footer"
            p={{ 
                base: "6", 
                lg: "4"
            }}
            boxShadow="lg"
            position="sticky"
            bottom={0}
            zIndex={999}
            width="100%"
            backgroundColor="navBg"
            display={{
                base: "none",
                lg: "block"
            }}
        >
           <Flex
                maxWidth={1024}
                justify="space-between"
                align="center"
                width="100%"
                marginX="auto"
            >
                <ToggleThemeButton />
                <BackToTopButton />
            </Flex>  

        </Box>
    )
}