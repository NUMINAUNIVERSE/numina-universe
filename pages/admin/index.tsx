import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase 設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type ReviewRow = {
  type: string;
  title: string;
  author: string;
  status: string;
  action: string;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { title: "總用戶", value: 0, color: "#FFD700" },
    { title: "總創作者", value: 0, color: "#F7C873" },
    { title: "作品總數", value: 0, color: "#FFD700" },
    { title: "待審內容", value: 0, color: "#F44336" }
  ]);

  const [recentReview, setRecentReview] = useState<ReviewRow[]>([]);

  useEffect(() => {
    // 串接後台總覽數據
    const fetchStats = async () => {
      // 用戶總數
      const { count: userCount } = await supabase.from("users").select("*", { count: "exact", head: true });
      // 創作者總數
      const { count: creatorCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "creator");
      // 作品總數
      const { count: worksCount } = await supabase.from("works").select("*", { count: "exact", head: true });
      // 待審內容
      const { count: reviewCount } = await supabase
        .from("works")
        .select("*", { count: "exact", head: true })
        .eq("review_status", "pending");
      setStats([
        { title: "總用戶", value: userCount ?? 0, color: "#FFD700" },
        { title: "總創作者", value: creatorCount ?? 0, color: "#F7C873" },
        { title: "作品總數", value: worksCount ?? 0, color: "#FFD700" },
        { title: "待審內容", value: reviewCount ?? 0, color: "#F44336" }
      ]);
    };

    // 近期待審內容
    const fetchReview = async () => {
      const { data } = await supabase
        .from("works")
        .select("id, title, author_id, review_status")
        .eq("review_status", "pending")
        .order("created_at", { ascending: false })
        .limit(5);
      const rows: ReviewRow[] = [];
      if (data && data.length) {
        for (const row of data) {
          let authorName = "未知";
          if (row.author_id) {
            const { data: author } = await supabase.from("users").select("name").eq("id", row.author_id).single();
            authorName = author?.name ?? "未知";
          }
          rows.push({
            type: "BlogeBook",
            title: row.title,
            author: authorName,
            status: "待審核",
            action: "審核"
          });
        }
      }
      setRecentReview(rows);
    };

    fetchStats();
    fetchReview();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto w-full px-4 py-10 flex flex-col">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div className="text-3xl font-bold text-[#FFD700] mb-2">NUMINA 管理員後台</div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/admin/permission" className="bg-[#FFD700] text-[#0d1827] font-bold rounded-lg px-6 py-2 hover:bg-[#fff3a3] transition">權限/認證審核</Link>
            <Link href="/admin/review" className="bg-[#FFD700]/60 text-[#0d1827] font-bold rounded-lg px-6 py-2 hover:bg-[#FFD700] transition">內容審核</Link>
            <Link href="/admin/announce" className="bg-[#FFD700]/60 text-[#0d1827] font-bold rounded-lg px-6 py-2 hover:bg-[#FFD700] transition">公告管理</Link>
          </div>
        </div>
        {/* 儀表板總覽 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {stats.map((s, i) => (
            <div key={i} className="bg-[#161e2d] rounded-xl py-8 flex flex-col items-center shadow-lg border-b-4" style={{ borderColor: s.color }}>
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-lg mt-2">{s.title}</div>
            </div>
          ))}
        </div>
        {/* 近期待審/舉報 */}
        <div className="bg-[#161e2d] rounded-xl p-6 mb-10 shadow-lg">
          <div className="text-xl font-bold text-[#FFD700] mb-4">近期待審內容</div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="border-b border-[#FFD700]/30">
                  <th className="py-2 px-3">類型</th>
                  <th className="py-2 px-3">標題/內容</th>
                  <th className="py-2 px-3">創作者</th>
                  <th className="py-2 px-3">狀態</th>
                  <th className="py-2 px-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {recentReview.length > 0 ? recentReview.map((r, i) => (
                  <tr key={i} className="border-b border-[#FFD700]/10">
                    <td className="py-2 px-3">{r.type}</td>
                    <td className="py-2 px-3">{r.title}</td>
                    <td className="py-2 px-3">{r.author}</td>
                    <td className="py-2 px-3 text-[#F44336]">{r.status}</td>
                    <td className="py-2 px-3"><button className="text-[#FFD700] underline">{r.action}</button></td>
                  </tr>
                )) : (
                  <tr>
                    <td className="py-2 px-3" colSpan={5}>暫無待審內容</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* 公告管理入口 */}
        <div className="flex justify-end">
          <Link href="/admin/announce" className="bg-[#FFD700] text-[#0d1827] font-bold rounded-lg px-8 py-2 hover:bg-[#fff3a3] transition">公告管理</Link>
        </div>
      </div>
      <Footer />
      <style>{`.font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }`}</style>
    </div>
  );
}
