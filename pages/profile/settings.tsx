import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiSettings, FiTrash2 } from "react-icons/fi";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/hooks/useUser"; // 請用你的 useUser hook 或 AuthContext

export default function SettingsPage() {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [lang, setLang] = useState("zh-TW");
  const [notify, setNotify] = useState(true);
  const [msg, setMsg] = useState("");

  // 載入目前用戶資料
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("users")
        .select("name, username, email, lang")
        .eq("id", user.id)
        .single();
      if (data) {
        setName(data.name || "");
        setUsername(data.username || "");
        setEmail(data.email || "");
        setLang(data.lang || "zh-TW");
      }
    })();
  }, [user]);

  // 儲存設定
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase
      .from("users")
      .update({
        name,
        username,
        email,
        lang,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    if (error) {
      setMsg("儲存失敗，請重試");
    } else {
      setMsg("設定已儲存！");
    }
  }
  function handleDelete() {
    if (window.confirm("確定要刪除帳號嗎？此動作無法復原！")) {
      setMsg("（MVP僅顯示訊息，未真實刪除）");
      // 未真實刪除帳號，僅提示訊息
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
        <form
          className="bg-[#161e2d] p-8 rounded-2xl shadow-xl border border-[#FFD700]/30 flex flex-col gap-4"
          onSubmit={handleSave}
        >
          <div>
            <label className="block mb-1 text-[#FFD700] font-bold">顯示名稱</label>
            <input
              className="rounded-xl bg-[#222d44] text-white p-3 w-full"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={30}
              required
              placeholder="請輸入顯示名稱"
            />
            <div className="text-xs text-[#ffd70099] mt-1">這是你在平台上顯示給他人看的名稱。</div>
          </div>
          <div>
            <label className="block mb-1 text-[#FFD700] font-bold">帳號（Username）</label>
            <input
              className="rounded-xl bg-[#222d44] text-white p-3 w-full"
              value={username}
              onChange={e => setUsername(e.target.value.replace(/[^\w]/g, ""))}
              maxLength={24}
              minLength={4}
              pattern="^[a-zA-Z0-9_]+$"
              required
              placeholder="請輸入帳號"
            />
            <div className="text-xs text-[#ffd70099] mt-1">
              僅能包含英數與底線，平台唯一，用於登入及個人網址。
            </div>
          </div>
          <div>
            <label className="block mb-1 text-[#FFD700] font-bold">Email</label>
            <input
              type="email"
              className="rounded-xl bg-[#222d44] text-white p-3 w-full"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="請輸入Email"
            />
          </div>
          <div>
            <label className="block mb-1 text-[#FFD700] font-bold">介面語言</label>
            <select
              className="rounded-xl bg-[#222d44] text-white p-3 w-full"
              value={lang}
              onChange={e => setLang(e.target.value)}
            >
              <option value="zh-TW">繁體中文</option>
              <option value="en-US">English</option>
              <option value="ja-JP">日本語</option>
            </select>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <input
              type="checkbox"
              checked={notify}
              onChange={() => setNotify(v => !v)}
              className="w-5 h-5 accent-[#FFD700]"
              id="notify"
            />
            <label className="font-bold text-white" htmlFor="notify">
              開啟平台通知（新活動／推薦／重要公告）
            </label>
          </div>
          <button
            type="submit"
            className="rounded-xl px-6 py-3 font-bold bg-[#FFD700] text-[#0d1827] hover:bg-[#ffe366] transition mt-3"
          >
            儲存設定
          </button>
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
