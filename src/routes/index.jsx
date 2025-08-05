import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import PostDetails from "@/pages/PostDetails";
import PostsList from "@/pages/PostsList";
import { createBrowserRouter } from "react-router";

export const routes = createBrowserRouter([
    {
        path: "/", 
        element: <Layout />,
        children: [
            {
                index: "posts",
                element: <HomePage />
            },
            {
                path: "posts-list",
                element: <PostsList />
            },
            {
                path: "post-details",
                element: <PostDetails />
            }
        ]
     }
])