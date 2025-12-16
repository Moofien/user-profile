"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // Ambil data dari form
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Proses login ke Supabase
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/login?error=Gagal login, periksa email/password");
  }

  revalidatePath("/", "layout");
  redirect("/profile"); // Redirect ke halaman profile jika sukses
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // Ambil data dari form
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: formData.get("full_name"), // Kita kirim nama agar ditangkap trigger
      },
    },
  };

  // Proses register ke Supabase
  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error(error);
    redirect("/login?error=Gagal mendaftar");
  }

  revalidatePath("/", "layout");
  redirect("/profile");
}
// ... kode login dan signup yang sudah ada biarkan saja ...

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  // 1. Cek siapa yang sedang login
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const fullName = formData.get("fullName") as string;
  const address = formData.get("address") as string;
  const ktpNumber = formData.get("ktpNumber") as string;
  const file = formData.get("avatar") as File;

  let avatarUrl = formData.get("currentAvatarUrl") as string;

  // 2. Upload Foto ke Supabase Storage (jika ada file baru)
  if (file && file.size > 0) {
    const fileName = `${user.id}-${Date.now()}`;

    // Upload file
    const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
    } else {
      // Dapatkan Public URL agar bisa dilihat
      const { data: publicData } = supabase.storage.from("avatars").getPublicUrl(fileName);
      avatarUrl = publicData.publicUrl;
    }
  }

  // 3. Update data ke Database
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      address: address,
      ktp_number: ktpNumber,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating profile:", error);
    return redirect("/profile?error=Gagal mengupdate data");
  }

  revalidatePath("/profile");
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
