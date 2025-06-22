import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiAward } from "react-icons/fi";

export default function CertifyPage() {
  const [status, setStatus] = useState<"未申請" | "審核中" | "已認證" | "未通過">("未申請");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("審核中");
    // 這裡未來可呼叫API
  }

  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-xl mx-auto pt-10 pb-20 px-4 w-full">
        <div className="flex items-center mb-7">
          <FiAward size={32} className="text-[#FFD700] mr-3" />
          <span className="text-3xl font-extrabold text-[#FFD700] tracking-wide">原創認證申請</span>
        </div>
        <div className="bg-[#161e2d] p-8 rounded-2xl shadow-xl border border-[#FFD700]/30">
          <div className="mb-4 text-[#FFD700] text-lg font-bold">藍勾勾原創認證說明</div>
          <ul className="text-gray-300 text-base mb-6 pl-5 list-disc">
            <li>僅限原創內容創作者，需提供可辨識個人資料及代表作證明</li>
            <li>通過認證後，所有創作將獲得藍勾勾標章，平台優先曝光</li>
            <li>認證資料僅用於平台審查，絕不外洩</li>
          </ul>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="text-[#FFD700] font-bold">個人簡介／創作自述</label>
            <textarea
              className="rounded-xl bg-[#222d44] text-white p-3 resize-none min-h-[80px]"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              required
              placeholder="請簡述你的創作背景、代表作、原創精神等"
              disabled={status !== "未申請" && status !== "未通過"}
            />
            <label className="text-[#FFD700] font-bold">上傳身份／作品證明圖檔（jpg/png）</label>
            <input
              type="file"
              accept="image/*"
              className="rounded-xl bg-[#222d44] text-white p-3"
              onChange={e => setFile(e.target.files?.[0] || null)}
              disabled={status !== "未申請" && status !== "未通過"}
              required={status === "未申請" || status === "未通過"}
            />
            {file && <span className="text-sm text-[#FFD700]">{file.name}</span>}
            <button
              type="submit"
              disabled={status !== "未申請" && status !== "未通過"}
              className={`rounded-xl px-6 py-3 font-bold mt-3 ${status === "未申請" || status === "未通過"
                ? "bg-[#FFD700] text-[#0d1827] hover:bg-[#ffe366] transition"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"}`}
            >
              {status === "未申請" || status === "未通過" ? "送出申請" : "送出申請"}
            </button>
          </form>
          <div className="mt-6">
            {status === "審核中" && <div className="text-blue-400 font-bold">審核中，預計3~5個工作天內回覆，請耐心等候。</div>}
            {status === "已認證" && <div className="text-[#FFD700] font-bold">恭喜，您已獲得原創認證！所有創作將標註藍勾勾。</div>}
            {status === "未通過" && <div className="text-red-400 font-bold">很抱歉，認證未通過，請檢查資料再申請。</div>}
          </div>
        </div>
      </div>
      <Footer />
      <style>{`
        .font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }
      `}</style>
    </div>
  );
}
