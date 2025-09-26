import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const start = new Date();


      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:author_id(name)
        `)
        .order("created_at", { ascending: false });

      const elapsed = Date.now() - start;
      
      if (error) console.error(error);
      else setPosts(data);

      const minDuration = 800;
      const delay = Math.max(0, minDuration - elapsed);

      setTimeout(() => setLoading(false), delay);
    }

    fetchPosts();
  }, []);

  return { posts, loading };
}
