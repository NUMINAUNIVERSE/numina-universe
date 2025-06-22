import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminPermission() {
  // 假資料
  const applyList = [
    { id: 1, name: "Jolie藝術家", desc: "專職插畫師，申請藍勾勾", status: "待審核" },
    { id: 2, name: "宇宙詩人", desc: "BlogeBook原創申請", status: "已通過" },
    { id: 3, name: "小紅人", desc: "貼圖包創作者，申請專屬標章", status: "待審核" }
  ];
  const roleList = [
    { id: 1, name: "Jolie藝術家", role: "creator", certified: false },
    { id: 2, name: "宇宙詩人", role: "creator", certified: true },
    { id: 3, name: "小紅人", role: "user", certified: false }
  ];

  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="text-2xl font-bold text-[#FFD700] mb-6">權限管理 & 原創認證審核</div>

        {/* 藍勾勾申請審核 */}
        <div className="bg-[#161e2d] rounded-xl p-6 mb-8 shadow-lg">
          <div className="text-lg font-bold text-[#FFD700] mb-3">原創作者認證申請</div>
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="border-b border-[#FFD700]/20">
                <th className="py-2 px-3">用戶</th>
                <th className="py-2 px-3">說明</th>
                <th className="py-2 px-3">狀態</th>
                <th className="py-2 px-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {applyList.map(app => (
                <tr key={app.id} className="border-b border-[#FFD700]/10">
                  <td className="py-2 px-3">{app.name}</td>
                  <td className="py-2 px-3">{app.desc}</td>
                  <td className="py-2 px-3">{app.status}</td>
                  <td className="py-2 px-3">
                    {app.status === "待審核"
                      ? <>
                          <button className="text-[#FFD700] underline mr-3">通過</button>
                          <button className="text-[#F44336] underline">拒絕</button>
                        </>
                      : <span className="text-green-400">已處理</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 用戶/創作者權限設定 */}
        <div className="bg-[#161e2d] rounded-xl p-6 shadow-lg">
          <div className="text-lg font-bold text-[#FFD700] mb-3">用戶/創作者權限設定</div>
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="border-b border-[#FFD700]/20">
                <th className="py-2 px-3">用戶</th>
                <th className="py-2 px-3">身分</th>
                <th className="py-2 px-3">認證標章</th>
                <th className="py-2 px-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {roleList.map(user => (
                <tr key={user.id} className="border-b border-[#FFD700]/10">
                  <td className="py-2 px-3">{user.name}</td>
                  <td className="py-2 px-3">{user.role === "creator" ? "創作者" : "一般用戶"}</td>
                  <td className="py-2 px-3">
                    {user.certified
                      ? <span className="text-[#FFD700] font-bold">藍勾勾</span>
                      : <span className="text-gray-400">—</span>
                    }
                  </td>
                  <td className="py-2 px-3">
                    {user.certified
                      ? <button className="text-[#F44336] underline">取消認證</button>
                      : <button className="text-[#FFD700] underline">給予認證</button>
                    }
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
