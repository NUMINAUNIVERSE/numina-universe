import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

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
    // 註冊（email, password, nickname 寫進 user_metadata）
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname }
      }
    });
    if (error) {
      setMsg("註冊失敗：" + error.message);
    } else {
      setMsg("註冊成功，請至信箱點擊驗證連結！");
      setTimeout(() => window.location.href = "/login", 3000);
    }
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
              <label className="block text-base font-semibold mb-1">暱稱</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-[#0d1827] text-white border border-[#FFD700]/40 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="輸入您的暱稱"
                required
                autoComplete="nickname"
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
