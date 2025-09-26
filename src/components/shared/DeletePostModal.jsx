import { Box, Button, Dialog, Heading, Text, Flex, Spinner, Portal } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toaster } from "../ui/toaster";
import { HiTrash } from "react-icons/hi2";
import { usePosts } from "@/hooks/usePosts";

export default function DeletePost({ postId, getPosts }) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleDelete = async (postId) => {
        setLoading(true);
        const start = new Date();

        const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", postId);
        
        const elapsed = new Date() - start;
        const minDuration = 800;
        const delay = Math.max(0, minDuration - elapsed)

        if (error) {
            toaster.create({
                title: "Error",
                description: error.message,
                type: "error",
            })
        }
        else {
            toaster.create({
                description: "Post deleted...",
                type: "info"
            })
            await getPosts();
            setOpen(false)
        }

        setTimeout(() => {
            setLoading(false)



        }, delay)

    }

    return (
        <Dialog.Root placement="center" open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <HiTrash size={12} color="inherit"/>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Body minW={600} padding={0}>
                            <motion.div
                                style={{ overflowY: "hidden"}}
                                initial={{ opacity: 0}}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8, ease: "easeInOut"}}
                            >
                                <Flex p={6}
                                    direction="column"
                                    gap={6}
                                >
                                    <Flex direction="column" gap={3}>
                                        <Heading as="h1"
                                            fontWeight={700}
                                            color="bodyText"
                                        >
                                            Delete
                                        </Heading>
                                        <Text>Are you sure want to delete this post?</Text>
                                    </Flex>
                                    <Flex gap={3} alignItems="center" justifyContent="center" w="100%" mx="auto">
                                        <Button
                                            rounded={"lg"} 
                                            p={4}
                                            bg="red.500"
                                            color="white"
                                            display="flex"
                                            gap={2}
                                            alignItems="center"
                                            onClick={() => handleDelete(postId)}
                                            >
                                                {loading && <Spinner size="sm" />}
                                                Delete
                                        </Button>
                                         <Button
                                            rounded={"lg"} 
                                            p={4}
                                            bg="buttonBg"
                                            color="buttonActiveText"
                                            onClick={() => setOpen(false)}
                                            >
                                                Cancel
                                        </Button>
                                    </Flex>
                                </Flex>
                            </motion.div>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}