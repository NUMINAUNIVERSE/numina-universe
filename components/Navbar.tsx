import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between h-16 px-8 bg-[#0d1a2d] border-b-2 border-[#ffd700]">
      <span className="text-2xl font-extrabold text-[#ffd700] tracking-wider font-montserrat">NUMINA UNIVERSE</span>
      <div className="flex gap-7 font-bold">
        <Link href="/" className="text-[#ffd700] hover:underline">首頁</Link>
        <Link href="/blogebook" className="text-[#d4af37] hover:text-[#ffd700]">BlogeBook</Link>
        <Link href="/wonderland" className="text-[#d4af37] hover:text-[#ffd700]">WonderLand</Link>
        <Link href="/explore" className="text-[#d4af37] hover:text-[#ffd700]">探索</Link>
        <Link href="/chat" className="text-[#d4af37] hover:text-[#ffd700]">聊天</Link>
        <Link href="/notification" className="text-[#d4af37] hover:text-[#ffd700]">通知</Link>
        <Link href="/profile" className="text-[#d4af37] hover:text-[#ffd700]">會員中心</Link>
        <Link href="/login" className="text-[#d4af37] hover:text-[#ffd700]">登入</Link>
      </div>
    </nav>
  );
}
