import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Finance {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  status: string;
  users?: { name: string };
}

export default function AdminFinance() {
  const [incomes, setIncomes] = useState<Finance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFinance = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("finances")
        .select("id, user_id, type, amount, status, users(name)")
        .order("created_at", { ascending: false });
      if (!error && data) setIncomes(data as Finance[]);
      setLoading(false);
    };
    fetchFinance();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12 w-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div className="text-2xl font-bold text-[#FFD700] mb-4">收益管理</div>
          <Link href="/admin" className="text-[#FFD700] underline">回管理首頁</Link>
        </div>
        <div className="bg-[#161e2d] rounded-xl p-6 shadow-lg">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="border-b border-[#FFD700]/30">
                <th className="py-2 px-3">用戶名稱</th>
                <th className="py-2 px-3">收益類型</th>
                <th className="py-2 px-3">金額</th>
                <th className="py-2 px-3">狀態</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4}>載入中…</td></tr>
              ) : incomes.length === 0 ? (
                <tr><td colSpan={4} className="text-gray-400">暫無數據</td></tr>
              ) : (
                incomes.map((i) => (
                  <tr key={i.id} className="border-b border-[#FFD700]/10">
                    <td className="py-2 px-3">{i.users?.name || "-"}</td>
                    <td className="py-2 px-3">{i.type}</td>
                    <td className="py-2 px-3">{i.amount}</td>
                    <td className="py-2 px-3">{i.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
      <style>{`.font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }`}</style>
    </div>
  );
}
