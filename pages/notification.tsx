import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiBell, FiCheckCircle } from "react-icons/fi";

const fakeNotifications = [
  { id: 1, type: "互動", msg: "你的BlogeBook《AI與宇宙文明》獲得 5 位新粉絲關注！", time: "3分鐘前", read: false },
  { id: 2, type: "收益", msg: "你收到一筆新的打賞收入：NT$200", time: "2小時前", read: false },
  { id: 3, type: "系統", msg: "平台 7/1 將進行功能升級，敬請留意。", time: "昨天", read: true },
  { id: 4, type: "貼圖", msg: "你購買的貼圖包『金色宇宙微笑』已入庫，快到會員中心看看吧！", time: "2天前", read: true }
];

export default function Notification() {
  const [notices, setNotices] = useState(fakeNotifications);

  function markRead(idx: number) {
    setNotices(n =>
      n.map((item, i) => i === idx ? { ...item, read: true } : item)
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-2xl mx-auto w-full pt-10 pb-20 px-5">
        <div className="flex items-center mb-7">
          <FiBell size={34} className="text-[#FFD700] mr-3" />
          <span className="text-3xl font-extrabold text-[#FFD700] tracking-wide">通知中心</span>
        </div>
        <div className="flex flex-col gap-4">
          {notices.length === 0 && (
            <div className="text-center text-lg text-gray-400 py-14">目前沒有任何通知。</div>
          )}
          {notices.map((item, idx) => (
            <div
              key={item.id}
              className={`bg-[#17233a] rounded-xl p-5 flex justify-between items-center border-l-4 transition ${
                item.type === "收益" ? "border-[#FFD700]" :
                item.type === "互動" ? "border-blue-400" :
                item.type === "系統" ? "border-gray-500" :
                item.type === "貼圖" ? "border-pink-400" : "border-gray-400"
              } ${item.read ? "opacity-60" : "opacity-100"}`}
            >
              <div>
                <div className="font-bold text-base flex items-center">
                  {item.type === "互動" && <span className="text-blue-400 mr-2">[互動]</span>}
                  {item.type === "收益" && <span className="text-[#FFD700] mr-2">[收益]</span>}
                  {item.type === "系統" && <span className="text-gray-400 mr-2">[系統]</span>}
                  {item.type === "貼圖" && <span className="text-pink-400 mr-2">[貼圖]</span>}
                  <span>{item.msg}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">{item.time}</div>
              </div>
              {!item.read ? (
                <button
                  className="text-xs bg-[#FFD700] text-[#0d1827] px-4 py-2 rounded-lg font-bold ml-4 hover:scale-105 transition"
                  onClick={() => markRead(idx)}
                >
                  標記已讀
                </button>
              ) : (
                <FiCheckCircle size={20} className="text-[#FFD700]" />
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
      <style>{`
        .font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }
      `}</style>
    </div>
  );
}
