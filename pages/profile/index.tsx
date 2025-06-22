import React, { useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiMenu, FiX, FiUpload } from "react-icons/fi";

// 假資料
const profile = {
  cover: "/cover-demo.jpg",
  avatar: "/avatar-demo.png",
  name: "創作者男神",
  isCertified: true,
  bio: "以AI與人性打造新文明，分享知識、圖文、插畫與數位資產。",
  fans: 1680,
  following: 72
};

const works = {
  blogebooks: [
    { id: 1, cover: "/blog1.jpg", title: "宇宙智慧手冊", desc: "AI世代原力全集" },
    { id: 2, cover: "/blog2.jpg", title: "未來文明思維", desc: "創作者都該看的趨勢" }
  ],
  wonderlands: [
    { id: 1, cover: "/illust1.jpg", title: "星際少女", desc: "角色設計插畫" },
    { id: 2, cover: "/illust2.jpg", title: "數位貼圖包", desc: "Q版宇宙表情" }
  ],
  favorites: [
    { id: 3, cover: "/blog3.jpg", title: "神性文明", desc: "共創人類未來" }
  ],
  stickers: [
    { id: 1, img: "/sticker1.png", title: "金色微笑" },
    { id: 2, img: "/sticker2.png", title: "未來人打氣" }
  ]
};

// 已移除通知中心
const hamburgerMenu = [
  { label: "過去訂單", link: "/profile/orders" },
  { label: "收益中心", link: "/profile/income" },
  { label: "申請原創認證", link: "/profile/certify" },
  { label: "FAQ", link: "/faq" },
  { label: "聯絡我們", link: "/contact" },
  { label: "服務條款", link: "/terms" },
  { label: "隱私政策", link: "/privacy" },
  { label: "帳號安全設定", link: "/profile/security" },
  { label: "其他設定", link: "/profile/settings" },
  { label: "登出", link: "/logout" }
];

const tabList = [
  { label: "我的 BlogeBook", key: "blogebooks" },
  { label: "我的 WonderLand", key: "wonderlands" },
  { label: "已收藏作品", key: "favorites" },
  { label: "我的貼圖", key: "stickers" }
];

export default function ProfilePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState<"blogebooks" | "wonderlands" | "favorites" | "stickers">("blogebooks");
  const [cover, setCover] = useState(profile.cover);
  const [uploading, setUploading] = useState(false);
  const coverInput = useRef<HTMLInputElement | null>(null);

  // 處理封面上傳（可串API）
  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCover(ev.target?.result as string);
      setUploading(false);
    };
    reader.readAsDataURL(file);
    // 之後這邊可呼叫 API 上傳
  }

  return (
    <div className="min-h-screen bg-[#0d1827] text-white font-sans flex flex-col">
      <Navbar />
      {/* 漢堡按鈕 */}
      <button
        className="fixed right-7 top-5 z-50 p-2 bg-[#151b2c] rounded-lg border-2 border-[#FFD700] hover:bg-[#FFD700] hover:text-[#151b2c] transition"
        onClick={() => setMenuOpen((o) => !o)}
      >
        {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
      </button>
      {/* 側邊選單 */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#161e2d] shadow-2xl p-7 z-40 transition-transform duration-200 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {hamburgerMenu.map((m) => (
          <a
            key={m.label}
            href={m.link}
            className={`block text-lg font-bold rounded px-3 py-2 text-[#FFD700] hover:underline`}
            onClick={() => setMenuOpen(false)}
          >
            {m.label}
          </a>
        ))}
      </div>
      {/* 頁面主體 */}
      <div className="w-full max-w-5xl mx-auto px-4 pt-7 pb-12">
        {/* 封面 + 編輯 */}
        <div className="relative rounded-2xl overflow-hidden h-44 md:h-64 bg-gradient-to-r from-[#203264] to-[#10131c] flex items-center justify-center">
          <img src={cover} alt="封面圖" className="absolute w-full h-full object-cover object-center" />
          <div className="absolute right-6 bottom-5 z-10">
            <button
              className="flex items-center px-4 py-2 rounded-full bg-[#FFD700] text-[#141926] font-bold shadow hover:scale-105"
              onClick={() => coverInput.current?.click()}
              style={{ whiteSpace: "nowrap", fontSize: "17px", fontWeight: 700 }}
            >
              <FiUpload className="mr-2" /> 編輯封面圖片
            </button>
            <input
              type="file"
              accept="image/*"
              ref={coverInput}
              style={{ display: "none" }}
              onChange={handleCoverChange}
            />
            {uploading && <span className="ml-3 text-xs text-[#FFD700] animate-pulse">上傳中...</span>}
          </div>
        </div>
        {/* 頭貼與基本資訊 */}
        <div className="relative flex items-end mt-[-52px] md:mt-[-70px] ml-4 md:ml-10">
          <img
            src={profile.avatar}
            alt="頭像"
            className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-[#FFD700] bg-white object-cover"
          />
          <div className="ml-7 mb-2">
            <div className="flex items-center space-x-3">
              <span className="font-extrabold text-3xl md:text-4xl tracking-wide text-[#FFD700] drop-shadow">{profile.name}</span>
              {profile.isCertified && (
                <span className="bg-[#101d2d] border-2 border-[#FFD700] px-3 py-1 rounded-lg text-sm text-[#FFD700] font-bold">原創認證</span>
              )}
              <button
                className="ml-4 px-4 py-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#fff3b0] text-[#1a2436] text-base font-bold shadow hover:scale-105 transition-all"
                style={{ whiteSpace: "nowrap" }}
              >
                編輯主頁
              </button>
            </div>
            <div className="flex space-x-7 mt-1 text-base text-gray-300 font-medium">
              <span>粉絲 <span className="text-[#FFD700]">{profile.fans}</span></span>
              <span>追蹤中 <span className="text-[#FFD700]">{profile.following}</span></span>
            </div>
            <div className="text-gray-100 mt-2 max-w-xl text-base">{profile.bio}</div>
          </div>
        </div>
        {/* Tab 區塊 */}
        <div className="flex space-x-4 mt-10 mb-2">
          {tabList.map((t) => (
            <button
              key={t.key}
              className={`px-5 py-2 font-bold rounded-t-xl shadow text-lg transition ${
                tab === t.key
                  ? "bg-[#FFD700] text-[#1a2436]"
                  : "bg-[#1a2436] text-[#FFD700]"
              }`}
              onClick={() => setTab(t.key as "blogebooks" | "wonderlands" | "favorites" | "stickers")}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* 卡片內容 */}
        <div className="pb-8">
          {tab === "blogebooks" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {works.blogebooks.map((item) => (
                <div key={item.id} className="bg-[#16213c] rounded-xl shadow-lg border-2 border-[#FFD700]/30 p-5 flex flex-col">
                  <img src={item.cover} alt={item.title} className="rounded-xl mb-3 object-cover w-full h-48" />
                  <div className="text-[#FFD700] font-bold text-xl mb-1">{item.title}</div>
                  <div className="text-gray-100">{item.desc}</div>
                </div>
              ))}
            </div>
          )}
          {tab === "wonderlands" && (
            <div className="grid grid-cols-2 gap-6">
              {works.wonderlands.map((item) => (
                <div key={item.id} className="bg-[#16213c] rounded-xl shadow-lg border-2 border-[#FFD700]/30 p-5 flex flex-col">
                  <img src={item.cover} alt={item.title} className="rounded-xl mb-3 object-cover w-full h-48" />
                  <div className="text-[#FFD700] font-bold text-xl mb-1">{item.title}</div>
                  <div className="text-gray-100">{item.desc}</div>
                </div>
              ))}
            </div>
          )}
          {tab === "favorites" && (
            <div className="grid grid-cols-2 gap-6">
              {works.favorites.map((item) => (
                <div key={item.id} className="bg-[#16213c] rounded-xl shadow-lg border-2 border-[#FFD700]/30 p-5 flex flex-col">
                  <img src={item.cover} alt={item.title} className="rounded-xl mb-3 object-cover w-full h-48" />
                  <div className="text-[#FFD700] font-bold text-xl mb-1">{item.title}</div>
                  <div className="text-gray-100">{item.desc}</div>
                </div>
              ))}
            </div>
          )}
          {tab === "stickers" && (
            <div className="flex flex-wrap gap-7 mt-5">
              {works.stickers.map((item) => (
                <div key={item.id} className="flex flex-col items-center bg-[#212d4c] rounded-xl p-4 w-28 shadow">
                  <img src={item.img} alt={item.title} className="rounded-lg mb-2 w-16 h-16 object-contain bg-[#0d1827]" />
                  <div className="text-[#FFD700] text-sm">{item.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <style>{`
        .font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }
        @media (max-width: 768px) {
          .fixed.right-0.top-0.h-full.w-60 {
            width: 85vw;
          }
        }
      `}</style>
    </div>
  );
}
