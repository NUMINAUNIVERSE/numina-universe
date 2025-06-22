import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import Link from "next/link";

export default function Forgot() {
  const [email, setEmail] = useState("");

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`重設密碼信已寄出至：${email}（請串接API）`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1827] text-white font-sans">
      <Navbar />
      <main className="flex flex-col items-center justify-center flex-grow px-4 py-16">
        <div className="bg-[#161e2d] rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-[#FFD700] mb-6 text-center">忘記密碼</h1>
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
            >
              寄送重設密碼連結
            </button>
          </form>
          <div className="flex justify-between items-center mt-6">
            <Link href="/login" className="text-[#FFD700] underline">回登入頁</Link>
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
