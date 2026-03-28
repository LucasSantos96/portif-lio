import "server-only";

import { createClient } from "@supabase/supabase-js";

const bucketName = "portifolio";

export function getSupabaseStorageClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY para usar o Storage.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function uploadProjectImage(file: File) {
  const client = getSupabaseStorageClient();
  const fileExtension = file.name.split(".").pop() || "png";
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
  const filePath = `projects/${fileName}`;

  const { error } = await client.storage.from(bucketName).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = client.storage.from(bucketName).getPublicUrl(filePath);

  return {
    path: filePath,
    publicUrl: data.publicUrl,
  };
}
