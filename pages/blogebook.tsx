import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tabList = ["熱門", "最新", "已追蹤"];
const tags = ["小說", "散文", "知識", "漫畫", "AI", "設計", "商業"];

const fakeBlogeBooks = [
  {
    id: 1,
    title: "數位文明的新浪潮",
    author: "Ryan Chang",
    verified: true,
    cover: "/cover1.jpg",
    tags: ["知識", "商業"],
    desc: "每一位創作者都能成為宇宙級的資產主人！",
    subscribe: false,
    price: 99,
    mode: "onepay"
  },
  {
    id: 2,
    title: "人工智慧進化史",
    author: "Tina Liu",
    verified: false,
    cover: "/cover2.jpg",
    tags: ["AI", "小說"],
    desc: "以小說視角探討AI未來，知識與想像並重。",
    subscribe: true,
    price: 0,
    mode: "subscribe"
  },
  // ...可再多加假資料
];

export default function BlogeBookPage() {
  const [tab, setTab] = useState(0);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 篩選展示資料
  const displayed = fakeBlogeBooks.filter(
    (b) => !selectedTag || b.tags.includes(selectedTag)
  );

  return (
    <div className="min-h-screen bg-[#0d1a2d] text-white flex flex-col">
      <Navbar />
      <div className="max-w-4xl w-full mx-auto flex-1 pt-8 px-4">
        <div className="flex justify-between items-center mb-6">
          {/* 分頁Tab */}
          <div className="flex gap-4">
            {tabList.map((item, i) => (
              <button
                key={i}
                className={`px-5 py-2 font-bold rounded-full text-lg ${
                  tab === i
                    ? "bg-[#ffd700] text-[#0d1a2d] shadow"
                    : "bg-[#ffd70022] text-[#ffd700] hover:bg-[#ffd70044]"
                }`}
                onClick={() => setTab(i)}
              >
                {item}
              </button>
            ))}
          </div>
          {/* 我要創作 */}
          <button
            className="px-5 py-2 bg-[#ffd700] text-[#0d1a2d] rounded-full font-bold shadow hover:scale-105 transition"
            onClick={() => window.location.href = "/blogebook/edit"}
          >
            ＋我要創作
          </button>
        </div>
        {/* 搜尋 & 標籤 */}
        <div className="flex flex-wrap gap-3 mb-5">
          <input
            className="flex-1 rounded-full px-4 py-2 bg-[#181f32] text-white placeholder:text-[#ffd70099] border border-[#ffd70044] max-w-[280px]"
            placeholder="搜尋作品、作者、標籤..."
          />
          <div className="flex gap-2 overflow-x-auto">
            {tags.map((tag, i) => (
              <button
                key={i}
                className={`px-4 py-1 rounded-2xl border ${
                  selectedTag === tag
                    ? "bg-[#ffd700] text-[#0d1a2d] border-[#ffd700]"
                    : "bg-[#ffd70015] text-[#ffd700] border-[#ffd70044]"
                }`}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
        {/* 瀑布流內容區 */}
        <div className="grid md:grid-cols-2 gap-7">
          {displayed.map((b) => (
            <div
              key={b.id}
              className="bg-[#181f32] rounded-2xl shadow-xl p-5 flex flex-col transition hover:scale-[1.025] cursor-pointer"
              onClick={() => window.location.href = `/blogebook/${b.id}`}
            >
              <img src={b.cover} alt={b.title} className="w-full h-44 object-cover rounded-xl mb-4" />
              <div className="flex items-center mb-1">
                <span className="font-bold text-xl">{b.title}</span>
                {b.verified && (
                  <span className="ml-2 inline-block px-2 py-1 text-xs rounded-full bg-[#ffd700] text-[#0d1a2d] font-bold">✔️ 原創</span>
                )}
              </div>
              <span className="text-[#ffd700] font-semibold mb-1">{b.author}</span>
              <p className="text-white/80 mb-2">{b.desc}</p>
              <div className="flex gap-2 flex-wrap mb-3">
                {b.tags.map((tag, i) => (
                  <span key={i} className="bg-[#ffd70022] text-[#ffd700] px-3 py-1 rounded-2xl text-xs font-bold">
                    #{tag}
                  </span>
                ))}
              </div>
              {/* 收費模式 */}
              <div className="flex gap-3 items-center mt-auto">
                {b.mode === "onepay" && <span className="text-[#ffd700] font-bold">單篇 ${b.price}</span>}
                {b.mode === "subscribe" && <span className="text-[#ffd700] font-bold">訂閱制</span>}
                {b.mode === "reward" && <span className="text-[#ffd700] font-bold">打賞</span>}
                {!b.subscribe && (
                  <button className="bg-[#ffd700] text-[#181f32] font-bold px-5 py-2 rounded-xl shadow hover:scale-105 transition">
                    訂閱作者
                  </button>
                )}
                {b.subscribe && <span className="text-[#ffd70099] text-sm">已訂閱</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
