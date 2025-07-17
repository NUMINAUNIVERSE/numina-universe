import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useUser } from "@/lib/UserContext";

interface Work {
  id: string;
  title: string;
  author_id: string;
  cover: string;
  type: string;
  desc?: string;
  tags?: string[];
  likes?: number;
}

interface User {
  id: string;
  username: string;
  name: string;
  avatar_url?: string;
}

export default function HomePage() {
  const { isLoadingUser } = useUser();

  // ⭐ 這裡加 log
  console.log("[HomePage] isLoadingUser", isLoadingUser);

  const [hotBlogeBooks, setHotBlogeBooks] = useState<(Work & { author?: User })[]>([]);
  const [hotWonderLand, setHotWonderLand] = useState<(Work & { author?: User })[]>([]);
  const [feed, setFeed] = useState<(Work & { author?: User })[]>([]);
  const [loading, setLoading] = useState(true);
  const [blogIndex, setBlogIndex] = useState(0);
  const [wlIndex, setWLIndex] = useState(0);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      // 1. 熱門 BlogeBook
      const { data: blogData } = await supabase
        .from("works")
        .select("id, title, author_id, cover, type, desc, tags, likes")
        .eq("type", "blogebook")
        .eq("is_published", true)
        .eq("is_deleted", false)
        .order("likes", { ascending: false })
        .limit(6);

      // 2. 熱門 WonderLand
      const { data: wlData } = await supabase
        .from("works")
        .select("id, title, author_id, cover, type, desc, tags, likes")
        .eq("type", "wonderland")
        .eq("is_published", true)
        .eq("is_deleted", false)
        .order("likes", { ascending: false })
        .limit(6);

      // 3. Feed 流（BlogeBook + WonderLand 各3最新）
      const { data: feedData } = await supabase
        .from("works")
        .select("id, title, author_id, cover, type, desc, tags, likes")
        .in("type", ["blogebook", "wonderland"])
        .eq("is_published", true)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false })
        .limit(6);

      // === 合併所有作者 id ===
      const allWorks = [...(blogData ?? []), ...(wlData ?? []), ...(feedData ?? [])];
      const authorIds = Array.from(new Set(allWorks.map(w => w.author_id).filter(Boolean)));
      let usersMap: Record<string, User> = {};

      if (authorIds.length > 0) {
        const { data: usersData } = await supabase
          .from("users")
          .select("id, username, name, avatar_url")
          .in("id", authorIds);
        if (usersData) {
          usersMap = usersData.reduce((map: Record<string, User>, user: User) => {
            map[user.id] = user;
            return map;
          }, {});
        }
      }

      // 作品附上作者物件
      const attachAuthor = (list: Work[] | null | undefined) =>
        (list ?? []).map(w => ({
          ...w,
          author: usersMap[w.author_id] || undefined,
        }));

      setHotBlogeBooks(attachAuthor(blogData));
      setHotWonderLand(attachAuthor(wlData));
      setFeed(attachAuthor(feedData));
      setLoading(false);
    }
    fetchAll();
  }, []);

  // 橫向滑動小功能
  const scrollBlog = (dir: number) => setBlogIndex((prev) => Math.max(0, Math.min(prev + dir, hotBlogeBooks.length - 1)));
  const scrollWL = (dir: number) => setWLIndex((prev) => Math.max(0, Math.min(prev + dir, hotWonderLand.length - 1)));

  // 取得詳細頁連結
  function getWorkLink(item: Work) {
    if (item.type === "blogebook") return `/blogebook/${item.id}`;
    if (item.type === "wonderland") return `/wonderland/${item.id}`;
    return "#";
  }

  // ⭐⭐ 保持國際級 user 載入判斷
  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-[#0d1a2d] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center text-[#ffd700] text-xl font-bold">載入中…</div>
        <Footer />
      </div>
    );
  }

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
              {hotBlogeBooks.map(item => (
                <Link key={item.id} href={getWorkLink(item)}>
                  <div className="w-80 bg-[#181f32] rounded-2xl p-4 mr-5 shadow-lg cursor-pointer hover:scale-105 transition">
                    <img src={item.cover || "/demo/cover.jpg"} alt={item.title} className="w-full h-44 object-cover rounded-xl mb-3" />
                    <div className="font-bold text-lg text-white flex items-center">
                      {item.title}
                    </div>
                    <div className="flex items-center gap-2 text-[#ffd700] text-sm">
                      <img src={item.author?.avatar_url ?? "/demo/author1.jpg"} className="w-6 h-6 rounded-full" alt="作者頭像" />
                      <span>{item.author?.name ?? "創作者"}</span>
                      <span className="ml-1 text-xs text-[#ffd700]">@{item.author?.username ?? "unknown"}</span>
                    </div>
                  </div>
                </Link>
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
              {hotWonderLand.map(item => (
                <Link key={item.id} href={getWorkLink(item)}>
                  <div className="w-80 bg-[#181f32] rounded-2xl p-4 mr-5 shadow-lg cursor-pointer hover:scale-105 transition">
                    <img src={item.cover || "/demo/cover.jpg"} alt={item.title} className="w-full h-44 object-cover rounded-xl mb-3" />
                    <div className="font-bold text-lg text-white flex items-center">
                      {item.title}
                    </div>
                    <div className="flex items-center gap-2 text-[#ffd700] text-sm">
                      <img src={item.author?.avatar_url ?? "/demo/author2.jpg"} className="w-6 h-6 rounded-full" alt="作者頭像" />
                      <span>{item.author?.name ?? "創作者"}</span>
                      <span className="ml-1 text-xs text-[#ffd700]">@{item.author?.username ?? "unknown"}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Feed流 */}
        <div>
          {loading ? (
            <div className="text-center text-[#ffd700] font-bold py-10">載入中…</div>
          ) : (
            feed.map(item => (
              <Link key={item.id} href={getWorkLink(item)}>
                <div className="bg-[#181f32] rounded-2xl shadow-xl mb-8 p-6 flex flex-col md:flex-row gap-5 cursor-pointer hover:scale-105 transition">
                  <img src={item.cover || "/demo/cover.jpg"} alt={item.title} className="w-full md:w-52 h-40 object-cover rounded-xl" />
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg text-white">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#ffd700] text-sm mb-1">
                      <img src={item.author?.avatar_url ?? "/demo/author1.jpg"} className="w-6 h-6 rounded-full" alt="作者頭像" />
                      <span>{item.author?.name ?? "創作者"}</span>
                      <span className="ml-1 text-xs text-[#ffd700]">@{item.author?.username ?? "unknown"}</span>
                    </div>
                    <p className="text-white/85 mb-2">{item.desc?.slice(0, 56) || "精采內容描述片段..."}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(item.tags || []).map((tag, i) => (
                        <span key={i} className="bg-[#ffd70033] text-[#ffd700] px-3 py-1 rounded-2xl text-xs font-bold">#{tag}</span>
                      ))}
                    </div>
                    <div className="flex gap-4 items-center mt-auto">
                      <button className="bg-[#ffd700] text-[#181f32] font-bold px-5 py-2 rounded-xl shadow hover:scale-105 transition">訂閱作者</button>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
