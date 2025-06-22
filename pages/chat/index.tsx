import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import Link from "next/link";

export default function ChatHome() {
  const [tab, setTab] = useState<"group" | "dm">("group");
  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-3xl mx-auto pt-10 pb-16 px-4 w-full flex flex-col">
        <div className="flex mb-5">
          <button
            className={`py-3 px-7 rounded-t-lg font-bold text-lg ${tab === "group" ? "bg-[#FFD700] text-[#0d1827]" : "bg-[#161e2d] text-white"}`}
            onClick={() => setTab("group")}
          >群組聊天室</button>
          <button
            className={`py-3 px-7 rounded-t-lg font-bold text-lg ml-2 ${tab === "dm" ? "bg-[#FFD700] text-[#0d1827]" : "bg-[#161e2d] text-white"}`}
            onClick={() => setTab("dm")}
          >私人訊息</button>
        </div>
        <div className="flex-1">
          {tab === "group" ? <GroupChatList /> : <DMChatList />}
        </div>
      </div>
      <Footer />
      <style>{`
        .font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }
      `}</style>
    </div>
  );
}

// 模擬聊天室清單元件
function GroupChatList() {
  return (
    <div>
      <div className="font-bold text-[#FFD700] text-lg mb-4">我的群組聊天室</div>
      <ul className="space-y-3">
        <li>
          <Link href="/chat/group/1" legacyBehavior>
            <a className="block bg-[#222d44] rounded-xl px-5 py-4 hover:bg-[#292f45] transition font-bold text-white">
              NUMINA 宇宙創作者群組 <span className="ml-2 text-sm text-[#FFD700]">99+ 未讀</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/chat/group/2" legacyBehavior>
            <a className="block bg-[#222d44] rounded-xl px-5 py-4 hover:bg-[#292f45] transition font-bold text-white">
              WonderLand 畫師討論區
            </a>
          </Link>
        </li>
      </ul>
    </div>
  );
}
function DMChatList() {
  return (
    <div>
      <div className="font-bold text-[#FFD700] text-lg mb-4">私人訊息</div>
      <ul className="space-y-3">
        <li>
          <Link href="/chat/dm/andy" legacyBehavior>
            <a className="block bg-[#222d44] rounded-xl px-5 py-4 hover:bg-[#292f45] transition font-bold text-white">
              Andy（男神鐵粉） <span className="ml-2 text-xs text-[#FFD700]">2 則新訊息</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/chat/dm/julia" legacyBehavior>
            <a className="block bg-[#222d44] rounded-xl px-5 py-4 hover:bg-[#292f45] transition font-bold text-white">
              Julia（插畫家）
            </a>
          </Link>
        </li>
      </ul>
    </div>
  );
}
