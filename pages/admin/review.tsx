import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface ReviewItem {
  id: string;
  type: string;
  title: string;
  creator: string;
  status: string;
  report: boolean;
}

export default function AdminReview() {
  const [reviewList, setReviewList] = useState<ReviewItem[]>([]);

  useEffect(() => {
    // works, comments 多型態審核
    const fetchReviews = async () => {
      const works = await supabase
        .from("works")
        .select("id, title, author:author_id(name), status, reported")
        .order("created_at", { ascending: false });
      const comments = await supabase
        .from("comments")
        .select("id, content, user:user_id(name), status, reported")
        .order("created_at", { ascending: false });

      const arr: ReviewItem[] = [];

      // 作品審核
      if (works.data) {
        arr.push(
          ...works.data.map((w: {
            id: string;
            title: string;
            author: { name: string } | null;
            status: string;
            reported?: boolean | null;
          }): ReviewItem => ({
            id: w.id,
            type: "作品",
            title: w.title,
            creator: w.author?.name || "-",
            status: w.status === "pending" ? "待審核" : w.status,
            report: w.reported ?? false,
          }))
        );
      }
      // 留言審核
      if (comments.data) {
        arr.push(
          ...comments.data.map((c: {
            id: string;
            content: string;
            user: { name: string } | null;
            status: string;
            reported?: boolean | null;
          }): ReviewItem => ({
            id: c.id,
            type: "留言",
            title: c.content.slice(0, 16),
            creator: c.user?.name || "-",
            status: c.status === "pending" ? "待審核" : c.status,
            report: c.reported ?? false,
          }))
        );
      }
      setReviewList(arr);
    };

    fetchReviews();
  }, []);

  // 審核操作
  const handleApprove = async (id: string, type: string) => {
    if (type === "作品") {
      await supabase.from("works").update({ status: "approved" }).eq("id", id);
    }
    if (type === "留言") {
      await supabase.from("comments").update({ status: "approved" }).eq("id", id);
    }
    location.reload();
  };

  const handleReject = async (id: string, type: string) => {
    if (type === "作品") {
      await supabase.from("works").update({ status: "rejected" }).eq("id", id);
    }
    if (type === "留言") {
      await supabase.from("comments").update({ status: "rejected" }).eq("id", id);
    }
    location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12 w-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div className="text-2xl font-bold text-[#FFD700] mb-4">內容審核中心</div>
          <Link href="/admin" className="text-[#FFD700] underline">回管理首頁</Link>
        </div>
        <div className="bg-[#161e2d] rounded-xl p-6 mb-8 shadow-lg">
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
              {reviewList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-6">目前無需審核內容</td>
                </tr>
              ) : (
                reviewList.map((item) => (
                  <tr key={item.id} className="border-b border-[#FFD700]/10">
                    <td className="py-2 px-3">{item.type}</td>
                    <td className="py-2 px-3">{item.title}</td>
                    <td className="py-2 px-3">{item.creator}</td>
                    <td className={`py-2 px-3 ${item.report ? 'text-[#F44336]' : ''}`}>
                      {item.report ? "被檢舉" : item.status}
                    </td>
                    <td className="py-2 px-3">
                      <button className="text-[#FFD700] underline mr-3" onClick={() => handleApprove(item.id, item.type)}>通過</button>
                      <button className="text-[#F44336] underline" onClick={() => handleReject(item.id, item.type)}>下架</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
      <style>{`.font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }`}</style>
    </div>
  );
}
