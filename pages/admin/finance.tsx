import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AdminFinance() {
  const summary = {
    totalRevenue: 120000,
    creatorPayout: 90000,
    platformRevenue: 30000,
    lastPayout: "2025-06-30"
  };
  const payoutList = [
    { id: 1, name: "宇宙詩人", amount: 5000, date: "2025-07-05", status: "已發放" },
    { id: 2, name: "Jolie藝術家", amount: 7000, date: "2025-07-05", status: "已發放" },
    { id: 3, name: "小紅人", amount: 3500, date: "2025-07-01", status: "待發放" }
  ];

  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div className="text-2xl font-bold text-[#FFD700] mb-4">收益管理</div>
          <Link href="/admin" className="text-[#FFD700] underline">回管理首頁</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#161e2d] rounded-xl p-6 text-center">
            <div className="text-lg text-[#FFD700] font-bold">平台總營收</div>
            <div className="text-2xl mt-2 mb-1">{summary.totalRevenue.toLocaleString()} 元</div>
          </div>
          <div className="bg-[#161e2d] rounded-xl p-6 text-center">
            <div className="text-lg text-[#FFD700] font-bold">創作者分潤總額</div>
            <div className="text-2xl mt-2 mb-1">{summary.creatorPayout.toLocaleString()} 元</div>
          </div>
          <div className="bg-[#161e2d] rounded-xl p-6 text-center">
            <div className="text-lg text-[#FFD700] font-bold">平台收入</div>
            <div className="text-2xl mt-2 mb-1">{summary.platformRevenue.toLocaleString()} 元</div>
          </div>
        </div>
        <div className="bg-[#161e2d] rounded-xl p-6 shadow-lg mb-8">
          <div className="font-bold text-lg text-[#FFD700] mb-4">分潤發放記錄</div>
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="border-b border-[#FFD700]/30">
                <th className="py-2 px-3">創作者</th>
                <th className="py-2 px-3">金額</th>
                <th className="py-2 px-3">發放日期</th>
                <th className="py-2 px-3">狀態</th>
                <th className="py-2 px-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {payoutList.map((p) => (
                <tr key={p.id} className="border-b border-[#FFD700]/10">
                  <td className="py-2 px-3">{p.name}</td>
                  <td className="py-2 px-3">{p.amount.toLocaleString()} 元</td>
                  <td className="py-2 px-3">{p.date}</td>
                  <td className="py-2 px-3">{p.status}</td>
                  <td className="py-2 px-3">
                    {p.status === "待發放" && <button className="text-[#FFD700] underline">確認發放</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
      <style>{`.font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }`}</style>
    </div>
  );
}
