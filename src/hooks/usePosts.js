import { supabase } from "@/lib/supabase";
import { useState, useEffect, useCallback } from "react";

// Note: We did not need to add the author_name column from the backend
// The `select(...)` syntax already handled that
export function usePosts( id = null ) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPosts = useCallback(async () => {
    setLoading(true);
    const start = Date.now();

    let query = supabase
      .from("posts")
      .select(`
        *,
        author:author_id(name)
      `)
      .order("created_at", { ascending: false });


    if (id) {
      query = query.eq("author_id", id);
    }

    const { data, error } = await query;

    const elapsed = Date.now() - start;
    const minDuration = 800;
    const delay = Math.max(0, minDuration - elapsed);

    if (error) {
      console.error(error);
    } else {
      setPosts(data);
    }

    setTimeout(() => setLoading(false), delay);
  }, []);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return { posts, loading, getPosts };
}
