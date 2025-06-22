import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

// 假訂單資料
const orders = [
  {
    id: "A20240601",
    date: "2024-06-25",
    item: "AI世代原力全集 BlogeBook",
    price: 280,
    status: "已完成"
  },
  {
    id: "A20240602",
    date: "2024-06-22",
    item: "宇宙貼圖組",
    price: 100,
    status: "已完成"
  }
];

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-[#0d1827] text-white font-sans flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto w-full px-3 py-10">
        <div className="text-2xl font-bold text-[#FFD700] mb-6">過去訂單</div>
        <table className="w-full bg-[#17233a] rounded-2xl overflow-hidden shadow-lg text-lg">
          <thead>
            <tr className="text-[#FFD700]">
              <th className="py-3 px-4 font-bold text-left">訂單編號</th>
              <th className="py-3 px-4 font-bold text-left">日期</th>
              <th className="py-3 px-4 font-bold text-left">商品</th>
              <th className="py-3 px-4 font-bold text-right">金額</th>
              <th className="py-3 px-4 font-bold text-center">狀態</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-t border-[#23345b]">
                <td className="py-3 px-4">{order.id}</td>
                <td className="py-3 px-4">{order.date}</td>
                <td className="py-3 px-4">{order.item}</td>
                <td className="py-3 px-4 text-right">${order.price}</td>
                <td className="py-3 px-4 text-center">
                  <span className="text-green-400">{order.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-8">
          <Link href="/profile" className="text-[#FFD700] font-bold hover:underline">
            ← 返回會員中心
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
