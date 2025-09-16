import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:author_id(name, avatar_url)
        `)
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setPosts(data);

      setLoading(false);
    }

    fetchPosts();
  }, []);

  return { posts, loading };
}
