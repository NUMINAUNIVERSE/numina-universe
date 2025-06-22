import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AdminDashboard() {
  // 假數據，可串API
  const stats = [
    { title: "總用戶", value: 1342, color: "#FFD700" },
    { title: "總創作者", value: 156, color: "#F7C873" },
    { title: "作品總數", value: 2409, color: "#FFD700" },
    { title: "待審內容", value: 11, color: "#F44336" }
  ];

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
            <div key={i} className="bg-[#161e2d] rounded-xl py-8 flex flex-col items-center shadow-lg border-b-4" style={{borderColor: s.color}}>
              <div className="text-2xl font-bold" style={{color: s.color}}>{s.value}</div>
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
                <tr className="border-b border-[#FFD700]/10">
                  <td className="py-2 px-3">BlogeBook</td>
                  <td className="py-2 px-3">AI革命下的創作自由</td>
                  <td className="py-2 px-3">宇宙詩人</td>
                  <td className="py-2 px-3 text-[#F44336]">待審核</td>
                  <td className="py-2 px-3"><button className="text-[#FFD700] underline">審核</button></td>
                </tr>
                <tr>
                  <td className="py-2 px-3">檢舉</td>
                  <td className="py-2 px-3">貼圖包 #484 被舉報抄襲</td>
                  <td className="py-2 px-3">瑪奇朵</td>
                  <td className="py-2 px-3 text-[#FFD700]">已檢舉</td>
                  <td className="py-2 px-3"><button className="text-[#FFD700] underline">處理</button></td>
                </tr>
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
