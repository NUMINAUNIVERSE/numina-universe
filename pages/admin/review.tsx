import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AdminReview() {
  // 假資料
  const reviewList = [
    { id: 1, type: "BlogeBook", title: "生成式AI的未來", creator: "宇宙詩人", status: "待審核", report: false },
    { id: 2, type: "WonderLand貼圖", title: "貓咪宇宙貼圖包", creator: "Jolie藝術家", status: "被檢舉", report: true },
    { id: 3, type: "留言", title: "這個內容不合適", creator: "小紅人", status: "待審核", report: true }
  ];

  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12 w-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div className="text-2xl font-bold text-[#FFD700] mb-4">內容審核中心</div>
          <Link href="/admin" className="text-[#FFD700] underline">回管理首頁</Link>
        </div>
        <div className="bg-[#161e2d] rounded-xl p-6 mb-8 shadow-lg">
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
              {reviewList.map((item) => (
                <tr key={item.id} className="border-b border-[#FFD700]/10">
                  <td className="py-2 px-3">{item.type}</td>
                  <td className="py-2 px-3">{item.title}</td>
                  <td className="py-2 px-3">{item.creator}</td>
                  <td className={`py-2 px-3 ${item.report ? 'text-[#F44336]' : ''}`}>
                    {item.report ? "被檢舉" : item.status}
                  </td>
                  <td className="py-2 px-3">
                    <button className="text-[#FFD700] underline mr-3">通過</button>
                    <button className="text-[#F44336] underline">下架</button>
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
