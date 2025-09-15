import PostForm from "@/components/shared/PostForm";
import { postDetail } from "@/data/post-detail";
import { Box } from "@chakra-ui/react";

export default function PostEditor() {
    return (
        <Box>
            <PostForm post={postDetail}/>
        </Box>
    )
}