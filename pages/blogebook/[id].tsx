import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

// 定義 blocks 積木型別，避免 any
type Block = {
  type: string;
  value?: string;
  preview?: string[];
};

interface Work {
  id: string;
  title: string;
  author_id?: string;
  author?: string;
  cover: string;
  tags: string[];
  main_cat?: string;
  pay_mode: "free" | "sub" | "single" | "tip";
  pay_price: number;
  verified?: boolean;
  subscribe?: boolean;
  desc?: string;
  created_at?: string;
  blocks?: Block[];
  type: string;
}

export default function BlogeBookReadPage() {
  const router = useRouter();
  const { id } = router.query;
  const [b, setB] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchWork() {
      setLoading(true);
      const { data } = await supabase
        .from("works")
        .select("*")
        .eq("id", id)
        .single();
      if (data) setB(data as Work);
      setLoading(false);
    }
    fetchWork();
  }, [id]);

  if (loading || !b) {
    return (
      <div className="min-h-screen bg-[#0d1a2d] text-[#ffd700] flex items-center justify-center">
        載入中...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1a2d] text-white flex flex-col">
      <Navbar />
      <div className="max-w-2xl w-full mx-auto flex-1 py-10 px-4">
        {/* 警告不用管，可繼續用 <img>，等有空再改 next/image */}
        <img src={b.cover} alt={b.title} className="w-full h-64 object-cover rounded-2xl mb-6" />
        <div className="flex items-center gap-3 mb-2">
          <span className="font-bold text-3xl">{b.title}</span>
          {b.verified && <span className="inline-block px-2 py-1 text-xs rounded-full bg-[#ffd700] text-[#0d1a2d] font-bold">✔️ 原創</span>}
        </div>
        <div className="flex gap-2 items-center mb-2">
          <span className="text-[#ffd700] font-bold">{b.author || "匿名作者"}</span>
          <button className="bg-[#ffd700] text-[#0d1a2d] font-bold px-4 py-1 rounded-xl ml-3">訂閱作者</button>
        </div>
        <div className="flex gap-2 flex-wrap mb-4">
          {b.tags?.map((tag, i) => (
            <span key={i} className="bg-[#ffd70022] text-[#ffd700] px-3 py-1 rounded-2xl text-xs font-bold">#{tag}</span>
          ))}
        </div>
        <div className="mb-6 text-[#ffd700] font-bold">
          {b.pay_mode === "single" && <>單篇購買 NT${b.pay_price}</>}
          {b.pay_mode === "sub" && <>訂閱制（請訂閱作者）</>}
          {b.pay_mode === "tip" && <>打賞支持</>}
          {b.pay_mode === "free" && <>免費</>}
        </div>
        {/* blocks 內容積木區 */}
        <div className="flex flex-col gap-6 mb-8">
          {b.blocks?.map((block, idx) => {
            if (block.type === "text") return <p key={idx} className="text-lg text-white/90">{block.value}</p>;
            if (block.type === "image") return <img key={idx} src={block.value} alt="" className="w-full rounded-lg" />;
            if (block.type === "sticker") return <img key={idx} src={block.value} alt="" className="h-16" />;
            if (block.type === "audio") return (
              <audio key={idx} controls className="w-full mt-2">
                <source src={block.value} />
                您的瀏覽器不支援音檔播放。
              </audio>
            );
            if (block.type === "pdf") return (
              <iframe
                key={idx}
                src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${block.value}`}
                className="w-full h-96 rounded-lg bg-[#181f32]"
                title="電子書閱讀"
              />
            );
            if (block.type === "carousel" && block.preview) return (
              <div key={idx} className="flex gap-2 overflow-x-auto">
                {block.preview.map((src, i) => (
                  <img key={i} src={src} alt="" className="h-40 rounded" />
                ))}
              </div>
            );
            return null;
          })}
        </div>
        {/* 互動功能（未來API串接） */}
        <div className="flex gap-6 items-center mb-4">
          <button className="text-[#ffd700] hover:scale-105 transition font-bold">👍 讚</button>
          <button className="text-[#ffd700] hover:scale-105 transition font-bold">💾 收藏</button>
          <button className="text-[#ffd700] hover:scale-105 transition font-bold">💬 留言</button>
          <button className="text-[#ffd700] hover:scale-105 transition font-bold">🔗 分享</button>
        </div>
        <div className="text-sm text-[#ffd70099] mb-2">留言、討論區（未來API接入）</div>
      </div>
      <Footer />
    </div>
  );
}
