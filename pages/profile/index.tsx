import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// 假資料
const user = {
  cover: "/cover.jpg",
  avatar: "/avatar.jpg",
  name: "創作者男神",
  verified: true,
  intro: "跨時代創作者，AI時代知識變現領航人！",
  fans: 1200,
  following: 85,
};

const blogeBooks = [
  { id: 1, title: "AI世代原力全集", cover: "/blog1.jpg" },
  { id: 2, title: "文明架構者思維", cover: "/blog2.jpg" }
];

const wonderLands = [
  { id: 1, title: "星際少女", cover: "/illust1.jpg" },
  { id: 2, title: "數位貼圖包", cover: "/illust2.jpg" }
];

const collectedWorks = [
  { id: 1, title: "熱門雜誌特刊", cover: "/blog2.jpg" }
];

const myStickers = [
  { id: 1, name: "宇宙貼圖組", cover: "/sticker1.jpg" }
];

export default function ProfilePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d1827] text-white font-sans flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto w-full px-3 py-6">
        {/* 封面+頭像 */}
        <div className="relative rounded-3xl overflow-hidden mb-4 bg-[#1c2944] shadow-lg">
          <img src={user.cover} alt="創作者封面" className="w-full h-40 object-cover" />
          <div className="absolute left-8 -bottom-12 flex items-end">
            <img
              src={user.avatar}
              alt="創作者頭貼"
              className="w-28 h-28 rounded-full border-4 border-white shadow-xl bg-white object-cover"
            />
            <div className="ml-5 pb-2">
              <div className="flex items-center text-2xl font-bold">
                {user.name}
                {user.verified && (
                  <span className="ml-2 text-[#FFD700] text-lg" title="原創認證">
                    ✔️
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-300">{user.intro}</div>
            </div>
          </div>
          <button
            className="absolute right-8 bottom-8 bg-[#FFD700] text-[#0d1827] font-bold px-6 py-2 rounded-xl text-lg shadow-lg hover:bg-yellow-400"
          >
            編輯主頁
          </button>
        </div>
        {/* 基本統計 */}
        <div className="flex mt-14 mb-6 space-x-10 text-lg">
          <div>
            <span className="font-bold text-[#FFD700]">{user.fans}</span> 粉絲
          </div>
          <div>
            <span className="font-bold text-[#FFD700]">{user.following}</span> 追蹤中
          </div>
        </div>
        {/* 作品區塊 */}
        <div className="mb-6">
          <div className="font-bold text-xl mb-2">我的 BlogeBook</div>
          <div className="flex gap-4 mb-3">
            {blogeBooks.map(book => (
              <Link href={`/blogebook/${book.id}`} key={book.id} className="block">
                <img src={book.cover} alt={book.title} className="w-28 h-28 rounded-lg object-cover" />
                <div className="text-center mt-1">{book.title}</div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <div className="font-bold text-xl mb-2">我的 WonderLand 作品</div>
          <div className="flex gap-4 mb-3">
            {wonderLands.map(item => (
              <Link href={`/wonderland/${item.id}`} key={item.id} className="block">
                <img src={item.cover} alt={item.title} className="w-28 h-28 rounded-lg object-cover" />
                <div className="text-center mt-1">{item.title}</div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <div className="font-bold text-xl mb-2">已收藏作品</div>
          <div className="flex gap-4 mb-3">
            {collectedWorks.map(item => (
              <Link href={`/blogebook/${item.id}`} key={item.id} className="block">
                <img src={item.cover} alt={item.title} className="w-28 h-28 rounded-lg object-cover" />
                <div className="text-center mt-1">{item.title}</div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <div className="font-bold text-xl mb-2">擁有的我的貼圖</div>
          <div className="flex gap-4 mb-3">
            {myStickers.map(item => (
              <Link href="#" key={item.id} className="block">
                <img src={item.cover} alt={item.name} className="w-28 h-28 rounded-lg object-cover" />
                <div className="text-center mt-1">{item.name}</div>
              </Link>
            ))}
          </div>
        </div>
        {/* 右側漢堡式選單 */}
        <button
          className="fixed top-7 right-6 z-50 md:hidden bg-[#17233a] p-3 rounded-full shadow-lg"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="打開設定選單"
        >
          <span className="block w-7 h-1 bg-white mb-1 rounded-full"></span>
          <span className="block w-7 h-1 bg-white mb-1 rounded-full"></span>
          <span className="block w-7 h-1 bg-white rounded-full"></span>
        </button>
        {(menuOpen || typeof window === "undefined") && (
          <div className="fixed inset-0 bg-[#17233add] z-40 flex justify-end">
            <div className="w-64 h-full bg-[#17233a] py-10 px-6 flex flex-col gap-5">
              <Link href="/profile/income" className="hover:text-[#FFD700] text-lg">收益中心</Link>
              <Link href="/profile/orders" className="hover:text-[#FFD700] text-lg">過去訂單</Link>
              <Link href="/profile/verify" className="hover:text-[#FFD700] text-lg">申請原創認證</Link>
              <Link href="/faq" className="hover:text-[#FFD700] text-lg">FAQ</Link>
              <Link href="/contact" className="hover:text-[#FFD700] text-lg">聯絡我們</Link>
              <Link href="/terms" className="hover:text-[#FFD700] text-lg">服務條款</Link>
              <Link href="/privacy" className="hover:text-[#FFD700] text-lg">隱私政策</Link>
              <Link href="/profile/security" className="hover:text-[#FFD700] text-lg">帳號安全設定</Link>
              <Link href="/profile/settings" className="hover:text-[#FFD700] text-lg">其他設定</Link>
              <Link href="/logout" className="text-red-500 font-bold text-lg mt-6">登出</Link>
              <button
                className="mt-8 text-sm text-gray-400"
                onClick={() => setMenuOpen(false)}
              >
                關閉選單
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
