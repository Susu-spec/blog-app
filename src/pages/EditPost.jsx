import PageWrapper from "@/components/layout/PageWrapper";
import Loader from "@/components/shared/Loader";
import PostForm from "@/components/shared/PostForm";
import { usePosts } from "@/providers/PostsProvider";
import { Box } from "@chakra-ui/react";
import { useParams } from "react-router";

export default function EditPost() {
    const { id } = useParams();
    const { postDetails, loading, error } = usePosts(id);
    const post = postDetails[id];

    if (loading) return <Loader />

    return (
        <PageWrapper>
            <Box>
                <PostForm post={post}/>
            </Box>
        </PageWrapper>
    )
}