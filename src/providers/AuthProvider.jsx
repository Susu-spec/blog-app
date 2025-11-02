/**
 * @fileoverview Authentication provider that manages user session, loading state, and error handling.
 * Exposes user information and auth utilities to the rest of the application.
 */

import { toaster } from "@/components/ui/toaster";
import { parseLogoutError } from "@/lib/helper";
import { supabase } from "@/lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";

/**
 * @typedef {Object} User
 * @property {string} id - Unique identifier for the user.
 * @property {string} name - Name of the user.
 * @property {string} created_at - Timestamp of when the user was created.
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User | null} user - Current user logged into the application.
 * @property {boolean} loading - Indicates whether a request is in progress.
 * @property {Error | null} error - Any error that occurred during authentication.
 * @property {() => Promise<void>} logout - Logs the user out of their session.
 */

/**
 * React Context that stores authentication state and methods.
 * @type {React.Context<AuthContextType | undefined>}
 */
const AuthContext = createContext();


/**
 * Provides authentication context to all child components.
 * Manages user session persistence, listens for auth changes, and handles logout.
 *
 * @param {{ children: React.ReactNode }} props - The child components wrapped by the provider.
 * @returns {JSX.Element}
 */

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        /**
         * Fetches the currently logged-in user from Supabase.
         * Called on initial mount to restore session if it exists.
         */
        async function fetchUser() {
            const { data, error } = await supabase.auth.getSession();
            
            if (error) {
                setError(error);
                setUser(null);
            } else {
                setUser(data?.user);
            }
            
            setLoading(false);
        }

        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => subscription.unsubscribe();
    }, []);


    /**
     * Logs out the current user and resets user state.
     * @returns {Promise<void>}
     */
    const logout = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();

        if (error) {
            setError(error);
            const { title, description } = parseLogoutError(error)
            toaster.create({
                title,
                description,
                type: "error",
                duration: 4000,
                isClosable: true,
            })
        } else {
            setUser(null);
            toaster.create({
                description: "You have been logged out successfully",
                type: "info"
            })
        }

        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, logout }}>
            {children}
        </AuthContext.Provider>
    );
}


/**
 * Custom React hook to access authentication state and actions.
 * Must be used within an `<AuthProvider>`.
 *
 * @throws {Error} If called outside of an AuthProvider.
 * @returns {AuthContextType} The authentication context object.
 */

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
