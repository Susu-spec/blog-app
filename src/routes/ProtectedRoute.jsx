import { useUser } from "@supabase/auth-helpers-react"
import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
    const user = useUser();
    if (!user) {
        return <Navigate to="/login" replace />
    }
    return <>{children}</>
}