import { Box, Button, Dialog, Flex, Icon, Input, Kbd, Portal, Spinner, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HiArrowRight, HiMagnifyingGlass } from "react-icons/hi2";
import { Link } from "react-router";
import Loader from "./Loader";

/**
 * SearchModal component — provides a searchable modal interface
 * for filtering and viewing posts.
 *
 * Includes a debounced input handler that waits 300ms after the user stops typing
 * before updating the search query.
 *
 * @component
 * @example
 * const posts = [
 *   { id: "1", title: "Hello World", slug: "hello-world" },
 *   { id: "2", title: "React Tips", slug: "react-tips" },
 * ];
 * return <SearchModal posts={posts} loading={false} />;
 *
 * @param {Object} props
 * @param {Array<{ id: string, title: string, slug: string, description?: string }>} [props.posts=[]]
 *   Array of posts to search from.
 * @param {boolean} props.loading - Indicates whether post data is still being fetched.
 *
 * @returns {JSX.Element} A modal with a search input and filtered post results.
 */

export default function SearchModal({ posts=[], loading }) {
    const [query, setQuery] = useState("");

    const debouncedSearch = useCallback(
        debounce((value) => {
            setQuery(value);
        }, 300),
        []
    );

    const handleSearch = (e) => {
        debouncedSearch(e.target.value);
    };

    const filtered = useMemo(() => {
        if (!query) return posts;
        return posts.filter((item) =>
            item?.title?.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, posts]);

    const MotionBox = motion.div;
    
    useEffect(() => {
        setQuery("")
    }, [])

    if (loading) return <Spinner size="md" color="buttonActiveText"/>
    
    return (
        <Dialog.Root placement="center">
            <Dialog.Trigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    minWidth="300px"
                    border="1px solid"
                    borderColor="buttonBorderColor"
                    borderRadius={100}
                    backgroundColor="buttonBg"
                    color="buttonText"
                    fontSize="14px"
                    height="40px"
                    px={4}
                >
                    <HiMagnifyingGlass size={4} />
                    <span 
                        style={{ 
                            flex: 1, 
                            textAlign: "start", 
                            fontSize: ".875rem" 
                        }}
                    >
                        Search...
                    </span>
                    <kbd>⌘K</kbd>
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Body 
                            maxWidth={600}
                            maxHeight={300}
                            padding={0}
                            overflowY="auto"
                        >
                            <>
                                <Input 
                                    type="text"
                                    padding={".75rem 1.125rem"} 
                                    height={"48px"}
                                    placeholder="Search now..."
                                    border="none"
                                    borderBottom={"1px solid hsl(0, 0%, 100%, .05)"}
                                    onChange={handleSearch}
                                    _focus={{ outline: "none" }}
                                    _focusVisible={{ outline: "none" }}
                                    _active={{ outline: "none" }}
                                />
                                <MotionBox 
                                    style={{ overflowY: "hidden" }}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    paddingTop={4}
                                    paddingBottom={2}
                                >
                                    {filtered.length === 0 ? (
                                        <Text 
                                            paddingBlock={5}
                                            textAlign="center"
                                            color="buttonText"
                                        >
                                            No results found.
                                        </Text>
                                    )
                                        : (
                                            filtered?.map((item) => (
                                                <Link to={`/posts/${item?.slug}`} key={item?.id}>
                                                    <Flex
                                                        padding={".75rem 1.125rem"} 
                                                        cursor="pointer" 
                                                        alignItems="center"
                                                        gap={3}
                                                        _hover={{ backgroundColor: "linkHoverBg" }}
                                                    >
                                                        <HiArrowRight
                                                            width="14px" 
                                                            height="14px" 
                                                            _hover={{ color: "bodyText" }}
                                                        />
                                                        <Text 
                                                            _hover={{ color: "bodyText" }} 
                                                        >
                                                            {item.title}
                                                        </Text>
                                                    </Flex>
                                                </Link>
                                            ))
                                        )
                                    }
                                </MotionBox>
                            </>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}