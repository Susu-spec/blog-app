import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

export function usePost(postId) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  async function fetchPost() {
      const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", postId)
          .single();

      if (error) throw error;
      else setPost(data);
    }

  fetchPost();
}, []);


  return { post, loading, error };
}
