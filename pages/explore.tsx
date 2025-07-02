import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

// 依 NUMINA UNIVERSE 20250701 schema
interface ExploreWork {
  id: string;
  title: string;
  author_id: string;
  cover_url: string;
  content: string;
  price: number;
  type: string;
  main_cat?: string;
  tags?: string[];
}
interface User {
  id: string;
  username: string;
  name: string;
  avatar_url?: string;
}

const tabList = [
  { key: "blogebook", label: "BlogeBook" },
  { key: "wonderland", label: "WonderLand" },
  { key: "stickers", label: "貼圖市集" },
];
const tags = ["全部", "科普", "小說", "插畫", "漫畫", "散文", "創投", "生活", "心靈"];

export default function Explore() {
  const [tab, setTab] = useState("blogebook");
  const [tag, setTag] = useState("全部");
  const [search, setSearch] = useState("");
  const [works, setWorks] = useState<(ExploreWork & { author?: User })[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    async function fetchData() {
      // 查出作品
      let type = tab === "stickers" ? "wonderland" : tab;
      let query = supabase
        .from("works")
        .select("id, title, author_id, cover_url, content, price, type, main_cat, tags")
        .eq("type", type)
        .order("created_at", { ascending: false })
        .limit(tab === "stickers" ? 24 : 18);

      if (tab === "stickers") {
        query = query.or("main_cat.eq.貼圖,tags.cs.{貼圖}");
      }
      if (tag !== "全部") query = query.contains("tags", [tag]);
      if (search.trim()) query = query.ilike("title", `%${search.trim()}%`);

      const { data: worksData } = await query;
      const worksList: ExploreWork[] = worksData ?? [];

      // 取出所有作品作者 id
      const authorIds = Array.from(new Set(worksList.map(w => w.author_id).filter(Boolean)));
      let usersMap: Record<string, User> = {};

      if (authorIds.length > 0) {
        // 查出這批作者 user 資料
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

      // 合併作者資訊
      setWorks(
        worksList.map(w => ({
          ...w,
          author: usersMap[w.author_id] || undefined,
        }))
      );
      setLoading(false);
    }
    fetchData();
  }, [tab, tag, search]);

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
              value={search}
              onChange={e => setSearch(e.target.value)}
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
          {loading
            ? <ExploreLoading />
            : <ExploreCardList list={works} tab={tab} />
          }
        </div>
      </div>
      <Footer />
      <style>{`
        .font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }
      `}</style>
    </div>
  );
}

// 卡片區組件（依 tab 顯示不同樣式）
function ExploreCardList({ list, tab }: { list: (ExploreWork & { author?: User })[], tab: string }) {
  if (list.length === 0) return <EmptyMsg />;
  if (tab === "blogebook") return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {list.map(w => (
        <div key={w.id} className="bg-[#161e2d] rounded-2xl p-5 shadow-xl flex flex-col gap-3 hover:scale-105 transition cursor-pointer">
          <img src={w.cover_url} className="rounded-xl mb-2 h-[120px] object-cover" alt={w.title} />
          <div className="font-bold text-xl">{w.title}</div>
          <div className="text-[#FFD700] text-sm mb-1">
            {(w.tags || []).map((tag, i) => (
              <span key={i}>#{tag} </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <img src={w.author?.avatar_url ?? "/demo/author1.jpg"} className="w-7 h-7 rounded-full" alt="作者頭像" />
            <span>{w.author?.name ?? "未知用戶"}</span>
            <span className="ml-2 text-xs text-[#FFD700]">@{w.author?.username ?? "unknown"}</span>
          </div>
          <div className="text-gray-300 text-sm">{w.content?.slice(0, 28) || "精采內容描述片段..."}</div>
        </div>
      ))}
    </div>
  );
  // wonderland、stickers 顯示不同
  return (
    <div className={`grid ${tab === "wonderland" ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-2 sm:grid-cols-4"} gap-6`}>
      {list.map(w => (
        <div key={w.id} className="bg-[#161e2d] rounded-2xl p-4 shadow-xl flex flex-col items-center hover:scale-105 transition cursor-pointer">
          <img src={w.cover_url} className={tab === "wonderland" ? "rounded-xl h-[180px] object-cover mb-2" : "w-20 h-20 rounded-xl mb-2"} alt={w.title} />
          <div className="font-bold text-lg">{w.title}</div>
          <div className="text-[#FFD700] text-xs mb-1">
            {(w.tags || []).map((tag, i) => (
              <span key={i}>#{tag} </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <img src={w.author?.avatar_url ?? "/demo/author2.jpg"} className="w-7 h-7 rounded-full" alt="作者頭像" />
            <span>{w.author?.name ?? "未知用戶"}</span>
            <span className="ml-2 text-[#FFD700] text-xs">@{w.author?.username ?? "unknown"}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
function ExploreLoading() {
  return (
    <div className="py-10 text-center text-[#ffd700] text-lg">載入中…</div>
  );
}
function EmptyMsg() {
  return (
    <div className="py-10 text-center text-[#ffd700] text-lg">沒有找到相關作品！</div>
  );
}
