import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient"; // ⭐ 新增 supabase 連線

const tabList = ["熱門", "最新", "已追蹤"];
const tags = ["小說", "散文", "知識", "漫畫", "AI", "設計", "商業"];

// ⭐ 定義型別（對應你資料表的欄位）
interface BlogeBook {
  id: string;
  title: string;
  author: string;
  verified: boolean;
  cover: string;
  tags: string[];
  desc: string;
  subscribe: boolean;
  price: number;
  mode: "onepay" | "subscribe" | "reward";
}

export default function BlogeBookPage() {
  const [tab, setTab] = useState(0);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // ⭐ 新增：從 supabase 拉回來的作品
  const [blogeBooks, setBlogeBooks] = useState<BlogeBook[]>([]);
  const [loading, setLoading] = useState(true);

  // ⭐ useEffect 拉資料
  useEffect(() => {
    async function fetchBlogeBooks() {
      setLoading(true);
      let { data, error } = await supabase
        .from("works")
        .select("*")
        .eq("type", "blogebook"); // 只抓 type = blogebook
      if (error) {
        alert("資料讀取失敗：" + error.message);
      } else if (data) {
        // 保證 tags 一定是 array，其他欄位照你的資料表即可
        setBlogeBooks(
          data.map((item: any) => ({
            ...item,
            tags: item.tags || [],
          }))
        );
      }
      setLoading(false);
    }
    fetchBlogeBooks();
  }, []);

  // ⭐ 將原本 fakeBlogeBooks 換成 blogeBooks（資料來源切換）
  const displayed = blogeBooks.filter(
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
          {/* ⭐ 載入中處理 */}
          {loading ? (
            <div className="col-span-2 flex justify-center items-center h-32 text-[#ffd700] text-xl">載入中...</div>
          ) : displayed.length === 0 ? (
            <div className="col-span-2 flex justify-center items-center h-32 text-[#ffd700] text-xl">查無資料</div>
          ) : (
            displayed.map((b) => (
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
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
