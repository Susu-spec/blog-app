import { Spinner } from "@chakra-ui/react";
import { useSessionContext, useUser } from "@supabase/auth-helpers-react"
import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
    const user = useUser();
    const { isLoading } = useSessionContext();

    if (isLoading) {
        return <Spinner size="lg" />
    }
    
    if (user === null) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}