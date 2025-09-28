import PageWrapper from "@/components/layout/PageWrapper";
import Loader from "@/components/shared/Loader";
import PostForm from "@/components/shared/PostForm";
import { usePost } from "@/hooks/usePost";
import { Box } from "@chakra-ui/react";
import { useParams } from "react-router";

export default function EditPost() {
    const { id } = useParams();
    const { post, loading, error } = usePost(id);

    if (loading) return <Loader />

    return (
        <PageWrapper>
            <Box>
                <PostForm post={post}/>
            </Box>
        </PageWrapper>
    )
}