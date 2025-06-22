import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const hotBlogeBooks = [
  { id: 1, title: "量子宇宙：跨界知識革命", author: "小明", authorVerified: true, cover: "/cover1.jpg" },
  { id: 2, title: "財經獨角獸的養成日記", author: "Tina", authorVerified: false, cover: "/cover2.jpg" },
  { id: 3, title: "AI寫作術", author: "Alan", authorVerified: true, cover: "/cover3.jpg" },
];

const hotWonderLand = [
  { id: 1, title: "光之少女", author: "艾咪", authorVerified: true, cover: "/wl1.jpg" },
  { id: 2, title: "未來戰士Q", author: "Brian", authorVerified: false, cover: "/wl2.jpg" },
  { id: 3, title: "幻想萌貓", author: "Jessy", authorVerified: false, cover: "/wl3.jpg" },
];

const feed = [
  { title: "AI時代的智慧轉折", author: "RyanChang", authorVerified: true, cover: "/cover1.jpg", excerpt: "讓知識價值化，開啟宇宙級的資產革命！", tags: ["AI", "知識"], subscribe: true },
  // ...其他內容
];

export default function HomePage() {
  const [blogIndex, setBlogIndex] = useState(0);
  const [wlIndex, setWLIndex] = useState(0);

  // 橫向滑動小功能
  const scrollBlog = (dir: number) => setBlogIndex((prev) => Math.max(0, Math.min(prev + dir, hotBlogeBooks.length - 1)));
  const scrollWL = (dir: number) => setWLIndex((prev) => Math.max(0, Math.min(prev + dir, hotWonderLand.length - 1)));

  return (
    <div className="min-h-screen bg-[#0d1a2d] text-white flex flex-col">
      <Navbar />
      <div className="max-w-3xl w-full mx-auto flex-1 pt-10 px-4">
        <h1 className="text-4xl font-extrabold text-[#ffd700] mb-2 font-montserrat">
          AI時代的智慧原鄉，神性宇宙級全球創作社群
        </h1>
        <div className="text-lg text-white/90 mb-8">
          這裡是NUMINA UNIVERSE，數位內容資產的文明新起點！立即探索、創作、讓你的知識/插畫/故事/貼圖全都變現，與全球創作者共振～
        </div>

        {/* 熱門BlogeBook區塊 */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xl font-extrabold text-[#ffd700]">🔥 熱門 BlogeBook</div>
            <div className="flex gap-1 items-center">
              <button onClick={() => scrollBlog(-1)} disabled={blogIndex === 0} className="text-[#ffd70099] text-2xl">{"‹"}</button>
              {hotBlogeBooks.map((_, idx) =>
                <span key={idx} className={`inline-block w-3 h-2 mx-0.5 rounded-full ${blogIndex === idx ? "bg-[#ffd700]" : "bg-[#ffd70044]"}`}></span>
              )}
              <button onClick={() => scrollBlog(1)} disabled={blogIndex === hotBlogeBooks.length - 1} className="text-[#ffd70099] text-2xl">{"›"}</button>
            </div>
          </div>
          <div className="overflow-hidden flex gap-4">
            <div className="flex transition-all duration-300" style={{ transform: `translateX(-${blogIndex * 320}px)` }}>
              {hotBlogeBooks.map((item, idx) => (
                <div key={idx} className="w-80 bg-[#181f32] rounded-2xl p-4 mr-5 shadow-lg">
                  <img src={item.cover} alt={item.title} className="w-full h-44 object-cover rounded-xl mb-3" />
                  <div className="font-bold text-lg text-white flex items-center">
                    {item.title}
                    {item.authorVerified && <span className="ml-2 inline-block px-2 py-1 text-xs rounded-full bg-[#ffd700] text-[#0d1a2d] font-bold">✔️ 原創</span>}
                  </div>
                  <div className="text-[#ffd700]">{item.author}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 熱門WonderLand區塊 */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xl font-extrabold text-[#ffd700]">🎨 熱門 WonderLand</div>
            <div className="flex gap-1 items-center">
              <button onClick={() => scrollWL(-1)} disabled={wlIndex === 0} className="text-[#ffd70099] text-2xl">{"‹"}</button>
              {hotWonderLand.map((_, idx) =>
                <span key={idx} className={`inline-block w-3 h-2 mx-0.5 rounded-full ${wlIndex === idx ? "bg-[#ffd700]" : "bg-[#ffd70044]"}`}></span>
              )}
              <button onClick={() => scrollWL(1)} disabled={wlIndex === hotWonderLand.length - 1} className="text-[#ffd70099] text-2xl">{"›"}</button>
            </div>
          </div>
          <div className="overflow-hidden flex gap-4">
            <div className="flex transition-all duration-300" style={{ transform: `translateX(-${wlIndex * 320}px)` }}>
              {hotWonderLand.map((item, idx) => (
                <div key={idx} className="w-80 bg-[#181f32] rounded-2xl p-4 mr-5 shadow-lg">
                  <img src={item.cover} alt={item.title} className="w-full h-44 object-cover rounded-xl mb-3" />
                  <div className="font-bold text-lg text-white flex items-center">
                    {item.title}
                    {item.authorVerified && <span className="ml-2 inline-block px-2 py-1 text-xs rounded-full bg-[#ffd700] text-[#0d1a2d] font-bold">✔️ 原創</span>}
                  </div>
                  <div className="text-[#ffd700]">{item.author}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feed流 */}
        <div>
          {feed.map((item, idx) => (
            <div key={idx} className="bg-[#181f32] rounded-2xl shadow-xl mb-8 p-6 flex flex-col md:flex-row gap-5">
              <img src={item.cover} alt={item.title} className="w-full md:w-52 h-40 object-cover rounded-xl" />
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg text-white">{item.title}</span>
                  {item.authorVerified && (
                    <span className="ml-2 inline-block px-2 py-1 text-xs rounded-full bg-[#ffd700] text-[#0d1a2d] font-bold">✔️ 原創</span>
                  )}
                </div>
                <span className="text-[#ffd700] font-semibold mb-1">{item.author}</span>
                <p className="text-white/85 mb-2">{item.excerpt}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="bg-[#ffd70033] text-[#ffd700] px-3 py-1 rounded-2xl text-xs font-bold">#{tag}</span>
                  ))}
                </div>
                <div className="flex gap-4 items-center mt-auto">
                  {item.subscribe ? (
                    <button className="bg-[#ffd700] text-[#181f32] font-bold px-5 py-2 rounded-xl shadow hover:scale-105 transition">訂閱作者</button>
                  ) : (
                    <span className="text-[#ffd70099] text-sm">已訂閱</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
