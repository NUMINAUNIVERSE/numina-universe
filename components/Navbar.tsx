import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    let mounted = true;

    // 初始化偵測登入狀態
    supabase.auth
      .getUser()
      .then(async ({ data }) => {
        if (!mounted) return;
        setUser(data?.user || null);
        console.log('Navbar user', data?.user || null); // <-- 這裡追蹤 user

        if (data?.user) {
          const { data: userData } = await supabase
            .from("users")
            .select("role")
            .eq("id", data.user.id)
            .single();
          setIsAdmin(userData?.role === "admin");
        } else {
          setIsAdmin(false);
        }
        setIsLoadingUser(false);
      })
      .catch(() => setIsLoadingUser(false));

    // 監聽登入/登出狀態改變
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        setUser(session?.user ?? null);
        console.log('Navbar user', session?.user ?? null); // <-- 這裡追蹤 user

        if (session?.user) {
          const { data: userData } = await supabase
            .from("users")
            .select("role")
            .eq("id", session.user.id)
            .single();
          setIsAdmin(userData?.role === "admin");
        } else {
          setIsAdmin(false);
        }
        setIsLoadingUser(false);
      }
    );
    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

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
