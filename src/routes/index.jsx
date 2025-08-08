import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import PostDetails from "@/pages/PostDetail";
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
                path: "posts/:slug",
                element: <PostDetails />
            }
        ]
     }
])