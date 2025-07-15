// /pages/logout.tsx

import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    async function doLogout() {
      await supabase.auth.signOut();
      // 這裡你可以選擇要導回首頁或登入頁
      router.replace("/login");
    }
    doLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-2xl text-[#FFD700] bg-[#0d1827]">
      登出中...
    </div>
  );
}
