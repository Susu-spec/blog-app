import { ArrowRightIcon, Search2Icon } from "@chakra-ui/icons";
import { Box, Button, Dialog, Flex, Icon, Input, Portal, Text } from "@chakra-ui/react";
import { useState } from "react";

export default function SearchModal() {
    const [search, setSearch] = useState("");
    const [items] = useState(["Apple", "Banana", "Cherry", "Date", "Eggfruit"]);

    const filtered = items.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Dialog.Root placement="center">
            <Dialog.Trigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    minWidth={240}
                    border="1px solid #23252a"
                    borderRadius={100}
                    justifyContent="space-between"
                    className="bg-bg-secondary text-text-tertiary text-sm"
                    leftIcon={<Search2Icon size={18} />}
                >
                    Search...
                    <kbd className="justify-self-end">⌘K</kbd>
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
                                borderBottom={"1px solid hsl(0, 0%, 100%, .08)"}
                                onChange={(e) => setSearch(e.target.value)}
                                _focus={{ border: "none" }}
                                _focusVisible={{ outline: "none" }}
                                _active={{ border: "none" }}
                            />
                            {filtered.length === 0 ? (
                                <Text className="text-text-primary">
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
                                           <ArrowRightIcon 
                                                width={"16px"} 
                                                height={"16px"} 
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
                            </>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}