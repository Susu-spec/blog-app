import Layout from "@/components/layout/Layout";
import PageWrapper from "@/components/layout/PageWrapper";
import CreatePost from "@/pages/CreatePost";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import PostDetails from "@/pages/PostDetail";
import PostEditor from "@/pages/PostEditor";
import { createBrowserRouter } from "react-router";

export const routes = createBrowserRouter([
    { path: "*", element: <div>404 Not Found.</div> },
    { 
        path: "/login", 
        element: <PageWrapper><LoginPage /></PageWrapper>
    },
    {
        path: "/", 
        element: <Layout />,
        children: [
            {
                index: true,
                element: <PageWrapper><HomePage /></PageWrapper>
            },
            {
                path: "posts/:id",
                element: <PageWrapper><PostDetails /></PageWrapper>
            },
            {
                path: "posts/:id/edit",
                element: <PageWrapper><PostEditor /></PageWrapper>
            },
            {
                path: "post/create",
                element: <PageWrapper><CreatePost /></PageWrapper>
            }
        ]
     }
])