import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiSettings, FiTrash2 } from "react-icons/fi";

export default function SettingsPage() {
  const [nickname, setNickname] = useState("男神");
  const [email, setEmail] = useState("nushen@numinauniverse.com");
  const [lang, setLang] = useState("zh-TW");
  const [notify, setNotify] = useState(true);
  const [msg, setMsg] = useState("");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMsg("設定已儲存！");
    // 這裡未來可串API
  }
  function handleDelete() {
    if (window.confirm("確定要刪除帳號嗎？此動作無法復原！")) {
      // TODO: API
      setMsg("（MVP僅顯示訊息，未真實刪除）");
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1827] text-white font-sans flex flex-col">
      <Navbar />
      <div className="max-w-xl mx-auto pt-10 pb-20 px-4 w-full">
        <div className="flex items-center mb-7">
          <FiSettings size={32} className="text-[#FFD700] mr-3" />
          <span className="text-3xl font-extrabold text-[#FFD700] tracking-wide">帳號與平台設定</span>
        </div>
        <form className="bg-[#161e2d] p-8 rounded-2xl shadow-xl border border-[#FFD700]/30 flex flex-col gap-4" onSubmit={handleSave}>
          <div>
            <label className="block mb-1 text-[#FFD700] font-bold">暱稱</label>
            <input
              className="rounded-xl bg-[#222d44] text-white p-3 w-full"
              value={nickname} onChange={e => setNickname(e.target.value)} required
            />
          </div>
          <div>
            <label className="block mb-1 text-[#FFD700] font-bold">Email</label>
            <input
              type="email"
              className="rounded-xl bg-[#222d44] text-white p-3 w-full"
              value={email} onChange={e => setEmail(e.target.value)} required
            />
          </div>
          <div>
            <label className="block mb-1 text-[#FFD700] font-bold">介面語言</label>
            <select
              className="rounded-xl bg-[#222d44] text-white p-3 w-full"
              value={lang} onChange={e => setLang(e.target.value)}
            >
              <option value="zh-TW">繁體中文</option>
              <option value="en-US">English</option>
              <option value="ja-JP">日本語</option>
            </select>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <input type="checkbox" checked={notify} onChange={() => setNotify(v => !v)} className="w-5 h-5 accent-[#FFD700]" />
            <label className="font-bold text-white">開啟平台通知（新活動／推薦／重要公告）</label>
          </div>
          <button
            type="submit"
            className="rounded-xl px-6 py-3 font-bold bg-[#FFD700] text-[#0d1827] hover:bg-[#ffe366] transition mt-3"
          >儲存設定</button>
          {msg && <div className="text-sm mt-2 text-[#FFD700]">{msg}</div>}
        </form>
        <div className="mt-10 flex justify-end">
          <button
            className="flex items-center gap-2 text-red-400 border border-red-400 px-4 py-2 rounded-lg hover:bg-red-400 hover:text-white transition font-bold"
            onClick={handleDelete}
          >
            <FiTrash2 /> 刪除帳號
          </button>
        </div>
      </div>
      <Footer />
      <style>{`
        .font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }
      `}</style>
    </div>
  );
}
