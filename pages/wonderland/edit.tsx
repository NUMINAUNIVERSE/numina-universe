import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";

type WorkType = "插畫" | "漫畫" | "貼圖";
interface Block { type: string; url: string }

const DRAFT_KEY = "numina_wonderland_draft";

export default function WonderlandEdit() {
  const [type, setType] = useState<WorkType>("插畫");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState<{ file: File, url: string }[]>([]);
  const [pdf, setPdf] = useState<{ file: File, url: string } | null>(null);
  const [stickerPack, setStickerPack] = useState<{ file: File, url: string }[]>([]);
  const [pricing, setPricing] = useState("免費");
  const [price, setPrice] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [showDraftMsg, setShowDraftMsg] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [authorId, setAuthorId] = useState<string | null>(null);

  const router = useRouter();

  // 取得會員ID（驗證作者）
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthorId(user?.id ?? null);
    });
  }, []);

  // 載入草稿
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        setType(d.type || "插畫");
        setTitle(d.title || "");
        setDesc(d.desc || "");
        setImages(d.images || []);
        setPdf(d.pdf || null);
        setStickerPack(d.stickerPack || []);
        setPricing(d.pricing || "免費");
        setPrice(d.price || "");
      } catch { }
    }
  }, []);

  // 圖片上傳預覽
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setImages([...images, ...files]);
  };
  // 貼圖包上傳預覽
  const handleStickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setStickerPack([...stickerPack, ...files]);
  };
  // PDF漫畫書
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setPdf({
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0])
    });
  };

  // 儲存草稿
  const saveDraft = () => {
    const draft = { type, title, desc, images, pdf, stickerPack, pricing, price };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setShowDraftMsg(true);
    setTimeout(() => setShowDraftMsg(false), 2000);
  };

  // 發布功能，串接 Supabase
  const publish = async () => {
    setMsg("");
    setLoading(true);
    try {
      if (!authorId) {
        setMsg("請先登入會員才能發布作品！");
        setLoading(false);
        return;
      }
      if (!title.trim()) {
        setMsg("請輸入標題！");
        setLoading(false);
        return;
      }
      // 上傳封面（用第一張圖片）
      let coverUrl = "";
      if (images.length > 0) {
        const file = images[0].file;
        const { data, error } = await supabase.storage
          .from("covers")
          .upload(`wonderland/${Date.now()}_${file.name}`, file, { upsert: true });
        if (error) throw error;
        coverUrl = supabase.storage.from("covers").getPublicUrl(data.path).data.publicUrl;
      }

      // 上傳所有圖片
      const imgUrls: string[] = [];
      for (const img of images) {
        const { data, error } = await supabase.storage
          .from("covers")
          .upload(`wonderland/${Date.now()}_${img.file.name}`, img.file, { upsert: true });
        if (!error && data?.path) {
          imgUrls.push(supabase.storage.from("covers").getPublicUrl(data.path).data.publicUrl);
        }
      }

      // 上傳貼圖
      const stickerUrls: string[] = [];
      for (const stk of stickerPack) {
        const { data, error } = await supabase.storage
          .from("covers")
          .upload(`wonderland/sticker_${Date.now()}_${stk.file.name}`, stk.file, { upsert: true });
        if (!error && data?.path) {
          stickerUrls.push(supabase.storage.from("covers").getPublicUrl(data.path).data.publicUrl);
        }
      }

      // 上傳 PDF
      let pdfUrl = "";
      if (pdf) {
        const { data, error } = await supabase.storage
          .from("covers")
          .upload(`wonderland/pdf_${Date.now()}_${pdf.file.name}`, pdf.file, { upsert: true });
        if (!error && data?.path) {
          pdfUrl = supabase.storage.from("covers").getPublicUrl(data.path).data.publicUrl;
        }
      }

      // 整理 blocks/內容結構
      const blocks: Block[] = [
        ...imgUrls.map(url => ({ type: "image", url })),
        ...(pdfUrl ? [{ type: "pdf", url: pdfUrl }] : []),
        ...stickerUrls.map(url => ({ type: "sticker", url }))
      ];

      // 發布到 works 表（欄位對齊schema）
      const payload = {
        title,
        desc,
        cover: coverUrl,
        type: "wonderland",
        blocks,
        main_cat: type,
        tags: [],
        pay_mode: pricing === "免費" ? "free" : pricing === "打賞贊助" ? "tip" : pricing === "訂閱制" ? "sub" : "single",
        pay_price: (pricing === "單篇收費" || pricing === "訂閱制") ? parseInt(price) || 0 : 0,
        author_id: authorId,
        created_at: new Date(),
      };

      const { error } = await supabase.from("works").insert([payload]);
      if (error) {
        setMsg("發佈失敗：" + error.message);
      } else {
        setMsg("發佈成功！即將跳轉 WonderLand 首頁…");
        setTimeout(() => router.push("/wonderland"), 1500);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMsg("錯誤：" + err.message);
      } else {
        setMsg("發生未知錯誤");
      }
    }
    setLoading(false);
  };

  // 預覽
  const preview = () => setPreviewMode(true);

  return (
    <div className="min-h-screen bg-[#0d1a2d] text-white flex flex-col">
      <Navbar />
      <div className="max-w-2xl w-full mx-auto flex-1 py-10 px-2 sm:px-4">
        <h2 className="text-3xl font-bold mb-6 text-[#ffd700]">WonderLand 作品編輯器</h2>
        {msg && (
          <div className="mb-4 text-center text-[#ffd700] font-bold">{msg}</div>
        )}
        {!previewMode ? (
          <>
            {/* 作品類型 */}
            <div className="mb-4">
              <label className="font-bold mr-3 text-[#ffd700]">作品類型：</label>
              <select className="rounded px-3 py-1 bg-[#162040] text-white" value={type} onChange={e => setType(e.target.value as WorkType)}>
                <option value="插畫">插畫</option>
                <option value="漫畫">漫畫</option>
                <option value="貼圖">貼圖</option>
              </select>
            </div>
            {/* 標題 */}
            <div className="mb-4">
              <label className="font-bold mr-3 text-[#ffd700]">標題：</label>
              <input className="rounded px-3 py-2 w-full bg-[#162040] border border-[#ffd700] text-white" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            {/* 簡介 */}
            <div className="mb-4">
              <label className="font-bold mr-3 text-[#ffd700]">作品簡介：</label>
              <textarea className="rounded px-3 py-2 w-full bg-[#162040] border border-[#ffd700] text-white" rows={3} value={desc} onChange={e => setDesc(e.target.value)} />
            </div>
            {/* 插畫/漫畫圖像上傳 */}
            {(type === "插畫" || type === "漫畫") && (
              <div className="mb-4">
                <label className="font-bold text-[#ffd700]">插畫/漫畫圖像：</label>
                <input type="file" accept="image/*" multiple className="mb-1" onChange={handleImageChange} />
                <div className="flex flex-wrap gap-3 mt-2">
                  {images.map((f, i) =>
                    <img key={i} src={f.url} alt="" className="w-24 h-24 object-cover rounded-lg border-2 border-[#ffd70055] bg-[#181f32]" />
                  )}
                </div>
              </div>
            )}
            {/* PDF漫畫書上傳 */}
            {type === "漫畫" && (
              <div className="mb-4">
                <label className="font-bold text-[#ffd700]">PDF漫畫電子書（僅限閱讀，不可下載）：</label>
                <input type="file" accept="application/pdf" className="mb-1" onChange={handlePdfChange} />
                {pdf && (
                  <iframe src={pdf.url} className="w-full h-60 rounded-lg mt-2 border border-[#ffd700]" title="pdf-preview" />
                )}
              </div>
            )}
            {/* 貼圖上傳 */}
            {type === "貼圖" && (
              <div className="mb-4">
                <label className="font-bold text-[#ffd700]">貼圖包上傳：</label>
                <input type="file" accept="image/*" multiple className="mb-1" onChange={handleStickerChange} />
                <div className="flex flex-wrap gap-3 mt-2">
                  {stickerPack.map((f, i) =>
                    <img key={i} src={f.url} alt="" className="w-16 h-16 object-cover rounded-lg border border-[#ffd70044] bg-[#181f32]" />
                  )}
                </div>
              </div>
            )}
            {/* 收費設定 */}
            <div className="mb-4">
              <label className="font-bold mr-3 text-[#ffd700]">收費方式：</label>
              <select className="rounded px-3 py-1 bg-[#162040] text-white" value={pricing} onChange={e => setPricing(e.target.value)}>
                <option>免費</option>
                <option>單篇收費</option>
                <option>訂閱制</option>
                <option>打賞贊助</option>
              </select>
              {(pricing === "單篇收費" || pricing === "訂閱制") &&
                <input className="ml-2 px-3 py-1 rounded bg-[#162040] border border-[#ffd700] text-white w-32" type="number" min="1" value={price} onChange={e => setPrice(e.target.value)} placeholder="金額(元)" />
              }
            </div>
            {/* 操作按鈕 */}
            <div className="flex gap-3 mt-8">
              <button className="px-6 py-2 bg-gradient-to-r from-[#ffd700] to-[#fffde4] rounded-xl text-[#181f32] font-bold hover:scale-105 shadow"
                onClick={preview}>預覽</button>
              <button className="px-6 py-2 border border-[#ffd700] rounded-xl text-[#ffd700] font-bold hover:bg-[#222]"
                onClick={saveDraft}>儲存草稿</button>
              <button className="px-6 py-2 bg-[#ff5aac] rounded-xl text-white font-bold hover:bg-[#ffaddc]"
                onClick={publish} disabled={loading}>
                {loading ? "發布中…" : "發布"}
              </button>
            </div>
            {showDraftMsg && (
              <div className="mt-4 text-[#ffd700] font-bold text-base">草稿已暫存於本機，下次可自動載入！</div>
            )}
          </>
        ) : (
          // 預覽模式
          <div className="bg-[#192243] rounded-2xl p-6 mt-2">
            <div className="text-2xl font-bold mb-2">{title}</div>
            <div className="mb-2 text-[#ffd700]">{type}</div>
            <div className="mb-2">{desc}</div>
            {(type === "插畫" || type === "漫畫") && (
              <div className="flex flex-wrap gap-3 mb-2">
                {images.map((f, i) =>
                  <img key={i} src={f.url} className="w-24 h-24 object-cover rounded-lg border-2 border-[#ffd70055] bg-[#181f32]" />
                )}
              </div>
            )}
            {type === "漫畫" && pdf && (
              <iframe src={pdf.url} className="w-full h-60 rounded-lg mt-2 border border-[#ffd700]" title="pdf-preview" />
            )}
            {type === "貼圖" && stickerPack.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-3">
                {stickerPack.map((f, i) =>
                  <img key={i} src={f.url} className="w-16 h-16 object-cover rounded-lg border border-[#ffd70044] bg-[#181f32]" />
                )}
              </div>
            )}
            <div className="mt-3 text-[#ffd700] font-bold">{pricing} {((pricing === "單篇收費" || pricing === "訂閱制") && price) ? `NT$${price}` : ""}</div>
            <div className="flex gap-3 mt-8">
              <button className="px-6 py-2 bg-[#ffd700] rounded-xl text-[#181f32] font-bold hover:bg-[#fffde4]"
                onClick={() => setPreviewMode(false)}>返回編輯</button>
              <button className="px-6 py-2 bg-[#ff5aac] rounded-xl text-white font-bold hover:bg-[#ffaddc]"
                onClick={publish} disabled={loading}>
                {loading ? "發布中…" : "發布"}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
