import PageWrapper from "@/components/layout/PageWrapper";
import Loader from "@/components/shared/Loader";
import PostForm from "@/components/shared/PostForm";
import { usePosts } from "@/providers/PostsProvider";
import { Box } from "@chakra-ui/react";
import { useParams } from "react-router";

import { Box } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { usePosts } from "../hooks/usePosts";
import PostForm from "../components/PostForm";
import PageWrapper from "../components/PageWrapper";
import Loader from "../components/Loader";

/**
 * EditPost page — allows users to edit an existing blog post belonging to them.
 *
 * Fetches a single post by slug using the `usePosts()` hook and
 * renders the `PostForm` component pre-filled with the post data.
 * Displays a loading spinner while fetching post details.
 *
 * @page
 * @route /posts/:slug/edit
 * @protected true
 *
 *
 * @returns {JSX.Element} The post editing page component.
 */

export default function EditPost() {
  const { slug } = useParams();
  const { postDetails, loading, error } = usePosts(slug);
  const post = postDetails[slug];

  if (loading) return <Loader />;

  return (
    <PageWrapper>
      <Box>
        <PostForm post={post} />
      </Box>
    </PageWrapper>
  );
}
