import PostForm from "@/components/shared/PostForm";
import { postDetail } from "@/data/post-detail";
import { usePost } from "@/hooks/usePost";
import { Box } from "@chakra-ui/react";
import { useParams } from "react-router";

export default function EditPost() {
    const { id } = useParams();
    const { post, loading, error } = usePost(id);

    return (
        <Box>
            <PostForm post={post}/>
        </Box>
    )
}