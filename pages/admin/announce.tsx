import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AdminAnnounce() {
  const announceList = [
    { id: 1, title: "平台正式啟動公告", date: "2025-07-01", content: "NUMINA UNIVERSE 現正熱烈上線，歡迎創作者加入！" },
    { id: 2, title: "6/30系統維護通知", date: "2025-06-30", content: "本平台將於6/30 23:00~02:00進行例行維護，請提前儲存創作。" }
  ];
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
          <ul>
            {announceList.map(a => (
              <li key={a.id} className="mb-6 border-b border-[#FFD700]/20 pb-3">
                <div className="text-lg font-bold">{a.title}</div>
                <div className="text-xs text-gray-400 mb-2">{a.date}</div>
                <div className="mb-2">{a.content}</div>
                <button className="text-[#FFD700] underline text-sm mr-2">編輯</button>
                <button className="text-red-500 underline text-sm">刪除</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
      <style>{`.font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }`}</style>
    </div>
  );
}
