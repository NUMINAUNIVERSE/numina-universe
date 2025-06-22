import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiHelpCircle } from "react-icons/fi";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#0d1827] text-white font-sans flex flex-col">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-10 pb-20 px-4 w-full">
        <div className="flex items-center mb-7">
          <FiHelpCircle size={32} className="text-[#FFD700] mr-3" />
          <span className="text-3xl font-extrabold text-[#FFD700] tracking-wide">常見問題 FAQ</span>
        </div>
        <div className="bg-[#161e2d] rounded-2xl p-8 shadow-xl border border-[#FFD700]/30 flex flex-col gap-8">
          <div>
            <div className="text-lg font-bold text-[#FFD700] mb-1">Q：NUMINA UNIVERSE 是什麼？</div>
            <div>NUMINA UNIVERSE 是一個結合 AI 與神性宇宙美學的創作社群平台，提供圖文、電子書、漫畫、插畫、貼圖等多元數位內容創作與變現通路。</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#FFD700] mb-1">Q：如何成為創作者？</div>
            <div>註冊帳號後即可開始創作內容，若需獲得原創認證（藍勾勾），請前往「會員中心」申請。</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#FFD700] mb-1">Q：平台如何保護著作權？</div>
            <div>所有內容皆由創作者本人上傳並保有產權，平台僅協助數位資產標記與認證，禁止未經授權的轉載與下載。</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#FFD700] mb-1">Q：有哪些獲利方式？</div>
            <div>包含訂閱、單篇購買、貼圖包販售、打賞與收益分潤。每位創作者可於作品頁自訂收費方式。</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#FFD700] mb-1">Q：有問題要如何聯繫？</div>
            <div>請前往 <span className="text-[#FFD700] font-bold">「聯絡我們」</span> 頁填寫表單，或來信 support@numinauniverse.com，客服將儘速協助。</div>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`
        .font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }
      `}</style>
    </div>
  );
}
