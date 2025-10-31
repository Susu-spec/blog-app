import { Box, Button, Dialog, Heading, Text, Flex, Spinner, Portal } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toaster } from "../ui/toaster";
import { HiTrash } from "react-icons/hi2";
import { useAuth } from "@/providers/AuthProvider";
import { usePosts } from "@/providers/PostsProvider";

/**
 * DeletePost component — handles post deletion with confirmation dialog.
 *
 * Displays a "Delete" button which, when clicked, opens a confirmation modal.
 * If confirmed, it triggers deletion of the specified post and refreshes post lists.
 *
 * @component
 * @example
 * return (
 *   <DeletePost postId={post.id} />
 * )
 *
 * @param {Object} props
 * @param {string} props.postId - The ID of the post to be deleted.
 * @returns {JSX.Element} A button with a confirmation dialog for post deletion.
 */

export default function DeletePost({ postId }) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { user } = useAuth();
    const { fetchAllPosts, fetchMyPosts } = usePosts();

    /**
     * Deletes the post by ID and refreshes post lists.
     * Displays a loading state during deletion.
     *
     * @async
     * @param {string} postId - The ID of the post to delete.
     * @returns {Promise<void>}
     */
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
            await fetchAllPosts();
            await fetchMyPosts(user?.id);
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