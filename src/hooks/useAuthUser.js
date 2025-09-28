import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function useAuthUser() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            setLoading(true);
            const start = new Date();

            const { data, error } = await supabase.auth.getUser();

            const elapsed = new Date() - start;

            if (error) {
                setError(error);
                setUser(null);
            }
            else setUser(data?.user);

            const minDuration = 800
            const delay = Math.max(0, minDuration - elapsed);

            setTimeout(() => setLoading(false), delay);
        }

        fetchUser();
    }, [])

    return { user, loading, error }
}