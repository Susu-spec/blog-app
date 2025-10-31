import Layout from "@/components/layout/Layout";
import PageWrapper from "@/components/layout/PageWrapper";
import CreatePost from "@/pages/CreatePost";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import PostDetails from "@/pages/PostDetail";
import SignupPage from "@/pages/auth/SignupPage";
import { createBrowserRouter } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import EditPost from "@/pages/EditPost";
import MyPostsPage from "@/pages/MyPostsPage";

export const routes = createBrowserRouter([
    { path: "*", element: <div>404 Not Found.</div> },
    { 
        path: "/login", 
        element: <PageWrapper><LoginPage /></PageWrapper>
    },
    {
        path: "/signup",
        element: <PageWrapper><SignupPage /></PageWrapper>
    },
    {
        path: "/", 
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "my-posts",
                element: <MyPostsPage />
            },
            {
                path: "posts/:slug",
                element: (
                    <ProtectedRoute>
                        <PostDetails />
                    </ProtectedRoute>
                )
            },
            {
                path: "posts/:slug/edit",
                element: (
                    <ProtectedRoute>
                        <EditPost />
                    </ProtectedRoute>
                )
            },
            {
                path: "post/create",
                element: (
                    <ProtectedRoute>
                        <PageWrapper>
                            <CreatePost />
                        </PageWrapper>
                    </ProtectedRoute>
                )
            }
        ]
     }
])