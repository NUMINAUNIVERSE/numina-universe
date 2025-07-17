import React from "react";
import Link from "next/link";
import { useUser } from "@/lib/UserContext";

export default function Navbar() {
  const { user, isLoadingUser } = useUser(); // ← 直接用 context
  // 假設你有 user.role，可以這樣判斷 isAdmin
  const isAdmin = user?.role === "admin";

  return (
    <nav className="flex items-center justify-between h-16 px-8 bg-[#0d1a2d] border-b-2 border-[#ffd700]">
      <span className="text-2xl font-extrabold text-[#ffd700] tracking-wider font-montserrat">
        NUMINA UNIVERSE
      </span>
      <div className="flex gap-7 font-bold">
        <Link href="/" className="text-[#ffd700] hover:underline">
          首頁
        </Link>
        <Link href="/blogebook" className="text-[#d4af37] hover:text-[#ffd700]">
          BlogeBook
        </Link>
        <Link href="/wonderland" className="text-[#d4af37] hover:text-[#ffd700]">
          WonderLand
        </Link>
        <Link href="/explore" className="text-[#d4af37] hover:text-[#ffd700]">
          探索
        </Link>
        <Link href="/chat" className="text-[#d4af37] hover:text-[#ffd700]">
          聊天
        </Link>
        <Link href="/notification" className="text-[#d4af37] hover:text-[#ffd700]">
          通知
        </Link>
        <Link href="/profile" className="text-[#d4af37] hover:text-[#ffd700]">
          會員中心
        </Link>
        {/* 僅 admin 登入時顯示「管理後台」 */}
        {!isLoadingUser && user && isAdmin && (
          <Link href="/admin" className="text-[#FFD700] hover:underline">
            管理後台
          </Link>
        )}
        {/* 僅未登入時才顯示登入按鈕 */}
        {!isLoadingUser && !user && (
          <Link href="/login" className="text-[#d4af37] hover:text-[#ffd700]">
            登入
          </Link>
        )}
        {/* 載入中時不顯示登入按鈕 */}
      </div>
    </nav>
  );
}
