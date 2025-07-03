import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Announce {
  id: string;
  title: string;
  content: string;
  date: string; // or Date, 視欄位型別而定
  created_at?: string;
  updated_at?: string;
}

export default function AdminAnnounce() {
  const [announceList, setAnnounceList] = useState<Announce[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnnounces = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("announces")
        .select("id, title, content, date, created_at, updated_at")
        .order("date", { ascending: false });
      if (!error && data) setAnnounceList(data as Announce[]);
      setLoading(false);
    };
    fetchAnnounces();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12 w-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div className="text-2xl font-bold text-[#FFD700] mb-4">公告管理</div>
          <Link href="/admin" className="text-[#FFD700] underline">回管理首頁</Link>
        </div>
        <div className="bg-[#161e2d] rounded-xl p-6 shadow-lg mb-6">
          <div className="font-bold text-lg text-[#FFD700] mb-4">公告列表</div>
          {loading ? (
            <div>載入中…</div>
          ) : (
            <ul>
              {announceList.map(a => (
                <li key={a.id} className="mb-6 border-b border-[#FFD700]/20 pb-3">
                  <div className="text-lg font-bold">{a.title}</div>
                  <div className="text-xs text-gray-400 mb-2">{a.date || a.created_at?.slice(0, 10)}</div>
                  <div className="mb-2">{a.content}</div>
                  {/* 實際開發時要串接編輯、刪除功能 */}
                  <button className="text-[#FFD700] underline text-sm mr-2" disabled>編輯</button>
                  <button className="text-red-500 underline text-sm" disabled>刪除</button>
                </li>
              ))}
              {announceList.length === 0 && <li className="text-gray-400">暫無公告</li>}
            </ul>
          )}
        </div>
      </div>
      <Footer />
      <style>{`.font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }`}</style>
    </div>
  );
}
