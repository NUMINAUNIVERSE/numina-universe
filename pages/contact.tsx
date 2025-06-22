import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiMail } from "react-icons/fi";
import React, { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    // MVP 可串API寄送表單
  }

  return (
    <div className="min-h-screen bg-[#0d1827] text-white font-sans flex flex-col">
      <Navbar />
      <div className="max-w-xl mx-auto pt-10 pb-20 px-4 w-full">
        <div className="flex items-center mb-7">
          <FiMail size={32} className="text-[#FFD700] mr-3" />
          <span className="text-3xl font-extrabold text-[#FFD700] tracking-wide">聯絡我們</span>
        </div>
        <div className="bg-[#161e2d] rounded-2xl p-8 shadow-xl border border-[#FFD700]/30">
          {!sent ? (
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div>
                <label className="text-[#FFD700] font-bold">姓名</label>
                <input type="text" className="rounded-xl bg-[#222d44] text-white p-3 w-full"
                  value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div>
                <label className="text-[#FFD700] font-bold">Email</label>
                <input type="email" className="rounded-xl bg-[#222d44] text-white p-3 w-full"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="text-[#FFD700] font-bold">訊息內容</label>
                <textarea className="rounded-xl bg-[#222d44] text-white p-3 w-full min-h-[100px]"
                  value={msg} onChange={e => setMsg(e.target.value)} required />
              </div>
              <button
                type="submit"
                className="rounded-xl px-6 py-3 font-bold bg-[#FFD700] text-[#0d1827] hover:bg-[#ffe366] transition"
              >送出聯絡</button>
            </form>
          ) : (
            <div className="text-[#FFD700] font-bold text-xl text-center py-12">
              感謝您的聯繫！<br />
              我們已收到您的訊息，將儘速回覆。
            </div>
          )}
        </div>
      </div>
      <Footer />
      <style>{`
        .font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }
      `}</style>
    </div>
  );
}
