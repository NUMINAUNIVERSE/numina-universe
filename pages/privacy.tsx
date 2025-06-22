import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiLock } from "react-icons/fi";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0d1827] text-white font-sans flex flex-col">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-10 pb-20 px-4 w-full">
        <div className="flex items-center mb-7">
          <FiLock size={32} className="text-[#FFD700] mr-3" />
          <span className="text-3xl font-extrabold text-[#FFD700] tracking-wide">隱私政策</span>
        </div>
        <div className="bg-[#161e2d] rounded-2xl p-8 shadow-xl border border-[#FFD700]/30 text-gray-300 leading-relaxed">
          <p>NUMINA UNIVERSE 尊重每位用戶的隱私權。我們僅在用戶註冊、創作、交易過程中收集必要個資，並以最高標準保護您的資料安全。</p>
          <ul className="list-disc pl-6 mt-4 mb-2 space-y-2">
            <li>平台不會將您的個資外洩或販售予第三方。</li>
            <li>所有內容與交易紀錄皆採用加密儲存，嚴格控管存取權限。</li>
            <li>您可隨時申請查詢、修改、刪除個人資訊。</li>
            <li>若有隱私相關問題，請來信 support@numinauniverse.com 將有專人協助。</li>
          </ul>
          <div className="mt-4">本政策將因應法規或服務優化定期更新，最新版本以官方公告為準。</div>
        </div>
      </div>
      <Footer />
      <style>{`
        .font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }
      `}</style>
    </div>
  );
}
