import { supabase } from "@/lib/supabase";


export async function fetchAllPostsFromApi() {
  return supabase
    .from("posts")
    .select("*, author:author_id(name)")
    .order("created_at", { ascending: false });
}

export async function fetchMyPostsFromApi(userId) {
  return supabase
    .from("posts")
    .select("*, author:author_id(name)")
    .eq("author_id", userId)
    .order("created_at", { ascending: false });
}

export async function fetchPostFromApi(slug) {
  return supabase
    .from("posts")
    .select("*, author:author_id(name)")
    .eq("slug", slug)
    .single();
}
