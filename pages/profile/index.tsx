import React, { useRef, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiMenu, FiX, FiUpload } from "react-icons/fi";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import Link from "next/link";

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

type UserProfile = {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  is_certified: boolean;
  fans_count: number;
  following_count: number;
};

type Work = {
  id: string;
  cover: string;
  title: string;
  desc: string;
  type: string; // 新增 type，用於連結
};

type Sticker = {
  id: string;
  img: string;
  title: string;
};

type FavoriteRow = {
  work_id: string;
  works: {
    id: string;
    cover: string;
    title: string;
    desc: string;
    type?: string;
  }[]; // array!
};

export default function ProfilePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState<"blogebooks" | "wonderlands" | "favorites" | "stickers">("blogebooks");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [blogebooks, setBlogebooks] = useState<Work[]>([]);
  const [wonderlands, setWonderlands] = useState<Work[]>([]);
  const [favorites, setFavorites] = useState<Work[]>([]);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [cover, setCover] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const coverInput = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  function getWorkLink(item: Work) {
    if (item.type === "blogebook") return `/blogebook/${item.id}`;
    if (item.type === "wonderland") return `/wonderland/${item.id}`;
    return "#";
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) {
        setProfile({
          id: data.id,
          name: data.name || "",
          username: data.username || "",
          bio: data.bio || "",
          avatar_url: data.avatar_url || "/avatar-demo.png",
          cover_url: data.cover_url || "/cover-demo.jpg",
          is_certified: !!(data.is_verified || data.is_certified),
          fans_count: data.fans_count || 0,
          following_count: data.following_count || 0
        });
        setCover(data.cover_url || "/cover-demo.jpg");
      }
    };
    fetchProfile();
  }, [router]);

  useEffect(() => {
    const fetchWorks = async () => {
      if (!profile) return;
      // BlogeBook
      const { data: blogs } = await supabase
        .from("works")
        .select("id, cover, title, desc, type")
        .eq("author_id", profile.id)
        .eq("type", "blogebook")
        .order("created_at", { ascending: false });
      setBlogebooks(Array.isArray(blogs) ? blogs.map(b => ({
        id: b.id || "",
        cover: b.cover || "/cover-demo.jpg",
        title: b.title || "",
        desc: b.desc || "",
        type: "blogebook"
      })) : []);

      // WonderLand
      const { data: wonders } = await supabase
        .from("works")
        .select("id, cover, title, desc, type")
        .eq("author_id", profile.id)
        .eq("type", "wonderland")
        .order("created_at", { ascending: false });
      setWonderlands(Array.isArray(wonders) ? wonders.map(w => ({
        id: w.id || "",
        cover: w.cover || "/cover-demo.jpg",
        title: w.title || "",
        desc: w.desc || "",
        type: "wonderland"
      })) : []);

// 收藏
const { data: favs } = await supabase
  .from("favorites")
  .select("work_id, works(id, cover, title, desc, type)")
  .eq("user_id", profile.id)
  .order("created_at", { ascending: false });

const favoriteWorks: Work[] = Array.isArray(favs)
  ? favs
      .map((f: FavoriteRow) =>
        Array.isArray(f.works) && f.works[0]
          ? {
              id: f.works[0].id || "",
              cover: f.works[0].cover || "/cover-demo.jpg",
              title: f.works[0].title || "",
              desc: f.works[0].desc || "",
              type: f.works[0].type || "blogebook",
            }
          : undefined // 直接 undefined
      )
      .filter((w): w is Work => !!w)
  : [];
setFavorites(favoriteWorks);

      // 貼圖
      const { data: stickersData } = await supabase
        .from("stickers")
        .select("id, img, title")
        .eq("user_id", profile.id);
      setStickers(
        Array.isArray(stickersData)
          ? stickersData.map(s => ({
              id: s.id || "",
              img: s.img || "/cover-demo.jpg",
              title: s.title || ""
            }))
          : []
      );
    };
    if (profile) fetchWorks();
  }, [profile]);

  // 處理封面上傳
  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0] || !profile) return;
    const file = e.target.files[0];
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCover(ev.target?.result as string);
    };
    reader.readAsDataURL(file);

    const fileExt = file.name.split('.').pop();
    const filePath = `cover/${profile.id}_${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("user-covers")
      .upload(filePath, file, { upsert: true });
    if (!uploadError) {
      const { data } = supabase.storage.from("user-covers").getPublicUrl(filePath);
      await supabase.from("users").update({ cover_url: data.publicUrl }).eq("id", profile.id);
      setCover(data.publicUrl);
    }
    setUploading(false);
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1827] text-white text-2xl">
        讀取中...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1827] text-white font-sans flex flex-col">
      <Navbar />
      <button
        className="fixed right-7 top-5 z-50 p-2 bg-[#151b2c] rounded-lg border-2 border-[#FFD700] hover:bg-[#FFD700] hover:text-[#151b2c] transition"
        onClick={() => setMenuOpen((o) => !o)}
      >
        {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
      </button>
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
      <div className="w-full max-w-5xl mx-auto px-4 pt-7 pb-12">
        <div className="relative rounded-2xl overflow-hidden h-44 md:h-64 bg-gradient-to-r from-[#203264] to-[#10131c] flex items-center justify-center">
          <img src={cover || "/cover-demo.jpg"} alt="封面圖" className="absolute w-full h-full object-cover object-center" />
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
        <div className="relative flex items-end mt-[-52px] md:mt-[-70px] ml-4 md:ml-10">
          <img
            src={profile.avatar_url || "/avatar-demo.png"}
            alt="頭像"
            className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-[#FFD700] bg-white object-cover"
          />
          <div className="ml-7 mb-2">
            <div className="flex items-center space-x-3">
              <span className="font-extrabold text-3xl md:text-4xl tracking-wide text-[#FFD700] drop-shadow">{profile.name}</span>
              {profile.is_certified && (
                <span className="bg-[#101d2d] border-2 border-[#FFD700] px-3 py-1 rounded-lg text-sm text-[#FFD700] font-bold">原創認證</span>
              )}
              <button
                className="ml-4 px-4 py-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#fff3b0] text-[#1a2436] text-base font-bold shadow hover:scale-105 transition-all"
                style={{ whiteSpace: "nowrap" }}
                onClick={() => router.push("/profile/settings")}
              >
                編輯主頁
              </button>
            </div>
            <div className="flex space-x-7 mt-1 text-base text-gray-300 font-medium">
              <span>粉絲 <span className="text-[#FFD700]">{profile.fans_count}</span></span>
              <span>追蹤中 <span className="text-[#FFD700]">{profile.following_count}</span></span>
            </div>
            <div className="text-gray-100 mt-2 max-w-xl text-base">{profile.bio || "這位創作者還沒有填寫簡介。"}</div>
          </div>
        </div>
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
        <div className="pb-8">
          {tab === "blogebooks" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogebooks.length === 0 && <div className="text-gray-400">暫無作品</div>}
              {blogebooks.map((item) => (
                <Link key={item.id} href={getWorkLink(item)}>
                  <div className="bg-[#16213c] rounded-xl shadow-lg border-2 border-[#FFD700]/30 p-5 flex flex-col cursor-pointer hover:scale-105 transition">
                    <img src={item.cover} alt={item.title} className="rounded-xl mb-3 object-cover w-full h-48" />
                    <div className="text-[#FFD700] font-bold text-xl mb-1">{item.title}</div>
                    <div className="text-gray-100">{item.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {tab === "wonderlands" && (
            <div className="grid grid-cols-2 gap-6">
              {wonderlands.length === 0 && <div className="text-gray-400">暫無作品</div>}
              {wonderlands.map((item) => (
                <Link key={item.id} href={getWorkLink(item)}>
                  <div className="bg-[#16213c] rounded-xl shadow-lg border-2 border-[#FFD700]/30 p-5 flex flex-col cursor-pointer hover:scale-105 transition">
                    <img src={item.cover} alt={item.title} className="rounded-xl mb-3 object-cover w-full h-48" />
                    <div className="text-[#FFD700] font-bold text-xl mb-1">{item.title}</div>
                    <div className="text-gray-100">{item.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {tab === "favorites" && (
            <div className="grid grid-cols-2 gap-6">
              {favorites.length === 0 && <div className="text-gray-400">暫無收藏</div>}
              {favorites.map((item) => (
                <Link key={item.id} href={getWorkLink(item)}>
                  <div className="bg-[#16213c] rounded-xl shadow-lg border-2 border-[#FFD700]/30 p-5 flex flex-col cursor-pointer hover:scale-105 transition">
                    <img src={item.cover} alt={item.title} className="rounded-xl mb-3 object-cover w-full h-48" />
                    <div className="text-[#FFD700] font-bold text-xl mb-1">{item.title}</div>
                    <div className="text-gray-100">{item.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {tab === "stickers" && (
            <div className="flex flex-wrap gap-7 mt-5">
              {stickers.length === 0 && <div className="text-gray-400">尚未建立貼圖</div>}
              {stickers.map((item) => (
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
