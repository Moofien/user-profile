import { login, signup } from "./actions";

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <form className="flex flex-col w-full max-w-md p-8 space-y-4 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center text-black">Masuk / Daftar</h1>

        {/* Menampilkan pesan error jika ada */}
        {searchParams?.error && <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">{searchParams.error}</div>}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" required className="p-2 border rounded text-black" placeholder="nama@email.com" />
        </div>

        {/* Input Nama Lengkap (Khusus untuk Sign Up) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="full_name">
            Nama Lengkap (Isi jika daftar baru)
          </label>
          <input id="full_name" name="full_name" type="text" className="p-2 border rounded text-black" placeholder="Budi Santoso" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="password">
            Password
          </label>
          <input id="password" name="password" type="password" required className="p-2 border rounded text-black" placeholder="******" />
        </div>

        <div className="flex gap-4 pt-4">
          <button formAction={login} className="flex-1 p-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition">
            Log in
          </button>
          <button formAction={signup} className="flex-1 p-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition">
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}
