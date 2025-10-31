import PostForm from "@/components/shared/PostForm";

import PostForm from "../components/PostForm";

/**
 * CreatePost page — allows users to create a new blog post.
 *
 * Renders the `PostForm` component without any pre-filled data.
 * The same form is reused by the `EditPost` page for editing posts.
 *
 * @page
 * @route /posts/create
 * @protected true
 *
 * @returns {JSX.Element} The post creation page component.
 */


export default function CreatePost() {
  return (
    <div className="w-full p-4 h-full">
      <PostForm />
    </div>
  );
}

