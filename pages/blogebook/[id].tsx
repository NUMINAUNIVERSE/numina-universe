import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function BlogeBookDetail() {
  // 假資料示範
  const ebook = {
    id: 1,
    title: "數位文明的新浪潮",
    author: "Ryan Chang",
    verified: true,
    cover: "/cover1.jpg",
    desc: "每一位創作者都能成為宇宙級的資產主人！",
    tags: ["知識", "商業"],
    price: 99,
    mode: "onepay",
    blocks: [
      { type: "text", value: "這是一段精彩的BlogeBook內容，支持原創知識文明。" },
      { type: "image", value: "/cover1.jpg" },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0d1a2d] text-white flex flex-col">
      <Navbar />
      <div className="max-w-3xl w-full mx-auto flex-1 py-10 px-4">
        <div className="flex items-center mb-4">
          <img src={ebook.cover} alt={ebook.title} className="w-32 h-40 object-cover rounded-lg shadow border-2 border-[#ffd700]" />
          <div className="ml-6 flex-1">
            <h1 className="text-3xl font-bold text-[#ffd700] mb-2">{ebook.title}</h1>
            <div className="flex items-center mb-2">
              <span className="font-semibold">{ebook.author}</span>
              {ebook.verified && (
                <span className="ml-3 px-2 py-1 bg-[#ffd700] text-[#0d1a2d] text-xs rounded-full font-bold">✔️ 原創</span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap mb-2">
              {ebook.tags.map((tag, i) => (
                <span key={i} className="bg-[#ffd70022] text-[#ffd700] px-3 py-1 rounded-2xl text-xs font-bold">#{tag}</span>
              ))}
            </div>
            <p className="text-white/80">{ebook.desc}</p>
            <div className="flex gap-3 items-center mt-2">
              {ebook.mode === "onepay" && <span className="text-[#ffd700] font-bold">單篇 ${ebook.price}</span>}
              {ebook.mode === "subscribe" && <span className="text-[#ffd700] font-bold">訂閱制</span>}
              <button className="ml-2 px-4 py-1 bg-[#ffd700] text-[#181f32] rounded-xl font-bold hover:scale-105 transition">訂閱作者</button>
              <Link href="/blogebook">
                <span className="ml-4 underline text-[#ffd700bb] cursor-pointer">← 返回列表</span>
              </Link>
            </div>
          </div>
        </div>
        {/* 積木式內容 */}
        <div className="bg-[#181f32] p-6 rounded-2xl mb-6">
          {ebook.blocks.map((block, idx) => (
            <div key={idx} className="mb-5">
              {block.type === "text" && <div className="text-lg">{block.value}</div>}
              {block.type === "image" && <img src={block.value} alt="" className="w-full rounded-lg mt-2" />}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
