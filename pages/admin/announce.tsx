import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function AdminAnnounce() {
  // 假資料
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: "NUMINA UNIVERSE 即將上線測試！", date: "2025-07-01" },
    { id: 2, title: "平台新功能：原創藍勾勾認證上線", date: "2025-07-02" }
  ]);
  const [newTitle, setNewTitle] = useState("");

  const addAnnouncement = () => {
    if (newTitle.trim() !== "") {
      setAnnouncements([{ id: Date.now(), title: newTitle, date: new Date().toISOString().split("T")[0] }, ...announcements]);
      setNewTitle("");
    }
  };

  const deleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12 w-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div className="text-2xl font-bold text-[#FFD700] mb-4">公告管理</div>
          <a href="/admin" className="text-[#FFD700] underline">回管理首頁</a>
        </div>
        <div className="bg-[#161e2d] rounded-xl p-6 mb-6 shadow-lg">
          <div className="font-bold text-lg text-[#FFD700] mb-4">新增公告</div>
          <div className="flex gap-4">
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-[#0d1827] text-white border border-[#FFD700]/40 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              placeholder="輸入公告標題..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <button className="bg-[#FFD700] text-[#0d1827] font-bold px-6 py-2 rounded-lg hover:bg-[#fff3a3] transition"
              onClick={addAnnouncement}
            >發佈</button>
          </div>
        </div>
        <div className="bg-[#161e2d] rounded-xl p-6 shadow-lg">
          <div className="font-bold text-lg text-[#FFD700] mb-4">現有公告</div>
          <ul>
            {announcements.map(a => (
              <li key={a.id} className="flex items-center justify-between border-b border-[#FFD700]/10 py-2">
                <span>{a.title} <span className="text-xs text-gray-400 ml-2">{a.date}</span></span>
                <button className="text-[#F44336] underline text-sm" onClick={() => deleteAnnouncement(a.id)}>刪除</button>
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
