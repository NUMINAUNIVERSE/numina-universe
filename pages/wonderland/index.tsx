import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

const categories = ["全部", "插畫", "漫畫", "貼圖市集"];

interface Block {
  type: string;
  url: string;
}
interface Author {
  nickname: string;
  verified: boolean;
}
interface Work {
  id: string;
  type: string;
  title: string;
  cover: string;
  imgs: string[];
  desc: string;
  author_id: string;
  author?: Author;
  author_name: string;
  author_verified: boolean;
  like: number;
  comment: number;
  blocks: Block[];
}

const stickerList = [
  { id: "s1", name: "柴犬貼圖", cover: "/stickers/dog1.png", author: "Neko", owned: false },
  { id: "s2", name: "宇宙Q人", cover: "/stickers/alien1.png", author: "Mina", owned: true },
];

export default function WonderlandIndex() {
  const [tab, setTab] = useState(0);
  const [imgIndex, setImgIndex] = useState<{ [k: string]: number }>({});
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchWorks() {
      setLoading(true);
      // 直接 select *，不用寫 author:xxx，避免 supabase 欄位對不上
      const { data, error } = await supabase
        .from("works")
        .select("*")
        .eq("type", "wonderland")
        .order("created_at", { ascending: false });

      console.log("Supabase works data:", data, error);

      if (error || !data) {
        setWorks([]);
        setLoading(false);
        return;
      }

      // 明確指定型別，並統一 fallback 預設值
      const mapped: Work[] = (data as Partial<Work>[]).map((w) => {
        const blocks: Block[] = Array.isArray(w.blocks) ? w.blocks as Block[] : [];
        const imgs: string[] =
          blocks.length > 0
            ? blocks.filter((b) => b.type === "image" && b.url).map((b) => b.url)
            : w.cover
            ? [w.cover]
            : [];

        return {
          id: w.id ?? "",
          type: w.type ?? "",
          title: w.title ?? "",
          cover: w.cover ?? "",
          imgs,
          desc: w.desc ?? "",
          author_id: w.author_id ?? "",
          author: w.author ?? { nickname: "", verified: false },
          author_name: (w.author as Author)?.nickname ?? "",
          author_verified: (w.author as Author)?.verified ?? false,
          like: w.like ?? 0,
          comment: w.comment ?? 0,
          blocks: blocks,
        };
      });
      setWorks(mapped);
      setLoading(false);
    }
    fetchWorks();
  }, []);

  // 分類過濾
  const displayWorks = works.filter((w) =>
    tab === 0 ? true
      : tab === 3 ? false
      : w.type === categories[tab]
  );

  const handleImgChange = (workId: string, dir: "prev" | "next", imgs: string[]) => {
    setImgIndex((idx) => {
      const cur = idx[workId] || 0;
      const max = imgs.length - 1;
      let next = cur + (dir === "next" ? 1 : -1);
      if (next > max) next = 0;
      if (next < 0) next = max;
      return { ...idx, [workId]: next };
    });
  };

  return (
    <div className="min-h-screen bg-[#0d1a2d] text-white flex flex-col">
      <Navbar />
      <div className="max-w-5xl w-full mx-auto flex-1 py-10 px-2 sm:px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-[#ffd700] tracking-wide">WonderLand 星系專區</h2>
          <button
            className="px-6 py-2 rounded-xl bg-[#ffd700] text-[#181f32] font-bold shadow hover:bg-[#fffde4] transition"
            onClick={() => router.push("/wonderland/edit")}
          >
            ＋ 我要創作
          </button>
        </div>
        <div className="flex gap-2 mb-8">
          {categories.map((cat, i) => (
            <button key={cat}
              className={`px-5 py-2 rounded-2xl border-2 text-lg font-bold transition
                ${tab === i
                  ? "border-[#ffd700] text-[#ffd700] bg-[#ffd70018]"
                  : "border-transparent text-white/60 hover:border-[#ffd700]"
                }`}
              onClick={() => setTab(i)}
            >{cat}</button>
          ))}
        </div>
        {tab !== 3 ? (
          loading ? (
            <div className="text-center py-16 text-lg text-[#ffd700]">讀取中…</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
              {displayWorks.map((work) => (
                <div key={work.id} className="bg-[#192243] rounded-2xl shadow-lg p-6 flex flex-col gap-2">
                  <div className="relative group w-full h-52 flex items-center justify-center bg-[#131a2e] rounded-lg mb-2 overflow-hidden">
                    <img
                      src={work.imgs && work.imgs.length > 0 ? work.imgs[imgIndex[work.id] || 0] : work.cover}
                      alt={work.title}
                      className="object-contain h-full rounded-lg mx-auto transition-all duration-200"
                    />
                    {work.imgs && work.imgs.length > 1 && (
                      <>
                        <button
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#ffd700cc] rounded-full flex items-center justify-center text-[#181f32] font-bold shadow-lg opacity-80 hover:scale-110 z-10"
                          onClick={() => handleImgChange(work.id, "prev", work.imgs)}
                          title="上一張"
                        >{"<"}</button>
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#ffd700cc] rounded-full flex items-center justify-center text-[#181f32] font-bold shadow-lg opacity-80 hover:scale-110 z-10"
                          onClick={() => handleImgChange(work.id, "next", work.imgs)}
                          title="下一張"
                        >{">"}</button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                          {work.imgs.map((img, idx) =>
                            <div key={idx}
                              className={`h-2 rounded-full ${idx === (imgIndex[work.id] || 0) ? "w-8 bg-[#ffd700]" : "w-2 bg-[#ffd70055]"}`} />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2 items-center text-lg font-bold">
                    <span>{work.title}</span>
                    <span className="text-[#ffd700] text-xs border border-[#ffd700] rounded px-1 ml-2">{work.type}</span>
                  </div>
                  <div className="text-base text-[#fffbdc] min-h-[32px]">{work.desc}</div>
                  <div className="flex gap-2 items-center mt-2">
                    <span className="font-bold">{work.author_name || "創作者"}</span>
                    {work.author_verified && (
                      <span title="原創認證" className="ml-1 text-[#4dd0e1] bg-[#0d1a2d] border border-[#4dd0e1] px-1.5 py-0.5 text-xs rounded-full font-bold">✔</span>
                    )}
                    <button className="ml-2 px-3 py-1 bg-[#ffd700] rounded-lg text-[#181f32] text-xs font-bold hover:bg-[#fffde4]">訂閱</button>
                  </div>
                  <div className="flex gap-4 mt-3 justify-between">
                    <button className="flex items-center gap-1 text-[#ffd700] font-bold hover:scale-110"><span>👍</span><span>讚</span></button>
                    <button className="flex items-center gap-1 text-[#fffbdc] font-bold hover:scale-110"><span>💬</span><span>留言</span></button>
                    <button className="flex items-center gap-1 text-[#61dafb] font-bold hover:scale-110"><span>🔗</span><span>分享</span></button>
                    <button className="flex items-center gap-1 text-[#ff5aac] font-bold hover:scale-110"><span>★</span><span>收藏</span></button>
                  </div>
                  <div className="flex gap-4 mt-1 text-sm opacity-60">
                    <span>👍 {work.like ?? 0}</span>
                    <span>💬 {work.comment ?? 0}</span>
                    <span className="text-[#ffd700] font-bold">🔥熱門</span>
                  </div>
                  <button
                    className="mt-3 px-5 py-2 bg-[#ffd700] text-[#181f32] font-bold rounded-xl hover:bg-[#fffde4] transition"
                    onClick={() => router.push(`/wonderland/${work.id}`)}
                  >
                    閱讀查看
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-wrap gap-7">
            {stickerList.map(stk => (
              <div key={stk.id} className="bg-[#192243] rounded-2xl shadow-lg w-60 p-5 flex flex-col items-center">
                <img src={stk.cover} alt={stk.name} className="h-28 rounded mb-2" />
                <div className="text-lg font-bold mb-1">{stk.name}</div>
                <div className="text-base mb-1 text-[#ffd700]">{stk.author}</div>
                <button className={`w-full px-4 py-1 rounded-lg font-bold mt-2 ${
                  stk.owned
                    ? "bg-[#272e3b] text-[#ffd700] border border-[#ffd700]"
                    : "bg-[#ffd700] text-[#181f32] hover:bg-[#fffde4]"
                }`}>
                  {stk.owned ? "已擁有" : "購買"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
