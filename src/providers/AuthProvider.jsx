import { supabase } from "@/lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            const { data, error } = await supabase.auth.getUser();
            
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

    const logout = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();

        if (error) {
            setError(error);
        } else {
            setUser(null);
        }

        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
