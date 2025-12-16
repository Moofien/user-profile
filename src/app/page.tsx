import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  // Cek apakah user sudah login
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Jika sudah login, langsung lempar ke Profile
    redirect("/profile");
  } else {
    // Jika belum, lempar ke Login
    redirect("/login");
  }
}
