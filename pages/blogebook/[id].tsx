import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";

// 假資料，可改成API獲取
const dummyBook = {
  title: "數位文明的新浪潮",
  cover: "/cover1.jpg",
  author: "Ryan Chang",
  verified: true,
  tags: ["知識", "商業"],
  price: 99,
  mode: "onepay",
  content: [
    { type: "text", value: "這是一篇介紹數位文明的新時代BlogeBook..." },
    { type: "image", value: "/blogimg1.jpg" },
    { type: "text", value: "智慧原鄉、神性宇宙，知識與創作正在這裡融合..." },
    { type: "pdf", value: "/ebook_sample.pdf" },
    { type: "audio", value: "/sample.mp3" },
    { type: "sticker", value: "/sticker1.png" }
  ],
};

export default function BlogeBookReadPage() {
  const router = useRouter();
  // const { id } = router.query; // 未來可根據id載入
  const b = dummyBook;

  return (
    <div className="min-h-screen bg-[#0d1a2d] text-white flex flex-col">
      <Navbar />
      <div className="max-w-2xl w-full mx-auto flex-1 py-10 px-4">
        <img src={b.cover} alt={b.title} className="w-full h-64 object-cover rounded-2xl mb-6" />
        <div className="flex items-center gap-3 mb-2">
          <span className="font-bold text-3xl">{b.title}</span>
          {b.verified && <span className="inline-block px-2 py-1 text-xs rounded-full bg-[#ffd700] text-[#0d1a2d] font-bold">✔️ 原創</span>}
        </div>
        <div className="flex gap-2 items-center mb-2">
          <span className="text-[#ffd700] font-bold">{b.author}</span>
          <button className="bg-[#ffd700] text-[#0d1a2d] font-bold px-4 py-1 rounded-xl ml-3">訂閱作者</button>
        </div>
        <div className="flex gap-2 flex-wrap mb-4">
          {b.tags.map((tag, i) => (
            <span key={i} className="bg-[#ffd70022] text-[#ffd700] px-3 py-1 rounded-2xl text-xs font-bold">#{tag}</span>
          ))}
        </div>
        {/* 收費模式顯示 */}
        <div className="mb-6 text-[#ffd700] font-bold">
          {b.mode === "onepay" && <>單篇購買 NT${b.price}</>}
          {b.mode === "subscribe" && <>訂閱制（請訂閱作者）</>}
          {b.mode === "reward" && <>打賞支持</>}
        </div>
        {/* 內容積木區塊 */}
        <div className="flex flex-col gap-6 mb-8">
          {b.content.map((block, idx) => {
            if (block.type === "text") return <p key={idx} className="text-lg text-white/90">{block.value}</p>;
            if (block.type === "image") return <img key={idx} src={block.value} alt="" className="w-full rounded-lg" />;
            if (block.type === "sticker") return <img key={idx} src={block.value} alt="" className="h-16" />;
            if (block.type === "audio") return (
              <audio key={idx} controls className="w-full mt-2">
                <source src={block.value} />
                您的瀏覽器不支援音檔播放。
              </audio>
            );
            if (block.type === "pdf") return (
              <iframe
                key={idx}
                src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${block.value}`}
                className="w-full h-96 rounded-lg bg-[#181f32]"
                title="電子書閱讀"
              />
            );
            return null;
          })}
        </div>
        {/* 互動功能 */}
        <div className="flex gap-6 items-center mb-4">
          <button className="text-[#ffd700] hover:scale-105 transition font-bold">👍 讚</button>
          <button className="text-[#ffd700] hover:scale-105 transition font-bold">💾 收藏</button>
          <button className="text-[#ffd700] hover:scale-105 transition font-bold">💬 留言</button>
          <button className="text-[#ffd700] hover:scale-105 transition font-bold">🔗 分享</button>
        </div>
        <div className="text-sm text-[#ffd70099] mb-2">留言、討論區（未來API接入）</div>
      </div>
      <Footer />
    </div>
  );
}
