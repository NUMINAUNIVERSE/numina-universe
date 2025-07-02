import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

// 檢查 username 是否唯一
async function checkUsernameUnique(username: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .single();
  return !data; // 若沒撈到 data，代表可用
}

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  // 即時檢查 username 唯一
  const handleUsernameChange = async (val: string) => {
    setUsername(val);
    if (val.length >= 3) {
      const unique = await checkUsernameUnique(val);
      setUsernameAvailable(unique);
    } else {
      setUsernameAvailable(null);
    }
  };

  // Google 一鍵註冊
  const handleGoogleSignup = async () => {
    setLoading(true);
    setMsg("");
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) {
      setMsg("Google 註冊失敗：" + error.message);
    }
    setLoading(false);
  };

  // Email 註冊
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    // username 唯一性檢查
    if (username.length < 3) {
      setMsg("用戶名稱需至少 3 個字元！");
      setLoading(false);
      return;
    }
    const isUnique = await checkUsernameUnique(username);
    if (!isUnique) {
      setMsg("用戶名稱已被使用，請換一個！");
      setLoading(false);
      return;
    }

    // 註冊帳號（寫進 supabase.auth）
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, name }
      }
    });

    if (error) {
      setMsg("註冊失敗：" + error.message);
      setLoading(false);
      return;
    }

    // 註冊成功後，同步寫入 users table
    if (data && data.user) {
      const { error: insertErr } = await supabase.from("users").insert({
        id: data.user.id,
        username,
        name,
        email,
        avatar_url: data.user.user_metadata?.avatar_url ?? "",
        // 你還可根據 users schema 再補 bio/social_links 等欄位
      });
      if (insertErr) {
        setMsg("註冊成功，但同步用戶資料時發生錯誤，請聯絡管理員！");
        setLoading(false);
        return;
      }
    }

    setMsg("註冊成功，請至信箱點擊驗證連結！");
    setTimeout(() => window.location.href = "/login", 3000);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1827] text-white font-sans">
      <Navbar />
      <main className="flex flex-col items-center justify-center flex-grow px-4 py-16">
        <div className="bg-[#161e2d] rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-[#FFD700] mb-6 text-center">註冊 NUMINA UNIVERSE</h1>
          {msg && <div className="mb-4 text-center font-bold text-[#ffd700]">{msg}</div>}
          <button
            className="w-full flex items-center justify-center gap-3 bg-white text-[#0d1827] font-bold rounded-lg py-2 mb-6 hover:bg-[#fff9e3] transition"
            onClick={handleGoogleSignup}
            disabled={loading}
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 48 48"><g>
              <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.4 32.9 29.7 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.8 0 5.3 1 7.3 2.6l6.3-6.3C33.8 5.1 29.2 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11.1 0 20-8.9 20-20 0-1.3-.1-2.7-.5-4z"/>
              <path fill="#34A853" d="M6.3 14.6l7 5.1C15.3 17.2 19.3 14 24 14c2.8 0 5.3 1 7.3 2.6l6.3-6.3C33.8 5.1 29.2 3 24 3c-7.6 0-14 4.3-17.7 10.6z"/>
              <path fill="#FBBC05" d="M24 43c5.4 0 10.4-1.8 14.3-5l-6.6-5.4C29.7 36 27.1 37 24 37c-5.6 0-10.3-3.7-12-8.7l-7 5.1C9.4 40.1 16.2 43 24 43z"/>
              <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-3.6 5.5-7.1 7l6.6 5.4C42.1 37.2 45 30.7 45 24c0-1.3-.1-2.7-.5-4z"/>
            </g></svg>
            Google 一鍵註冊
          </button>
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-base font-semibold mb-1">用戶名稱 <span className="text-xs text-[#ffd700]">(全站唯一、僅能英數/底線)</span></label>
              <input
                type="text"
                className={`w-full px-4 py-2 rounded-lg bg-[#0d1827] text-white border ${usernameAvailable === false ? "border-red-400" : "border-[#FFD700]/40"} focus:outline-none focus:ring-2 focus:ring-[#FFD700]`}
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                placeholder="設定您的唯一用戶名稱（如 numina_god）"
                required
                autoComplete="username"
                minLength={3}
                maxLength={32}
              />
              {username && (
                <div className={`text-xs mt-1 ${usernameAvailable === false ? "text-red-400" : "text-green-400"}`}>
                  {usernameAvailable === false
                    ? "此用戶名稱已被註冊"
                    : usernameAvailable === true && "此用戶名稱可用"}
                </div>
              )}
            </div>
            <div>
              <label className="block text-base font-semibold mb-1">名字/顯示名稱</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-[#0d1827] text-white border border-[#FFD700]/40 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="您希望被稱呼的名字"
                required
                autoComplete="name"
                maxLength={32}
              />
            </div>
            <div>
              <label className="block text-base font-semibold mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg bg-[#0d1827] text-white border border-[#FFD700]/40 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="輸入信箱"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-base font-semibold mb-1">密碼</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg bg-[#0d1827] text-white border border-[#FFD700]/40 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="輸入密碼"
                required
                autoComplete="new-password"
                minLength={6}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#FFD700] text-[#0d1827] font-bold rounded-lg py-2 mt-2 hover:bg-[#fff9e3] transition"
              disabled={loading}
            >
              {loading ? "註冊中…" : "註冊"}
            </button>
          </form>
          <div className="flex justify-between items-center mt-6">
            <Link href="/login" className="text-[#FFD700] underline">已有帳號？登入</Link>
          </div>
        </div>
      </main>
      <Footer />
      <style>{`
        .font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }
      `}</style>
    </div>
  );
}
