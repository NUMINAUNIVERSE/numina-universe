import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fakeIncome = {
  thisMonth: 28380,
  lastMonth: 17300,
  growth: "+64%",
  paid: 25000,
  unpaid: 3380,
  history: [
    { date: "2025/06/25", type: "單篇銷售", work: "宇宙智慧手冊", amount: 480, status: "已結算" },
    { date: "2025/06/23", type: "訂閱分潤", work: "未來文明思維", amount: 1200, status: "未結算" },
    { date: "2025/06/21", type: "打賞", work: "星際少女", amount: 600, status: "已結算" }
  ]
};

export default function Income() {
  const [tab, setTab] = useState<"all" | "paid" | "unpaid">("all");

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
              ${fakeIncome.thisMonth.toLocaleString()}
              <span className="text-base ml-4 text-green-400">{fakeIncome.growth}</span>
            </div>
            <div className="text-base text-gray-300">
              上月：<span className="text-[#FFD700]">${fakeIncome.lastMonth.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <div>
              <span className="text-gray-200">已結算</span>
              <div className="text-xl text-[#FFD700] font-bold">${fakeIncome.paid.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-gray-200">未結算</span>
              <div className="text-xl text-red-300 font-bold">${fakeIncome.unpaid.toLocaleString()}</div>
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
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-[#FFD700]/20 text-[#FFD700]">
                <th className="font-bold py-2">日期</th>
                <th className="font-bold">收益類型</th>
                <th className="font-bold">作品</th>
                <th className="font-bold">金額</th>
                <th className="font-bold">狀態</th>
              </tr>
            </thead>
            <tbody>
              {fakeIncome.history.filter(r=>
                tab==="all"?true:
                tab==="paid"?r.status==="已結算":
                r.status==="未結算"
              ).map((r,i)=>(
                <tr key={i} className="border-b border-[#FFD700]/10 last:border-b-0">
                  <td className="py-2">{r.date}</td>
                  <td>{r.type}</td>
                  <td>{r.work}</td>
                  <td className="text-[#FFD700] font-bold">${r.amount}</td>
                  <td className={r.status==="已結算"?"text-green-400":"text-red-300"}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}
