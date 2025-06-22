import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d1827] text-white font-sans">
      <Navbar />
      <main className="max-w-3xl mx-auto flex-grow px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#FFD700] mb-6 tracking-wide">關於 NUMINA UNIVERSE</h1>
        <section className="mb-8">
          <p className="mb-4 text-lg">
            <b>NUMINA UNIVERSE</b> 是 AI 時代的「智慧原鄉」，我們相信每一位創作者的靈感、作品與故事都值得被看見、被尊重、被珍藏！
          </p>
          <p className="mb-4">
            我們以神性幾何、未來宇宙感為設計語彙，打造「全球創作社群＋數位資產平台」，讓文字、插畫、漫畫、貼圖、電子書、音樂都能化為智慧資產，永續流通。
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-2">品牌精神</h2>
          <ul className="list-disc pl-6 space-y-2 text-base">
            <li>以知識翻轉命運，共創公平未來</li>
            <li>用科技協助每位創作者擁有數位資產的產權</li>
            <li>推動智慧共享經濟，縮短貧富差距</li>
            <li>打造全球參與、公益回饋、無國界流通的平台</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-2">我們的故事</h2>
          <p>
            NUMINA 來自拉丁文，象徵「神性智慧」。<br />
            我們的創辦人深信：「未來每個人的靈感、故事、作品，都應該成為可以永續傳承的智慧財富！」<br />
            從 0 元起步，我們以夢想、信念、科技力量，串連全球創作者與知識追尋者，一起在 NUMINA UNIVERSE 留下屬於人類文明的新紀錄。
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-2">聯絡我們</h2>
          <p>
            若您有合作、建議或需要協助，歡迎來信：<br />
            <span className="text-[#FFD700] font-bold">hello@numinauniverse.com</span>
          </p>
        </section>
      </main>
      <Footer />
      <style>{`
        .font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }
      `}</style>
    </div>
  );
}
