import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/utils/supabaseClient";

// 依據 schema 補型別
interface UserApply {
  id: string;
  name: string;
  desc: string;
  status: string;
}
interface RoleUser {
  id: string;
  name: string;
  role: string;
  is_verified: boolean;
}

export default function AdminPermission() {
  // 狀態
  const [applyList, setApplyList] = useState<UserApply[]>([]);
  const [roleList, setRoleList] = useState<RoleUser[]>([]);

  // 載入資料
  useEffect(() => {
    const fetchApplies = async () => {
      const { data } = await supabase
        .from("users")
        .select("id, name, desc, is_verified, role")
        .order("created_at", { ascending: false });

      if (data) {
        // 尚未認證的創作者
        const apply = data
          .filter((u: { role: string; is_verified: boolean }) => u.role === "creator" && !u.is_verified)
          .map((u: { id: string; name: string; desc?: string }) => ({
            id: u.id,
            name: u.name,
            desc: u.desc || "無補充說明",
            status: "待審核"
          }));
        setApplyList(apply);

        // 2. 用戶/創作者列表
        setRoleList(
          data.map((u: { id: string; name: string; role: string; is_verified: boolean }) => ({
            id: u.id,
            name: u.name,
            role: u.role,
            is_verified: u.is_verified
          }))
        );
      }
    };
    fetchApplies();
  }, []);

  // 通過認證
  const handleCertify = async (userId: string) => {
    await supabase.from("users").update({ is_verified: true }).eq("id", userId);
    location.reload();
  };

  // 取消認證
  const handleUncertify = async (userId: string) => {
    await supabase.from("users").update({ is_verified: false }).eq("id", userId);
    location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="text-2xl font-bold text-[#FFD700] mb-6">權限管理 & 原創認證審核</div>
        {/* 原創認證申請 */}
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
              {applyList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400 py-6">目前無待審核認證</td>
                </tr>
              ) : (
                applyList.map(app => (
                  <tr key={app.id} className="border-b border-[#FFD700]/10">
                    <td className="py-2 px-3">{app.name}</td>
                    <td className="py-2 px-3">{app.desc}</td>
                    <td className="py-2 px-3">{app.status}</td>
                    <td className="py-2 px-3">
                      <button className="text-[#FFD700] underline mr-3" onClick={() => handleCertify(app.id)}>
                        通過
                      </button>
                      <button className="text-[#F44336] underline" onClick={() => handleUncertify(app.id)}>
                        拒絕
                      </button>
                    </td>
                  </tr>
                ))
              )}
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
                    {user.is_verified
                      ? <span className="text-[#FFD700] font-bold">藍勾勾</span>
                      : <span className="text-gray-400">—</span>
                    }
                  </td>
                  <td className="py-2 px-3">
                    {user.is_verified
                      ? <button className="text-[#F44336] underline" onClick={() => handleUncertify(user.id)}>
                        取消認證
                      </button>
                      : <button className="text-[#FFD700] underline" onClick={() => handleCertify(user.id)}>
                        給予認證
                      </button>
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
