import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";
import { useUser } from "@/utils/userContext";

type Order = {
  id: string;
  created_at: string;
  type: string;
  amount: number;
  status: string;
  note: string | null;
};

export default function OrdersPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    supabase
      .from("user_payments")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders(data || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="min-h-screen bg-[#0d1827] text-white font-sans flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto w-full px-3 py-10">
        <div className="text-2xl font-bold text-[#FFD700] mb-6">過去訂單</div>
        <div className="bg-[#17233a] rounded-2xl overflow-hidden shadow-lg text-lg">
          {loading ? (
            <div className="py-10 text-center text-gray-400">載入中…</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-[#FFD700]">
                  <th className="py-3 px-4 font-bold text-left">訂單編號</th>
                  <th className="py-3 px-4 font-bold text-left">日期</th>
                  <th className="py-3 px-4 font-bold text-left">類型</th>
                  <th className="py-3 px-4 font-bold text-left">備註</th>
                  <th className="py-3 px-4 font-bold text-right">金額</th>
                  <th className="py-3 px-4 font-bold text-center">狀態</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-t border-[#23345b]">
                    <td className="py-3 px-4">{order.id}</td>
                    <td className="py-3 px-4">{order.created_at.slice(0,10)}</td>
                    <td className="py-3 px-4">{order.type}</td>
                    <td className="py-3 px-4">{order.note || "-"}</td>
                    <td className="py-3 px-4 text-right">${order.amount}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={order.status==="success" ? "text-green-400" : "text-red-300"}>
                        {order.status==="success" ? "已完成" : "未完成"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
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
