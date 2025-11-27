/**
 * Custom React hook to access authentication state and actions.
 * Must be used within an `<AuthProvider>`.
 *
 * @throws {Error} If called outside of an AuthProvider.
 * @returns {AuthContextType} The authentication context object.
 */
import { AuthContext } from "@/providers/AuthProvider";
import { useContext } from "react";

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
