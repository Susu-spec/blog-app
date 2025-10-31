import PageWrapper from "@/components/layout/PageWrapper";
import Loader from "@/components/shared/Loader";
import PostForm from "@/components/shared/PostForm";
import { usePosts } from "@/providers/PostsProvider";
import { Box } from "@chakra-ui/react";
import { useParams } from "react-router";

export default function EditPost() {
    const { slug } = useParams();
    const { postDetails, loading, error } = usePosts(slug);
    const post = postDetails[slug];

    if (loading) return <Loader />

    return (
        <PageWrapper>
            <Box>
                <PostForm post={post}/>
            </Box>
        </PageWrapper>
    )
}