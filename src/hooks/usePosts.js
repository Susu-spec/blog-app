import { supabase } from "@/lib/supabase";
import { useState, useEffect, useCallback } from "react";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPosts = useCallback(async () => {
    setLoading(true);
    const start = Date.now();

    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        author:author_id(name)
      `)
      .order("created_at", { ascending: false });

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
