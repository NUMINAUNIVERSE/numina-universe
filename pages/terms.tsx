import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiFileText } from "react-icons/fi";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0d1827] text-white font-sans flex flex-col">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-10 pb-20 px-4 w-full">
        <div className="flex items-center mb-7">
          <FiFileText size={32} className="text-[#FFD700] mr-3" />
          <span className="text-3xl font-extrabold text-[#FFD700] tracking-wide">服務條款</span>
        </div>
        <div className="bg-[#161e2d] rounded-2xl p-8 shadow-xl border border-[#FFD700]/30 text-gray-300 leading-relaxed">
          <p>歡迎使用 NUMINA UNIVERSE 平台。您註冊並使用本服務，即表示您同意以下條款：</p>
          <ol className="list-decimal pl-6 mt-4 mb-2 space-y-2">
            <li>所有內容上傳者需確保擁有完整著作權，平台不負內容侵權責任。</li>
            <li>平台保有調整服務內容、收費及管理政策之權利，會於網站公告最新規範。</li>
            <li>用戶不得進行未經授權之轉載、下載、盜用等行為。</li>
            <li>如有違規行為，平台有權終止會員資格與內容曝光。</li>
            <li>如對條款內容有疑慮，歡迎隨時聯繫官方客服。</li>
          </ol>
          <div className="mt-4">詳細條款內容將因應法規與業務發展不定期修訂，請隨時關注官方公告。</div>
        </div>
      </div>
      <Footer />
      <style>{`
        .font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }
      `}</style>
    </div>
  );
}
