import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

// Tab 與標籤（可根據未來DB做動態）
const tabList = ["熱門", "最新", "已追蹤"];
const tags = ["小說", "散文", "知識", "漫畫", "AI", "設計", "商業"];

// 對應 Supabase Schema
interface BlogeBook {
  id: string;
  title: string;
  author_id: string;
  cover: string;
  tags: string[];
  main_cat: string | null;
  pay_mode: "free" | "sub" | "single" | "tip";
  pay_price: number;
  verified: boolean;
  subscribe: boolean;
  desc: string;
  created_at: string;
  blocks: object[];
  type: "blogebook";
}

export default function BlogeBookPage() {
  const [tab, setTab] = useState(0);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [blogeBooks, setBlogeBooks] = useState<BlogeBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 取得登入會員資料
  const [userId, setUserId] = useState<string | null>(null);

  // 初始化：取得目前用戶
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
    });
  }, []);

  // 從 supabase 讀取 BlogeBook 資料
  useEffect(() => {
    async function fetchBlogeBooks() {
      setLoading(true);
      let query = supabase
        .from("works")
        .select("*")
        .eq("type", "blogebook");
      // 分頁tab：熱門/最新/已追蹤（未來可動態調整排序規則）
      if (tab === 0) {
        query = query.order("pay_price", { ascending: false }); // 假設熱門用高價排列，未來可改人氣
      } else if (tab === 1) {
        query = query.order("created_at", { ascending: false });
      }
      // 已追蹤
      if (tab === 2 && userId) {
        // 撈出用戶訂閱作者的作品
        // 假設有 subscriptions table：user_id, creator_id
        const { data: subs } = await supabase
          .from("user_subscriptions")
          .select("creator_id")
          .eq("user_id", userId);
        const followedIds = (subs ?? []).map((s: any) => s.creator_id);
        if (followedIds.length > 0) {
          query = query.in("author_id", followedIds);
        } else {
          setBlogeBooks([]);
          setLoading(false);
          return;
        }
      }
      // 關鍵字搜尋
      if (search.trim()) {
        query = query.ilike("title", `%${search.trim()}%`);
      }
      // 標籤搜尋
      if (selectedTag) {
        query = query.contains("tags", [selectedTag]);
      }

      const { data, error } = await query;
      if (error) {
        alert("資料讀取失敗：" + error.message);
      } else if (data) {
        setBlogeBooks(
          (data as BlogeBook[]).map((item) => ({
            ...item,
            tags: item.tags || [],
            pay_mode: item.pay_mode || "free",
            pay_price: item.pay_price || 0,
            verified: !!item.verified,
            subscribe: false, // 訂閱狀態後續可根據會員做動態判斷
            blocks: item.blocks || [],
          }))
        );
      }
      setLoading(false);
    }
    fetchBlogeBooks();
    // eslint-disable-next-line
  }, [tab, selectedTag, search, userId]);

  // 展示資料
  const displayed = blogeBooks;

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
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") setSearch(search); }}
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
        {/* 內容區 */}
        <div className="grid md:grid-cols-2 gap-7">
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
                <p className="text-white/80 mb-2">{b.desc}</p>
                <div className="flex gap-2 flex-wrap mb-3">
                  {b.tags.map((tag, i) => (
                    <span key={i} className="bg-[#ffd70022] text-[#ffd700] px-3 py-1 rounded-2xl text-xs font-bold">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 items-center mt-auto">
                  {b.pay_mode === "single" && <span className="text-[#ffd700] font-bold">單篇 ${b.pay_price}</span>}
                  {b.pay_mode === "sub" && <span className="text-[#ffd700] font-bold">訂閱制</span>}
                  {b.pay_mode === "free" && <span className="text-[#ffd700] font-bold">免費</span>}
                  {b.pay_mode === "tip" && <span className="text-[#ffd700] font-bold">打賞</span>}
                  {/* 訂閱狀態，後續可根據 user_subscriptions 判斷 */}
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
