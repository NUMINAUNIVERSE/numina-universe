import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/utils/supabaseClient";
import { useUser } from "@/utils/userContext"; // 你的用戶 context

type PaymentRecord = {
  id: string;
  created_at: string;
  type: string;
  amount: number;
  status: string;
  note: string | null;
};

export default function Income() {
  const { user } = useUser(); // 取登入 user
  const [tab, setTab] = useState<"all" | "paid" | "unpaid">("all");
  const [records, setRecords] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // 統計用
  let paid = 0, unpaid = 0, thisMonth = 0, lastMonth = 0;
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // 資料處理
  records.forEach(rec => {
    const recDate = new Date(rec.created_at);
    if (rec.status === "success") paid += rec.amount;
    else unpaid += rec.amount;
    if (recDate >= thisMonthStart) thisMonth += rec.amount;
    else if (recDate >= lastMonthStart && recDate < thisMonthStart) lastMonth += rec.amount;
  });
  const growth = lastMonth ? `${Math.round(((thisMonth - lastMonth) / lastMonth) * 100)}%` : "+100%";

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    supabase
      .from("user_payments")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRecords(data || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto w-full pt-10 pb-20 px-5">
        <div className="text-3xl font-extrabold text-[#FFD700] mb-4 tracking-wider">收益中心</div>
        {/* 本月總覽 */}
        <div className="bg-[#17233a] rounded-xl p-6 flex items-center mb-8 shadow-lg">
          <div className="flex-1">
            <div className="text-xl font-bold text-[#FFD700]">本月總收益</div>
            <div className="text-4xl font-extrabold mt-1 mb-2">
              ${thisMonth.toLocaleString()}
              <span className="text-base ml-4 text-green-400">{growth}</span>
            </div>
            <div className="text-base text-gray-300">
              上月：<span className="text-[#FFD700]">${lastMonth.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <div>
              <span className="text-gray-200">已結算</span>
              <div className="text-xl text-[#FFD700] font-bold">${paid.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-gray-200">未結算</span>
              <div className="text-xl text-red-300 font-bold">${unpaid.toLocaleString()}</div>
            </div>
          </div>
        </div>
        {/* Tab */}
        <div className="flex gap-4 mb-3">
          <button className={`px-5 py-2 rounded-lg font-bold text-lg ${tab==="all"?"bg-[#FFD700] text-[#0d1827]":"bg-[#15203b] text-[#FFD700]"}`} onClick={()=>setTab("all")}>全部收益</button>
          <button className={`px-5 py-2 rounded-lg font-bold text-lg ${tab==="paid"?"bg-[#FFD700] text-[#0d1827]":"bg-[#15203b] text-[#FFD700]"}`} onClick={()=>setTab("paid")}>已結算</button>
          <button className={`px-5 py-2 rounded-lg font-bold text-lg ${tab==="unpaid"?"bg-[#FFD700] text-[#0d1827]":"bg-[#15203b] text-[#FFD700]"}`} onClick={()=>setTab("unpaid")}>未結算</button>
        </div>
        {/* 收益明細 */}
        <div className="bg-[#161e2d] rounded-xl p-5 shadow">
          <div className="text-lg font-bold text-[#FFD700] mb-3">近期收益明細</div>
          {loading ? (
            <div className="py-10 text-center text-gray-400">載入中…</div>
          ) : (
            <table className="w-full text-base">
              <thead>
                <tr className="border-b border-[#FFD700]/20 text-[#FFD700]">
                  <th className="font-bold py-2">日期</th>
                  <th className="font-bold">類型</th>
                  <th className="font-bold">備註</th>
                  <th className="font-bold">金額</th>
                  <th className="font-bold">狀態</th>
                </tr>
              </thead>
              <tbody>
                {records.filter(r=>
                  tab==="all"?true:
                  tab==="paid"?r.status==="success":
                  r.status!=="success"
                ).map((r,_idx)=>(
                  <tr key={r.id} className="border-b border-[#FFD700]/10 last:border-b-0">
                    <td className="py-2">{r.created_at.slice(0,10)}</td>
                    <td>{r.type}</td>
                    <td>{r.note || "-"}</td>
                    <td className="text-[#FFD700] font-bold">${r.amount}</td>
                    <td className={r.status==="success"?"text-green-400":"text-red-300"}>
                      {r.status==="success"?"已結算":"未結算"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
