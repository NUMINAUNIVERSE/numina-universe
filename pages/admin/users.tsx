import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AdminUsers() {
  const users = [
    { id: 1, name: "宇宙詩人", email: "user1@numina.com", role: "creator", certified: true, status: "正常" },
    { id: 2, name: "Jolie藝術家", email: "user2@numina.com", role: "creator", certified: false, status: "正常" },
    { id: 3, name: "小紅人", email: "user3@numina.com", role: "user", certified: false, status: "停權" },
    { id: 4, name: "王大明", email: "user4@numina.com", role: "user", certified: false, status: "正常" }
  ];

  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12 w-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div className="text-2xl font-bold text-[#FFD700] mb-4">用戶管理</div>
          <Link href="/admin" className="text-[#FFD700] underline">回管理首頁</Link>
        </div>
        <div className="bg-[#161e2d] rounded-xl p-6 shadow-lg">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="border-b border-[#FFD700]/30">
                <th className="py-2 px-3">用戶名稱</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">身分</th>
                <th className="py-2 px-3">認證</th>
                <th className="py-2 px-3">狀態</th>
                <th className="py-2 px-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-[#FFD700]/10">
                  <td className="py-2 px-3">{u.name}</td>
                  <td className="py-2 px-3">{u.email}</td>
                  <td className="py-2 px-3">{u.role === "creator" ? "創作者" : "一般用戶"}</td>
                  <td className="py-2 px-3">
                    {u.certified ? <span className="text-[#FFD700] font-bold">藍勾勾</span> : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="py-2 px-3">{u.status}</td>
                  <td className="py-2 px-3">
                    {u.status === "正常" ?
                      <button className="text-[#F44336] underline mr-2">停權</button> :
                      <button className="text-[#FFD700] underline mr-2">恢復</button>
                    }
                    <button className="text-blue-400 underline">查看</button>
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
