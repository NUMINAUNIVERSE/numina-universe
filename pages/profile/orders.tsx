import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fakeOrders = [
  {
    id: 1,
    cover: "/blog1.jpg",
    type: "BlogeBook 單篇",
    title: "AI世代原力全集",
    creator: "創作者男神",
    price: "NT$150",
    date: "2025/06/10",
    status: "已完成"
  },
  {
    id: 2,
    cover: "/sticker1.png",
    type: "貼圖包",
    title: "金色宇宙微笑",
    creator: "插畫師小未來",
    price: "NT$80",
    date: "2025/06/12",
    status: "已完成"
  },
  {
    id: 3,
    cover: "/illust1.jpg",
    type: "WonderLand 作品",
    title: "星際少女漫畫",
    creator: "宇宙繪者A",
    price: "NT$90",
    date: "2025/06/13",
    status: "已完成"
  },
  {
    id: 4,
    cover: "/blog2.jpg",
    type: "BlogeBook 訂閱",
    title: "未來文明思維（每月）",
    creator: "創作者男神",
    price: "NT$180",
    date: "2025/06/18",
    status: "進行中"
  }
];

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-[#0d1827] text-white font-sans flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto pt-10 pb-20 px-5 w-full">
        <div className="text-3xl font-extrabold text-[#FFD700] mb-7">訂單紀錄</div>
        <div className="overflow-x-auto">
          <table className="w-full text-base rounded-xl overflow-hidden bg-[#161e2d] shadow-lg">
            <thead>
              <tr className="bg-[#17233a] text-[#FFD700]">
                <th className="p-3 font-bold">作品</th>
                <th className="p-3 font-bold">類型</th>
                <th className="p-3 font-bold">創作者</th>
                <th className="p-3 font-bold">金額</th>
                <th className="p-3 font-bold">購買日期</th>
                <th className="p-3 font-bold">狀態</th>
              </tr>
            </thead>
            <tbody>
              {fakeOrders.map((o) => (
                <tr key={o.id} className="border-b border-[#203264]/40 hover:bg-[#223164] transition">
                  <td className="p-2 flex items-center">
                    <img src={o.cover} alt={o.title} className="w-12 h-12 rounded-lg object-cover mr-3 border-2 border-[#FFD700]/30" />
                    <span>{o.title}</span>
                  </td>
                  <td className="p-2">{o.type}</td>
                  <td className="p-2">{o.creator}</td>
                  <td className="p-2 text-[#FFD700] font-bold">{o.price}</td>
                  <td className="p-2">{o.date}</td>
                  <td className="p-2">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {fakeOrders.length === 0 && (
          <div className="text-gray-400 text-center py-16 text-lg">目前沒有任何訂單紀錄。</div>
        )}
      </div>
      <Footer />
      <style>{`
        .font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }
        th, td { text-align: left; }
      `}</style>
    </div>
  );
}
