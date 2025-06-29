import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setMsg("重設密碼郵件寄送失敗：" + error.message);
    } else {
      setMsg(`已寄送重設密碼連結到：${email}，請至信箱查收`);
      setTimeout(() => window.location.href = "/login", 4000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1827] text-white font-sans">
      <Navbar />
      <main className="flex flex-col items-center justify-center flex-grow px-4 py-16">
        <div className="bg-[#161e2d] rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-[#FFD700] mb-6 text-center">重設密碼</h1>
          {msg && <div className="mb-4 text-center font-bold text-[#ffd700]">{msg}</div>}
          <form onSubmit={handleForgot} className="space-y-5">
            <div>
              <label className="block text-base font-semibold mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg bg-[#0d1827] text-white border border-[#FFD700]/40 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="輸入信箱"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#FFD700] text-[#0d1827] font-bold rounded-lg py-2 mt-2 hover:bg-[#fff9e3] transition"
              disabled={loading}
            >
              {loading ? "發送中…" : "發送重設連結"}
            </button>
          </form>
          <div className="flex justify-between items-center mt-6">
            <Link href="/login" className="text-[#FFD700] underline">回登入</Link>
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
