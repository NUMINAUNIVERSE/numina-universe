import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function BlogeBookEdit() {
  const [coverImg, setCoverImg] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [blocks, setBlocks] = useState<any[]>([]);
  const [blockValue, setBlockValue] = useState("");
  const [blockType, setBlockType] = useState<"text" | "image">("text");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [chargeMode, setChargeMode] = useState("free");
  const [showPreview, setShowPreview] = useState(false);

  // 處理封面圖片上傳
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setCoverImg(url);
    }
  };

  // 處理PDF電子書上傳
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  // 處理音檔上傳
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  // 增加內容積木（文字、圖片）
  const addBlock = () => {
    if (blockValue.trim() === "") return;
    setBlocks([...blocks, { type: blockType, value: blockValue }]);
    setBlockValue("");
  };

  // 處理標籤增加
  const addTag = () => {
    if (newTag.trim() !== "" && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  // 預存草稿、發布、預覽
  const handleDraft = () => {
    alert("草稿已暫存（MVP示意）");
  };

  const handlePublish = () => {
    alert("作品已發布！（MVP示意）");
  };

  return (
    <div className="min-h-screen bg-[#0d1a2d] text-white flex flex-col">
      <Navbar />
      <div className="max-w-3xl w-full mx-auto flex-1 py-8 px-4">
        <h1 className="text-3xl font-bold text-[#ffd700] mb-4">BlogeBook 編輯器</h1>
        <div className="space-y-7 bg-[#181f32] p-6 rounded-2xl shadow-lg">
          {/* 封面上傳 */}
          <div>
            <label className="font-bold block mb-1">封面圖片</label>
            <input
              type="file"
              accept="image/*"
              className="mb-2"
              onChange={handleCoverChange}
            />
            {coverImg && (
              <img src={coverImg} alt="封面" className="w-44 h-60 object-cover rounded-lg mt-2" />
            )}
          </div>
          {/* 作品標題 */}
          <div>
            <label className="font-bold block mb-1">作品標題</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-[#283045] text-white px-4 py-2 rounded-lg"
              placeholder="請輸入BlogeBook標題"
            />
          </div>
          {/* 作品簡介 */}
          <div>
            <label className="font-bold block mb-1">作品簡介</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="w-full bg-[#283045] text-white px-4 py-2 rounded-lg"
              placeholder="請簡述本篇BlogeBook內容"
            />
          </div>
          {/* 電子書PDF上傳 */}
          <div>
            <label className="font-bold block mb-1">電子書PDF檔案（選填）</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="mb-2"
            />
            {pdfFile && <span className="text-[#ffd700]">{pdfFile.name}</span>}
          </div>
          {/* 音檔上傳 */}
          <div>
            <label className="font-bold block mb-1">語音音檔（選填）</label>
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioChange}
              className="mb-2"
            />
            {audioFile && <span className="text-[#ffd700]">{audioFile.name}</span>}
          </div>
          {/* 積木內容編輯 */}
          <div>
            <label className="font-bold block mb-2">內容積木</label>
            <div className="flex gap-3 mb-2">
              <select
                className="bg-[#283045] text-white rounded px-2 py-1"
                value={blockType}
                onChange={e => setBlockType(e.target.value as any)}
              >
                <option value="text">文字</option>
                <option value="image">圖片網址</option>
              </select>
              <input
                type="text"
                value={blockValue}
                onChange={e => setBlockValue(e.target.value)}
                className="flex-1 bg-[#283045] text-white px-3 py-1 rounded"
                placeholder={blockType === "text" ? "請輸入文字" : "請輸入圖片網址"}
              />
              <button
                onClick={addBlock}
                className="bg-[#ffd700] text-[#0d1a2d] font-bold px-5 py-1 rounded-xl hover:scale-105 transition"
              >
                加入
              </button>
            </div>
            {/* 展示已加入內容 */}
            <div className="space-y-3">
              {blocks.map((b, i) =>
                b.type === "text" ? (
                  <div key={i} className="bg-[#ffd7000a] p-3 rounded-lg text-white">{b.value}</div>
                ) : (
                  <img key={i} src={b.value} alt="" className="w-full rounded-lg" />
                )
              )}
            </div>
          </div>
          {/* 標籤管理 */}
          <div>
            <label className="font-bold block mb-1">主題標籤</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-[#ffd70022] text-[#ffd700] px-3 py-1 rounded-2xl text-xs font-bold"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                className="bg-[#283045] text-white px-3 py-1 rounded"
                placeholder="新增標籤"
              />
              <button
                onClick={addTag}
                className="bg-[#ffd700] text-[#0d1a2d] font-bold px-4 py-1 rounded-xl"
              >
                加入
              </button>
            </div>
          </div>
          {/* 收費設定 */}
          <div>
            <label className="font-bold block mb-1">收費模式</label>
            <div className="flex gap-4 mb-2">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="free"
                  checked={chargeMode === "free"}
                  onChange={() => setChargeMode("free")}
                  className="accent-[#ffd700]"
                />
                免費
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="onepay"
                  checked={chargeMode === "onepay"}
                  onChange={() => setChargeMode("onepay")}
                  className="accent-[#ffd700]"
                />
                單篇收費
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="subscribe"
                  checked={chargeMode === "subscribe"}
                  onChange={() => setChargeMode("subscribe")}
                  className="accent-[#ffd700]"
                />
                訂閱帳號
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="reward"
                  checked={chargeMode === "reward"}
                  onChange={() => setChargeMode("reward")}
                  className="accent-[#ffd700]"
                />
                打賞
              </label>
            </div>
            {chargeMode === "onepay" && (
              <div className="flex items-center gap-2">
                <span>金額</span>
                <input
                  type="number"
                  min={1}
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="bg-[#283045] text-white px-3 py-1 rounded w-24"
                />
                <span className="text-[#ffd700]">元</span>
              </div>
            )}
          </div>
          {/* 功能按鈕 */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-5 py-2 bg-[#ffd70088] text-[#0d1a2d] rounded-xl font-bold hover:scale-105 transition"
            >
              預覽
            </button>
            <button
              onClick={handleDraft}
              className="px-5 py-2 bg-[#ffd70055] text-[#0d1a2d] rounded-xl font-bold hover:scale-105 transition"
            >
              預存草稿
            </button>
            <button
              onClick={handlePublish}
              className="px-5 py-2 bg-[#ffd700] text-[#0d1a2d] rounded-xl font-bold hover:scale-105 transition"
            >
              發布
            </button>
            <Link href="/blogebook">
              <span className="px-5 py-2 rounded-xl bg-[#181f32] border border-[#ffd70044] text-[#ffd700] font-bold hover:underline cursor-pointer ml-2">
                取消
              </span>
            </Link>
          </div>
        </div>

        {/* 預覽模式 */}
        {showPreview && (
          <div className="fixed top-0 left-0 w-full h-full bg-[#0d1a2de6] z-50 flex flex-col items-center justify-center px-2">
            <div className="bg-[#181f32] rounded-2xl p-8 max-w-lg w-full shadow-xl overflow-y-auto">
              <h2 className="text-2xl font-bold text-[#ffd700] mb-4">{title || "預覽標題"}</h2>
              {coverImg && (
                <img src={coverImg} alt="預覽封面" className="w-full h-64 object-cover rounded-lg mb-3" />
              )}
              <p className="mb-2">{desc || "預覽簡介"}</p>
              {pdfFile && (
                <span className="block text-[#ffd700] mb-1">電子書PDF：{pdfFile.name}</span>
              )}
              {audioFile && (
                <span className="block text-[#ffd700] mb-1">語音音檔：{audioFile.name}</span>
              )}
              {blocks.map((b, i) =>
                b.type === "text" ? (
                  <div key={i} className="bg-[#ffd7000a] p-3 rounded-lg my-2">{b.value}</div>
                ) : (
                  <img key={i} src={b.value} alt="" className="w-full rounded-lg my-2" />
                )
              )}
              <div className="flex gap-2 flex-wrap mt-2">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-[#ffd70022] text-[#ffd700] px-3 py-1 rounded-2xl text-xs font-bold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <button
                className="mt-5 px-5 py-2 bg-[#ffd700] text-[#0d1a2d] font-bold rounded-xl"
                onClick={() => setShowPreview(false)}
              >
                關閉預覽
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
