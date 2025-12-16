import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { updateProfile, signout } from "../login/actions";
import Image from "next/image";

export default async function ProfilePage() {
  const supabase = await createClient();

  // 1. Cek User Login
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Ambil Data Profile dari Database
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white text-black rounded shadow-lg border">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <form action={signout}>
          <button className="text-sm text-red-600 hover:text-red-800 font-semibold">Logout</button>
        </form>
      </div>

      <form action={updateProfile} className="space-y-4">
        {/* Hidden Input untuk simpan URL lama */}
        <input type="hidden" name="currentAvatarUrl" value={profile?.avatar_url || ""} />

        {/* Preview Foto */}
        <div className="flex flex-col items-center gap-2 mb-4">
          {profile?.avatar_url ? (
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
              <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" priority />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">No Photo</div>
          )}
          <label className="block text-sm font-medium text-gray-700">Ganti Foto Profil</label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
          <input type="text" name="fullName" defaultValue={profile?.full_name || ""} className="w-full p-2 border rounded mt-1" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Alamat Domisili</label>
          <textarea name="address" defaultValue={profile?.address || ""} className="w-full p-2 border rounded mt-1" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nomor KTP</label>
          <input type="text" name="ktpNumber" defaultValue={profile?.ktp_number || ""} className="w-full p-2 border rounded mt-1" />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 transition mt-4">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
