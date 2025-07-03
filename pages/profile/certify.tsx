import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiAward } from "react-icons/fi";
import { useUser } from "@/lib/useUser";
import { supabase } from "@/lib/supabaseClient";

export default function CertifyPage() {
  const { user } = useUser();
  const [status, setStatus] = useState<"未申請" | "審核中" | "已認證" | "未通過">("未申請");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // 載入用戶過去的申請
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("user_certifications")
        .select("desc,image_url,status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .maybeSingle();
      if (data) {
        setStatus(data.status || "審核中");
        setDesc(data.desc || "");
        setFileUrl(data.image_url || "");
      }
    })();
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    // 先上傳圖檔
    let image_url = fileUrl;
    if (file) {
      const { data, error } = await supabase.storage
        .from("certify_uploads")
        .upload(`${user.id}/${Date.now()}_${file.name}`, file, { upsert: true });
      if (error) {
        alert("圖檔上傳失敗：" + error.message);
        setLoading(false);
        return;
      }
      image_url = data?.path ? supabase.storage.from("certify_uploads").getPublicUrl(data.path).data.publicUrl : "";
      setFileUrl(image_url);
    }

    // 寫入/更新資料表
    const { error } = await supabase.from("user_certifications").upsert(
      {
        user_id: user.id,
        desc,
        image_url,
        status: "審核中",
      },
      { onConflict: ["user_id"] }
    );
    setLoading(false);
    if (error) {
      alert("申請失敗：" + error.message);
    } else {
      setStatus("審核中");
      alert("申請送出，請等待審核！");
    }
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
              disabled={status === "審核中" || status === "已認證"}
            />
            <label className="text-[#FFD700] font-bold">上傳身份／作品證明圖檔（jpg/png）</label>
            <input
              type="file"
              accept="image/*"
              className="rounded-xl bg-[#222d44] text-white p-3"
              onChange={e => setFile(e.target.files?.[0] || null)}
              disabled={status === "審核中" || status === "已認證"}
              required={!fileUrl}
            />
            {file && <span className="text-sm text-[#FFD700]">{file.name}</span>}
            {fileUrl && (
              <div className="mt-2">
                <img src={fileUrl} alt="已上傳" className="h-20 rounded shadow border border-[#FFD700]/40" />
              </div>
            )}
            <button
              type="submit"
              disabled={status === "審核中" || status === "已認證" || loading}
              className={`rounded-xl px-6 py-3 font-bold mt-3 ${status === "未申請" || status === "未通過"
                ? "bg-[#FFD700] text-[#0d1827] hover:bg-[#ffe366] transition"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"} ${loading ? "opacity-70" : ""}`}
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
