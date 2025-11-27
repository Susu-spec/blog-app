import { supabase } from "@/lib/supabase";
import { slugify } from "./text";

export async function savePost(values, user, coverUrl) {
  const payload = {
      title: values.title,
      description: values.description,
      slug: slugify(values.title),
      content: values.content,
      cover_image: coverUrl ?? values.cover_image ?? null,
  }

  let result;

  if (values.id) {
    result = await supabase
      .from("posts")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", values.id)
      .select()
      .single();
  } else {
    result = await supabase
      .from("posts")
      .insert([{
        ...payload,
        author_id: user.id,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();
  }

  const { data, error } = result;
  return { data, error };
}
