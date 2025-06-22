import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

// Link 沒用到，已移除

const tabList = [
  { key: "blogebook", label: "BlogeBook" },
  { key: "wonderland", label: "WonderLand" },
  { key: "stickers", label: "貼圖市集" },
  { key: "authors", label: "熱門作者" }
];

export default function Explore() {
  const [tab, setTab] = useState("blogebook");
  const [tag, setTag] = useState("全部");

  // 假資料（後續可串API）
  const tags = ["全部", "科普", "小說", "插畫", "漫畫", "散文", "創投", "生活", "心靈"];
  // (假資料省略...)

  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12 w-full">
        {/* 標題與搜尋 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-6">
          <div>
            <span className="text-3xl font-extrabold text-[#FFD700]">探索 NUMINA UNIVERSE</span>
            <div className="mt-2 text-lg text-gray-400">發現創作者的宇宙，探索你的興趣！</div>
          </div>
          <div>
            <input
              className="rounded-xl bg-[#222d44] text-white p-3 md:min-w-[320px] w-full"
              placeholder="搜尋內容、作者、標籤"
            />
          </div>
        </div>
        {/* 分頁Tab */}
        <div className="flex gap-3 mb-8 border-b border-[#FFD700]/30">
          {tabList.map(t => (
            <button
              key={t.key}
              className={`px-6 py-3 text-lg font-bold border-b-4 transition 
                ${tab === t.key
                  ? "border-[#FFD700] text-[#FFD700] bg-[#161e2d]"
                  : "border-transparent text-white bg-transparent"}`}
              onClick={() => setTab(t.key)}
            >{t.label}</button>
          ))}
        </div>
        {/* 標籤分類 */}
        <div className="flex flex-wrap gap-3 mb-7">
          {tags.map(x => (
            <button
              key={x}
              className={`px-4 py-1 rounded-full font-bold border
                ${tag === x ? "bg-[#FFD700] text-[#0d1827]" : "bg-[#222d44] text-white border-[#FFD700]/40"}`}
              onClick={() => setTag(x)}
            >{x}</button>
          ))}
        </div>
        {/* 主內容區 */}
        <div>
          {tab === "blogebook" && (
            <BlogeBookExploreCardList />
          )}
          {tab === "wonderland" && (
            <WonderLandExploreCardList />
          )}
          {tab === "stickers" && (
            <StickerMarketList />
          )}
          {tab === "authors" && (
            <AuthorRankList />
          )}
        </div>
      </div>
      <Footer />
      <style>{`
        .font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }
      `}</style>
    </div>
  );
}

// 下方細部元件（不變、只補alt）
function BlogeBookExploreCardList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-[#161e2d] rounded-2xl p-5 shadow-xl flex flex-col gap-3 hover:scale-105 transition cursor-pointer">
          <img src="/demo/demo_blogebook.jpg" className="rounded-xl mb-2 h-[120px] object-cover" alt="BlogeBook封面" />
          <div className="font-bold text-xl">BlogeBook 標題 {i}</div>
          <div className="text-[#FFD700] text-sm mb-1">#小說 #心靈</div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <img src="/demo/author1.jpg" className="w-7 h-7 rounded-full" alt="作者頭像" />
            <span>作者名{ i }</span>
            <span className="ml-2 text-[#FFD700]">訂閱</span>
          </div>
          <div className="text-gray-300 text-sm">精采內容描述片段...</div>
        </div>
      ))}
    </div>
  );
}
function WonderLandExploreCardList() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-[#161e2d] rounded-2xl p-4 shadow-xl flex flex-col gap-3 hover:scale-105 transition cursor-pointer">
          <img src="/demo/demo_illust.jpg" className="rounded-xl h-[180px] object-cover mb-2" alt="WonderLand封面" />
          <div className="font-bold text-lg">WonderLand 作品 {i}</div>
          <div className="text-[#FFD700] text-xs mb-1">#插畫 #IP角色</div>
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <img src="/demo/author2.jpg" className="w-7 h-7 rounded-full" alt="作者頭像" />
            <span>作者名{i}</span>
            <span className="ml-2 text-[#FFD700]">訂閱</span>
          </div>
        </div>
      ))}
    </div>
  );
}
function StickerMarketList() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <div key={i} className="bg-[#161e2d] rounded-2xl p-5 shadow-xl flex flex-col items-center hover:scale-105 transition cursor-pointer">
          <img src={`/demo/sticker${i % 2 + 1}.png`} className="w-20 h-20 rounded-xl mb-2" alt="貼圖預覽" />
          <div className="font-bold text-[#FFD700]">貼圖包 {i}</div>
          <div className="text-gray-400 text-xs mt-1">創作者名</div>
        </div>
      ))}
    </div>
  );
}
function AuthorRankList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-[#161e2d] rounded-2xl p-6 shadow-xl flex flex-col items-center gap-2">
          <img src={`/demo/author${i % 3 + 1}.jpg`} className="w-20 h-20 rounded-full mb-2 border-4 border-[#FFD700]" alt="作者頭像" />
          <div className="font-bold text-lg text-[#FFD700]">作者名 {i}</div>
          <div className="text-gray-400 text-xs">累計粉絲：{Math.floor(Math.random()*5000)+1000}</div>
          <div className="mt-2"><button className="bg-[#FFD700] text-[#0d1827] rounded-full px-6 py-1 font-bold">訂閱</button></div>
        </div>
      ))}
    </div>
  );
}
