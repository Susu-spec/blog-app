import Layout from "@/components/layout/Layout";
import CreatePost from "@/pages/CreatePost";
import HomePage from "@/pages/HomePage";
import PostDetails from "@/pages/PostDetail";
import PostEditor from "@/pages/PostEditor";
import { createBrowserRouter } from "react-router";

export const routes = createBrowserRouter([
    {
        path: "/", 
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "posts/:id",
                element: <PostDetails />
            },
            {
                path: "posts/:id/edit",
                element: <PostEditor />
            },
            {
                path: "post/create",
                element: <CreatePost />
            }
        ]
     }
])