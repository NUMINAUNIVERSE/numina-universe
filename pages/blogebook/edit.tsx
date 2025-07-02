import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";

type BlockType = "text" | "image" | "carousel" | "sticker" | "audio" | "pdf";
type Block = {
  type: BlockType;
  files?: File[];
  value?: string;
  preview?: string[];
};

const DRAFT_KEY = "numina_blogebook_draft";

export default function BlogeBookEdit() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [mainCat, setMainCat] = useState("小說");
  const [tags, setTags] = useState<string[]>(["AI", "宇宙"]);
  const [newTag, setNewTag] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [payMode, setPayMode] = useState("free");
  const [payPrice, setPayPrice] = useState("");
  const [showStickerModal, setShowStickerModal] = useState(false);
  const [showDraftMsg, setShowDraftMsg] = useState(false);
  const [showLoadDraft, setShowLoadDraft] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const wonderStickers = [
    { name: "爆萌柴犬", url: "/stickers/dog1.png" },
    { name: "Q版宇宙人", url: "/stickers/alien1.png" },
    { name: "NUMINA 金色LOGO", url: "/stickers/numina_gold.png" }
  ];

  // 草稿自動載入
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) setShowLoadDraft(true);
  }, []);

  function handleLoadDraft() {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        setTitle(d.title || "");
        setMainCat(d.mainCat || "");
        setTags(d.tags || []);
        setBlocks(d.blocks || []);
        setPayMode(d.payMode || "free");
        setPayPrice(d.payPrice || "");
        setCoverPreview(d.coverPreview || null);
        setDesc(d.desc || "");
        setShowLoadDraft(false);
      } catch {}
    }
  }

  // 封面上傳預覽
  function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      setCoverFile(e.target.files[0]);
      setCoverPreview(URL.createObjectURL(e.target.files[0]));
    }
  }

  // 標籤
  function addTag() {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  }
  function removeTag(tag: string) {
    setTags(tags.filter(t => t !== tag));
  }

  // 積木內容
  function addBlock(type: BlockType) {
    setBlocks([...blocks, { type }]);
  }
  function updateBlock(idx: number, update: Partial<Block>) {
    setBlocks(blocks.map((b, i) => (i === idx ? { ...b, ...update } : b)));
  }
  function removeBlock(idx: number) {
    setBlocks(blocks.filter((_, i) => i !== idx));
  }
  function moveBlock(idx: number, dir: -1 | 1) {
    if ((dir === -1 && idx === 0) || (dir === 1 && idx === blocks.length - 1)) return;
    const copy = [...blocks];
    const [item] = copy.splice(idx, 1);
    copy.splice(idx + dir, 0, item);
    setBlocks(copy);
  }
  function handleFileUpload(idx: number, files: FileList | null) {
    if (!files) return;
    const arr = Array.from(files);
    updateBlock(idx, {
      files: arr,
      preview: arr.map(f => URL.createObjectURL(f))
    });
  }
  // 貼圖積木
  function addStickerToBlock(idx: number, url: string) {
    updateBlock(idx, { preview: [url], value: url });
    setShowStickerModal(false);
  }

  // 儲存草稿
  function saveDraft() {
    const draft = {
      title, coverPreview, mainCat, tags, blocks, payMode, payPrice, desc
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setShowDraftMsg(true);
    setTimeout(() => setShowDraftMsg(false), 2000);
  }

  // 預覽功能
  function previewDraft() {
    alert("暫時demo：正式可跳新頁帶內容");
  }

  // 上傳檔案到 Supabase Storage，回傳公開網址
  async function uploadToStorage(file: File, folder: string) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substr(2, 6)}.${fileExt}`;
    const { error } = await supabase.storage
      .from("covers")  // bucket名稱，可依需求調整
      .upload(fileName, file, { upsert: true });
    if (error) {
      setMsg("檔案上傳失敗：" + error.message);
      return "";
    }
    const url = supabase.storage.from("covers").getPublicUrl(fileName).data.publicUrl;
    return url;
  }

  // 取得當前用戶
  const [authorId, setAuthorId] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthorId(user?.id ?? null);
    });
  }, []);

  // 發布
  async function publish() {
    setLoading(true);
    setMsg("");

    // 檢查必填
    if (!title || !authorId) {
      setMsg("請輸入標題並登入會員！");
      setLoading(false);
      return;
    }

    // 上傳封面
    let coverUrl = "";
    if (coverFile) {
      coverUrl = await uploadToStorage(coverFile, "cover");
    }

    // 上傳所有 blocks 檔案
    const uploadBlockFiles = async (b: Block, idx: number): Promise<Block> => {
      if (!b.files || b.files.length === 0) return b;
      const urls = [];
      for (let i = 0; i < b.files.length; i++) {
        const url = await uploadToStorage(b.files[i], `block${idx}`);
        urls.push(url);
      }
      return {
        ...b,
        value: urls.length === 1 ? urls[0] : undefined,
        preview: urls,
        files: undefined
      };
    };
    const realBlocks = [];
    for (let i = 0; i < blocks.length; i++) {
      realBlocks.push(await uploadBlockFiles(blocks[i], i));
    }

    // 整理payload，對齊schema
    const payload = {
      title,
      desc,
      cover: coverUrl,
      main_cat: mainCat,
      tags,
      pay_mode: payMode,
      pay_price: payPrice ? parseInt(payPrice) : 0,
      blocks: realBlocks,
      type: "blogebook",
      author_id: authorId,
      created_at: new Date(),
    };

    const { error } = await supabase.from("works").insert([payload]);
    if (error) {
      setMsg("發佈失敗：" + error.message);
    } else {
      setMsg("發佈成功！");
      setTimeout(() => router.push("/blogebook"), 1500);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0d1a2d] text-white flex flex-col">
      <Navbar />
      <div className="max-w-3xl w-full mx-auto flex-1 py-10 px-4">
        <h2 className="text-3xl font-bold mb-6 text-[#ffd700]">BlogeBook 編輯器</h2>
        {showLoadDraft && (
          <div className="mb-5 p-4 rounded-lg bg-[#181f32] border border-[#ffd700] flex items-center gap-3">
            <span>偵測到本機草稿，是否繼續編輯？</span>
            <button className="px-3 py-1 rounded bg-[#ffd700] text-[#181f32] font-bold" onClick={handleLoadDraft}>載入草稿</button>
            <button className="px-3 py-1 rounded bg-[#ffd70022] text-[#ffd700]" onClick={() => setShowLoadDraft(false)}>忽略</button>
          </div>
        )}

        {/* 標題 */}
        <div className="mb-4 flex gap-3 items-center">
          <label className="text-[#ffd700] min-w-[62px]">標題</label>
          <input
            className="flex-1 rounded px-4 py-2 bg-[#162040] border border-[#ffd700] text-xl"
            value={title} onChange={e => setTitle(e.target.value)}
            placeholder="請輸入BlogeBook標題"
          />
        </div>
        {/* 簡介 */}
        <div className="mb-4 flex gap-3 items-center">
            <label className="text-[#ffd700] min-w-[62px]">簡介</label>
            <textarea
              className="flex-1 rounded px-4 py-2 bg-[#162040] border border-[#ffd700] text-base"
              rows={2}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="請輸入簡介/描述，30字內吸引讀者"
              maxLength={60}
          />
        </div>
        {/* 封面 */}
        <div className="mb-4 flex gap-3 items-center">
          <label className="text-[#ffd700] min-w-[62px]">封面</label>
          <input type="file" accept="image/*" onChange={handleCover} />
          {coverPreview && (
            <img src={coverPreview} alt="cover" className="h-20 rounded-lg shadow border border-[#ffd700]" />
          )}
        </div>
        {/* 主分類 */}
        <div className="mb-4 flex gap-3 items-center">
          <label className="text-[#ffd700] min-w-[62px]">主題分類</label>
          <select className="rounded px-2 py-1 bg-[#162040] border border-[#ffd700] text-white"
            value={mainCat} onChange={e => setMainCat(e.target.value)}>
            <option>小說</option><option>散文</option><option>攝影</option>
            <option>漫畫</option><option>知識</option><option>心靈</option>
          </select>
        </div>
        {/* 標籤 */}
        <div className="mb-4 flex gap-3 items-center flex-wrap">
          <label className="text-[#ffd700] min-w-[62px]">標籤</label>
          <div className="flex gap-2 flex-wrap">
            {tags.map(tag => (
              <span key={tag} className="bg-[#ffd70025] text-[#ffd700] rounded px-3 py-1 text-base flex items-center">
                {tag}
                <button className="ml-1 text-white/60" onClick={() => removeTag(tag)}>✕</button>
              </span>
            ))}
            <input className="rounded px-2 py-1 w-28 bg-[#162040] border border-[#ffd700]" placeholder="新增標籤"
              value={newTag} onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => (e.key === "Enter" ? addTag() : null)} />
            <button onClick={addTag} className="px-3 py-1 border border-[#ffd700] rounded text-[#ffd700] bg-[#ffd70009]">＋</button>
          </div>
        </div>

        {/* 積木內容編輯區 */}
        <div className="bg-[#1b2239] rounded-2xl p-6 mb-4">
          <div className="flex gap-2 flex-wrap mb-5">
            <button className="add-block-btn" onClick={() => addBlock("text")}>＋文字段落</button>
            <button className="add-block-btn" onClick={() => addBlock("image")}>＋單張圖片</button>
            <button className="add-block-btn" onClick={() => addBlock("carousel")}>＋多圖橫滑</button>
            <button className="add-block-btn" onClick={() => addBlock("sticker")}>＋貼圖</button>
            <button className="add-block-btn" onClick={() => addBlock("audio")}>＋語音</button>
            <button className="add-block-btn" onClick={() => addBlock("pdf")}>＋PDF電子書</button>
          </div>
          <style>{`
            .add-block-btn{background:linear-gradient(90deg,#ffd700 65%,#42caff 100%);color:#23265b;border:none;border-radius:9px;padding:6px 18px;font-size:1rem;font-weight:bold;cursor:pointer;}
          `}</style>
          {blocks.map((block, idx) => (
            <div key={idx} className="block mb-4 p-4 rounded-xl bg-[#111826] relative">
              <label className="text-[#ffd700] font-bold block mb-1">積木{idx+1}（{block.type}）</label>
              <div className="absolute top-2 right-2 flex gap-1">
                <button onClick={() => moveBlock(idx, -1)} className="px-2 py-0.5 bg-[#ffd70033] rounded" title="上移">↑</button>
                <button onClick={() => moveBlock(idx, 1)} className="px-2 py-0.5 bg-[#ffd70033] rounded" title="下移">↓</button>
                <button onClick={() => removeBlock(idx)} className="px-2 py-0.5 bg-red-600 text-white rounded" title="刪除">✖</button>
              </div>
              {/* 積木本體 */}
              {block.type === "text" && (
                <textarea
                  className="w-full rounded bg-[#191f2c] text-white p-2"
                  rows={3}
                  placeholder="請輸入文字段落"
                  value={block.value || ""}
                  onChange={e => updateBlock(idx, { value: e.target.value })}
                />
              )}
              {block.type === "image" && (
                <div>
                  <input type="file" accept="image/*" onChange={e => handleFileUpload(idx, e.target.files)} />
                  {block.preview && block.preview[0] && (
                    <img src={block.preview[0]} className="w-44 mt-2 rounded" alt="" />
                  )}
                </div>
              )}
              {block.type === "carousel" && (
                <div>
                  <input type="file" accept="image/*" multiple onChange={e => handleFileUpload(idx, e.target.files)} />
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {block.preview && block.preview.map((src, i) => (
                      <img key={i} src={src} className="h-24 rounded" alt="" />
                    ))}
                  </div>
                </div>
              )}
              {block.type === "sticker" && (
                <div>
                  <button onClick={() => setShowStickerModal(true)} className="px-3 py-1 bg-[#ffd700] text-[#181f32] rounded font-bold mb-2">從WonderLand選擇貼圖</button>
                  {block.preview && block.preview[0] && (
                    <img src={block.preview[0]} className="h-16 mt-1" alt="sticker" />
                  )}
                  {showStickerModal && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
                      <div className="bg-[#181f32] p-7 rounded-2xl max-w-xs w-full">
                        <div className="text-lg font-bold text-[#ffd700] mb-2">WonderLand 貼圖</div>
                        <div className="flex gap-3 flex-wrap">
                          {wonderStickers.map((s, i) => (
                            <div key={i} className="flex flex-col items-center">
                              <img src={s.url} alt={s.name} className="h-14 rounded-lg shadow cursor-pointer border-2 border-transparent hover:border-[#ffd700]" onClick={() => addStickerToBlock(idx, s.url)} />
                              <span className="text-xs text-[#ffd700] mt-1">{s.name}</span>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => setShowStickerModal(false)} className="mt-4 w-full px-3 py-2 bg-[#ffd700] text-[#181f32] rounded font-bold">關閉</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {block.type === "audio" && (
                <div>
                  <input type="file" accept="audio/*" onChange={e => handleFileUpload(idx, e.target.files)} />
                  {block.preview && block.preview[0] && (
                    <audio controls src={block.preview[0]} className="mt-2" />
                  )}
                </div>
              )}
              {block.type === "pdf" && (
                <div>
                  <input type="file" accept="application/pdf" onChange={e => handleFileUpload(idx, e.target.files)} />
                  {block.preview && block.preview[0] && (
                    <iframe src={block.preview[0]} className="w-full h-64 rounded-lg mt-2" title="pdf-preview" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 收費模式 */}
        <div className="mb-4 flex gap-3 items-center">
          <label className="text-[#ffd700] min-w-[62px]">收費模式</label>
          <div className="pay-mode-box flex gap-2 items-center">
            <select
              className="pay-mode-select rounded bg-[#162040] border border-[#ffd700] text-white"
              value={payMode}
              onChange={e => setPayMode(e.target.value)}
            >
              <option value="free">免費公開</option>
              <option value="sub">訂閱帳號解鎖</option>
              <option value="single">單篇付費</option>
              <option value="tip">打賞開放</option>
            </select>
            {payMode === "single" && (
              <input
                type="number"
                className="pay-price-input rounded border border-[#ffd700] bg-[#162040] text-[#ffd700] px-2 py-1"
                placeholder="單篇售價(元)"
                min={1}
                value={payPrice}
                onChange={e => setPayPrice(e.target.value)}
              />
            )}
            <div className="pay-desc text-[#ffd700ad] ml-3">
              {({
                free: "所有讀者皆可閱讀。",
                sub: "僅訂閱你帳號的粉絲可完整閱讀。",
                single: "須購買此BlogeBook才可閱讀內容。",
                tip: "所有人可閱讀，可自由打賞支持。",
              } as Record<string, string>)[payMode]}
            </div>
          </div>
        </div>

        {/* 編輯器底部按鈕 */}
        <div className="editor-btns mt-8 flex gap-6 flex-wrap">
          <button
            onClick={saveDraft}
            className="px-8 py-2 rounded-xl bg-gradient-to-r from-[#42caff] to-[#ffd700] text-[#23265b] font-bold text-lg shadow"
            type="button"
          >
            儲存草稿
          </button>
          <button
            onClick={previewDraft}
            className="px-8 py-2 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#fffde4] text-[#23265b] font-bold text-lg shadow"
            type="button"
          >
            預覽
          </button>
          <button
            onClick={publish}
            className="px-8 py-2 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#42caff] text-[#23265b] font-bold text-lg shadow"
            type="button"
            disabled={loading}
          >
            {loading ? "發佈中..." : "發布"}
          </button>
        </div>
        {msg && (
          <div className="mt-5 text-[#ffd700] font-bold text-lg">
            {msg}
          </div>
        )}
        {showDraftMsg && (
          <div className="mt-5 text-[#ffd700] font-bold text-lg">
            草稿已暫存於本機，下次可自動載入！
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
