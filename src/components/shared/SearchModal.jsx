import { ArrowForwardIcon, ArrowRightIcon, Search2Icon } from "@chakra-ui/icons";
import { Box, Button, Dialog, Flex, Icon, Input, Kbd, Portal, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SearchModal() {
    const [search, setSearch] = useState("");
    const [items] = useState(["Apple", "Banana", "Cherry", "Date", "Eggfruit", "Strawberry", "Eggplant"]);

    const filtered = items.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase())
    );

    const MotionBox = motion.div;

    return (
        <Dialog.Root placement="center">
            <Dialog.Trigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    minWidth="300px"
                    border="1px solid #23252a"
                    borderRadius={100}
                    backgroundColor="#141516"
                    color="#8a8f98"
                    fontSize="14px"
                    height="40px"
                    px={4}
                >
                    <Search2Icon boxSize={4} />
                    <span style={{ flex: 1, textAlign: "start", fontSize: ".875rem" }}>Search...</span>
                    <kbd>⌘K</kbd>
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Body 
                            maxWidth={600} 
                            height={450}
                            padding={0}
                        >
                            <>
                                <Input 
                                    type="text"
                                    padding={".75rem 1.125rem"} 
                                    height={"48px"}
                                    placeholder="Search now..."
                                    className="text-text-primary text-lg"
                                    border="none"
                                    borderBottom={"1px solid hsl(0, 0%, 100%, .05)"}
                                    onChange={(e) => setSearch(e.target.value)}
                                    _focus={{ outline: "none" }}
                                    _focusVisible={{ outline: "none" }}
                                    _active={{ outline: "none" }}
                                />
                                <MotionBox 
                                    style={{ overflowY: "auto" }}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <Box
                                        paddingTop={4}
                                        paddingBottom={2}
                                    >
                                            {filtered.length === 0 ? (
                                            <Text 
                                                paddingBlock={5}
                                                textAlign="center"
                                                className="text-text-primary"
                                            >
                                                No results found
                                            </Text>
                                        )
                                            : (
                                                filtered.map((item, index) => (
                                                    <Flex
                                                        key={index} 
                                                        padding={".75rem 1.125rem"} 
                                                        cursor="pointer" 
                                                        className="text-sm"
                                                        alignItems="center"
                                                        gap={3}
                                                        _hover={{ backgroundColor: "hsla(0,0%,4%,.8)" }}
                                                    >
                                                    <ArrowForwardIcon
                                                            width="14px" 
                                                            height="14px" 
                                                            className="text-text-tertiary"
                                                            _hover={{ color: "#f7f8f8" }}
                                                        />
                                                        <Text 
                                                            _hover={{ color: "#f7f8f8" }} 
                                                            className="text-text-tertiary"
                                                        >
                                                            {item}
                                                        </Text>
                                                    </Flex>
                                                ))
                                            )

                                        }
                                    </Box>
                                </MotionBox>
                            </>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}