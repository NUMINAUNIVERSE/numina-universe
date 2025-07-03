import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiShield } from "react-icons/fi";
import { useUser } from "@/lib/useUser";
import { supabase } from "@/lib/supabaseClient";

export default function SecurityPage() {
  const { user } = useUser();
  const [password, setPassword] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [twofa, setTwofa] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handlePwChange(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg("");
    if (newPw !== confirmPw) {
      setPwMsg("兩次輸入的新密碼不一致！");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setLoading(false);
    if (error) {
      setPwMsg("密碼修改失敗：" + error.message);
    } else {
      setPwMsg("密碼修改成功！");
      setPassword(""); setNewPw(""); setConfirmPw("");
    }
  }

  // 二階段驗證預留
  function handle2faChange() {
    setTwofa(v => !v);
    // 預留未來串接
  }

  return (
    <div className="min-h-screen bg-[#0d1827] text-white font-sans flex flex-col">
      <Navbar />
      <div className="max-w-xl mx-auto pt-10 pb-20 px-4 w-full">
        <div className="flex items-center mb-7">
          <FiShield size={32} className="text-[#FFD700] mr-3" />
          <span className="text-3xl font-extrabold text-[#FFD700] tracking-wide">帳號安全設定</span>
        </div>
        <div className="bg-[#161e2d] p-8 rounded-2xl shadow-xl border border-[#FFD700]/30 mb-10">
          <div className="text-lg font-bold text-[#FFD700] mb-2">修改密碼</div>
          <form className="flex flex-col gap-4" onSubmit={handlePwChange}>
            <input
              className="rounded-xl bg-[#222d44] text-white p-3"
              type="password" placeholder="舊密碼"
              value={password} onChange={e => setPassword(e.target.value)} required
            />
            <input
              className="rounded-xl bg-[#222d44] text-white p-3"
              type="password" placeholder="新密碼"
              value={newPw} onChange={e => setNewPw(e.target.value)} required
            />
            <input
              className="rounded-xl bg-[#222d44] text-white p-3"
              type="password" placeholder="確認新密碼"
              value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required
            />
            <button
              type="submit"
              className="rounded-xl px-6 py-3 font-bold bg-[#FFD700] text-[#0d1827] hover:bg-[#ffe366] transition"
              disabled={loading}
            >儲存新密碼</button>
            {pwMsg && <div className="text-sm mt-2 text-[#FFD700]">{pwMsg}</div>}
          </form>
        </div>
        <div className="bg-[#161e2d] p-8 rounded-2xl shadow-xl border border-blue-400/30 mb-10">
          <div className="text-lg font-bold text-blue-400 mb-2">二階段驗證</div>
          <div className="flex items-center gap-3 mb-3">
            <label className="font-bold text-white">開啟二階段驗證（MVP預設關）</label>
            <input type="checkbox" checked={twofa} onChange={handle2faChange} className="w-5 h-5 accent-[#FFD700]" />
            <span className="text-sm text-gray-400">{twofa ? "已啟用" : "未啟用"}</span>
          </div>
          <div className="text-sm text-gray-400">提醒：開啟後每次登入將需要驗證手機/Email，增強帳號安全。</div>
        </div>
        <div className="text-gray-400 text-xs">建議：請定期更換密碼，勿外洩個資。</div>
      </div>
      <Footer />
      <style>{`
        .font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }
      `}</style>
    </div>
  );
}
