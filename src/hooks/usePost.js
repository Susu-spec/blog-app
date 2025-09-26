import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

export function usePost(postId) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 useEffect(() => {
  async function fetchPost() {
    setLoading(true);
    const start = new Date();

    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

    const elapsed = new Date() - start;

        
    if (error) throw error;
    else setPost(data);

    const minDuration = 800
    const delay = Math.max(0, minDuration - elapsed);

    setTimeout(() => setLoading(false), delay);

  }

  fetchPost();
}, []);


  return { post, loading, error };
}
