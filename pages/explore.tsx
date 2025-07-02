import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

// 型別 interface 定義
interface ExploreWork {
  id: string;
  title: string;
  cover: string;
  author: { nickname: string; verified: boolean };
  desc: string;
  tags: string[];
  main_cat: string;
}
interface AuthorUser {
  id: string;
  nickname: string;
  avatar_url: string;
  verified: boolean;
  stats: { followers: number };
}

const tabList = [
  { key: "blogebook", label: "BlogeBook" },
  { key: "wonderland", label: "WonderLand" },
  { key: "stickers", label: "貼圖市集" },
  { key: "authors", label: "熱門作者" }
];
const tags = ["全部", "科普", "小說", "插畫", "漫畫", "散文", "創投", "生活", "心靈"];

export default function Explore() {
  const [tab, setTab] = useState("blogebook");
  const [tag, setTag] = useState("全部");
  const [search, setSearch] = useState("");
  const [blogeBooks, setBlogeBooks] = useState<ExploreWork[]>([]);
  const [wonderlandWorks, setWonderlandWorks] = useState<ExploreWork[]>([]);
  const [stickers, setStickers] = useState<ExploreWork[]>([]);
  const [authors, setAuthors] = useState<AuthorUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    async function fetchData() {
      if (tab === "blogebook") {
        let query = supabase
          .from("works")
          .select("id, title, cover, author:author_id(nickname, verified), desc, tags, main_cat")
          .eq("type", "blogebook")
          .order("created_at", { ascending: false })
          .limit(18);

        if (tag !== "全部") query = query.contains("tags", [tag]);
        if (search.trim()) query = query.ilike("title", `%${search.trim()}%`);

        const { data } = await query;
        setBlogeBooks((data as ExploreWork[]) ?? []);
      }
      if (tab === "wonderland") {
        let query = supabase
          .from("works")
          .select("id, title, cover, author:author_id(nickname, verified), desc, tags, main_cat")
          .eq("type", "wonderland")
          .order("created_at", { ascending: false })
          .limit(18);

        if (tag !== "全部") query = query.contains("tags", [tag]);
        if (search.trim()) query = query.ilike("title", `%${search.trim()}%`);

        const { data } = await query;
        setWonderlandWorks((data as ExploreWork[]) ?? []);
      }
      if (tab === "stickers") {
        let query = supabase
          .from("works")
          .select("id, title, cover, author:author_id(nickname, verified), desc, tags, main_cat")
          .eq("type", "wonderland")
          .or("main_cat.eq.貼圖,tags.cs.{貼圖}")
          .order("created_at", { ascending: false })
          .limit(24);

        if (tag !== "全部") query = query.contains("tags", [tag]);
        if (search.trim()) query = query.ilike("title", `%${search.trim()}%`);

        const { data } = await query;
        setStickers((data as ExploreWork[]) ?? []);
      }
      if (tab === "authors") {
        const { data } = await supabase
          .from("users")
          .select("id, nickname, avatar_url, verified, stats")
          .order("stats.followers", { ascending: false })
          .limit(30);
        setAuthors((data as AuthorUser[]) ?? []);
      }
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
        {tab !== "authors" && (
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
        )}
        {/* 主內容區 */}
        <div>
          {tab === "blogebook" && (
            loading ? <ExploreLoading /> : <BlogeBookExploreCardList list={blogeBooks} />
          )}
          {tab === "wonderland" && (
            loading ? <ExploreLoading /> : <WonderLandExploreCardList list={wonderlandWorks} />
          )}
          {tab === "stickers" && (
            loading ? <ExploreLoading /> : <StickerMarketList list={stickers} />
          )}
          {tab === "authors" && (
            loading ? <ExploreLoading /> : <AuthorRankList list={authors} />
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

// 卡片區組件
function BlogeBookExploreCardList({ list }: { list: ExploreWork[] }) {
  if (list.length === 0) return <EmptyMsg />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {list.map(w => (
        <div key={w.id} className="bg-[#161e2d] rounded-2xl p-5 shadow-xl flex flex-col gap-3 hover:scale-105 transition cursor-pointer">
          <img src={w.cover} className="rounded-xl mb-2 h-[120px] object-cover" alt={w.title} />
          <div className="font-bold text-xl">{w.title}</div>
          <div className="text-[#FFD700] text-sm mb-1">
            {(w.tags || []).map((tag, i) => (
              <span key={i}>#{tag} </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <img src="/demo/author1.jpg" className="w-7 h-7 rounded-full" alt="作者頭像" />
            <span>{w.author?.nickname ?? "作者"}</span>
            {w.author?.verified && <span className="ml-2 text-[#FFD700]">✔</span>}
            <span className="ml-2 text-[#FFD700]">訂閱</span>
          </div>
          <div className="text-gray-300 text-sm">{w.desc?.slice(0, 28) || "精采內容描述片段..."}</div>
        </div>
      ))}
    </div>
  );
}
function WonderLandExploreCardList({ list }: { list: ExploreWork[] }) {
  if (list.length === 0) return <EmptyMsg />;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {list.map(w => (
        <div key={w.id} className="bg-[#161e2d] rounded-2xl p-4 shadow-xl flex flex-col gap-3 hover:scale-105 transition cursor-pointer">
          <img src={w.cover} className="rounded-xl h-[180px] object-cover mb-2" alt={w.title} />
          <div className="font-bold text-lg">{w.title}</div>
          <div className="text-[#FFD700] text-xs mb-1">
            {(w.tags || []).map((tag, i) => (
              <span key={i}>#{tag} </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <img src="/demo/author2.jpg" className="w-7 h-7 rounded-full" alt="作者頭像" />
            <span>{w.author?.nickname ?? "作者"}</span>
            {w.author?.verified && <span className="ml-2 text-[#FFD700]">✔</span>}
            <span className="ml-2 text-[#FFD700]">訂閱</span>
          </div>
        </div>
      ))}
    </div>
  );
}
function StickerMarketList({ list }: { list: ExploreWork[] }) {
  if (list.length === 0) return <EmptyMsg />;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
      {list.map(w => (
        <div key={w.id} className="bg-[#161e2d] rounded-2xl p-5 shadow-xl flex flex-col items-center hover:scale-105 transition cursor-pointer">
          <img src={w.cover} className="w-20 h-20 rounded-xl mb-2" alt={w.title} />
          <div className="font-bold text-[#FFD700]">{w.title}</div>
          <div className="text-gray-400 text-xs mt-1">{w.author?.nickname ?? "創作者"}</div>
        </div>
      ))}
    </div>
  );
}
function AuthorRankList({ list }: { list: AuthorUser[] }) {
  if (list.length === 0) return <EmptyMsg />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {list.map(u => (
        <div key={u.id} className="bg-[#161e2d] rounded-2xl p-6 shadow-xl flex flex-col items-center gap-2">
          <img src={u.avatar_url ?? "/demo/author1.jpg"} className="w-20 h-20 rounded-full mb-2 border-4 border-[#FFD700]" alt="作者頭像" />
          <div className="font-bold text-lg text-[#FFD700]">{u.nickname}</div>
          <div className="text-gray-400 text-xs">累計粉絲：{u.stats?.followers ?? 0}</div>
          <div className="mt-2"><button className="bg-[#FFD700] text-[#0d1827] rounded-full px-6 py-1 font-bold">訂閱</button></div>
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
