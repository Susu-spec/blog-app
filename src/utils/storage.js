import { supabase } from "@/lib/supabase";

export async function uploadCoverImage(file, userId) {
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("post-covers")
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("post-covers")
    .getPublicUrl(filePath);

  return data.publicUrl;
}