import { supabase } from "@/lib/supabase";

export async function savePost(values, user, coverUrl) {
  const payload = {
    title: values.title,
    description: values.description,
    slug: slugify(values.title),
    cover_image: coverUrl,
    content: values.content,
  };

  if (values.id) {
    return await supabase
      .from("posts")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", values.id)
      .select();
  }

  return await supabase
    .from("posts")
    .insert([{
      ...payload,
      author_id: user.id,
      created_at: new Date().toISOString(),
    }])
    .select();
}
