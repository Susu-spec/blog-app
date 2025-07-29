import HomePage from "@/pages/HomePage";
import PostDetails from "@/pages/PostDetails";
import { createBrowserRouter } from "react-router";

export const routes = createBrowserRouter([
    {
        path: "/", 
        element: <HomePage />,
        children: [
            {
                path: "post-details",
                element: <PostDetails />
            }
        ]
     }
])