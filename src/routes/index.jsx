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
                element: <PageWrapper><HomePage /></PageWrapper>
            },
            {
                path: "posts/:id",
                element: (
                    <ProtectedRoute>
                        <PageWrapper>
                            <PostDetails />
                        </PageWrapper>
                    </ProtectedRoute>
                )
            },
            {
                path: "posts/:id/edit",
                element: (
                    <ProtectedRoute>
                        <PageWrapper>
                            <EditPost />
                        </PageWrapper>
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