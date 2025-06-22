import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0d1a2d] text-[#ffd700c0] border-t-2 border-[#ffd70044] mt-10 py-8 text-center text-base">
      <div>
        © 2025 NUMINA UNIVERSE｜
        <Link href="/faq" className="text-[#ffd700] underline">FAQ</Link>｜
        <Link href="/terms" className="text-[#ffd700] underline">服務條款</Link>｜
        <Link href="/privacy" className="text-[#ffd700] underline">隱私政策</Link>｜
        <Link href="/about" className="text-[#ffd700] underline">關於我們</Link>
      </div>
      <div className="mt-2 text-sm">神性宇宙級全球創作社群，智慧原鄉新起點！</div>
    </footer>
  );
}

