import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";

// 假資料，請換成API串接
const work = {
  id: "w2",
  type: "漫畫",
  title: "冒險序曲",
  imgs: ["/img/w2a.jpg", "/img/w2b.jpg", "/img/w2c.jpg"],
  author: { name: "小圓", verified: true, desc: "資深漫畫家，專長少年奇幻冒險。" },
  desc: "少年與神獸的星際冒險正式展開——感動與友情兼備的奇幻故事！",
  like: 201, collect: 52, share: 15, isSticker: false
};
const comments = [
  { id: 1, user: "Mina", text: "超可愛主角！", time: "3小時前" },
  { id: 2, user: "阿松", text: "畫風很吸引人～", time: "1天前" }
];

export default function WonderWorkPage() {
  const router = useRouter();
  const [imgIdx, setImgIdx] = useState(0);
  const [fav, setFav] = useState(false);
  const [like, setLike] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const [commentList, setCommentList] = useState(comments);
  const [commentVal, setCommentVal] = useState("");

  const nextImg = () => setImgIdx(i => (i + 1) % work.imgs.length);
  const prevImg = () => setImgIdx(i => (i - 1 + work.imgs.length) % work.imgs.length);

  const submitComment = () => {
    if (!commentVal.trim()) return;
    setCommentList(list => [
      { id: Date.now(), user: "你", text: commentVal, time: "剛剛" },
      ...list
    ]);
    setCommentVal("");
  };

  return (
    <div className="min-h-screen bg-[#0d1a2d] text-white flex flex-col">
      <Navbar />
      <div className="max-w-3xl w-full mx-auto flex-1 py-8 px-2 sm:px-4">
        <div className="flex items-center gap-3 mb-3">
          <button className="text-[#ffd700] text-2xl font-bold" onClick={() => router.push("/wonderland")}>
            &lt;
          </button>
          <span className="text-xl font-bold">回WonderLand</span>
        </div>
        {/* 標題 */}
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold tracking-wide">{work.title}</h1>
          <span className="text-[#ffd700] border border-[#ffd700] text-xs rounded px-1">{work.type}</span>
        </div>
        {/* 作者/訂閱 */}
        <div className="flex gap-2 items-center text-base font-bold mb-3">
          <span>{work.author.name}</span>
          {work.author.verified && (
            <span title="原創認證" className="ml-1 text-[#4dd0e1] bg-[#0d1a2d] border border-[#4dd0e1] px-1.5 py-0.5 text-xs rounded-full font-bold">✔</span>
          )}
          <button className="ml-2 px-3 py-1 bg-[#ffd700] rounded-lg text-[#181f32] text-xs font-bold hover:bg-[#fffde4]">訂閱</button>
          <button className="ml-2 px-3 py-1 bg-[#ff5aac] rounded-lg text-white text-xs font-bold hover:bg-[#ffaddc]" onClick={() => setShowDonate(true)}>打賞</button>
          <button className="ml-2 px-3 py-1 border border-[#4dd0e1] rounded-lg text-[#4dd0e1] text-xs font-bold hover:bg-[#133649] hover:text-white"
            onClick={() => setShowReport(true)}
          >檢舉</button>
        </div>
        {/* 作品說明 */}
        <div className="text-lg text-[#fffbdc] mb-5">{work.desc}</div>
        {/* 封面區（多圖橫滑） */}
        <div className="relative w-full h-72 bg-[#181f32] rounded-lg mb-3 flex items-center justify-center overflow-hidden">
          <img src={work.imgs[imgIdx]} alt="" className="object-contain max-h-72 mx-auto rounded-lg transition-all duration-200" />
          {work.imgs.length > 1 && (
            <>
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#ffd700cc] rounded-full text-[#181f32] font-bold shadow-lg opacity-80 hover:scale-110"
                onClick={prevImg}
                title="上一張"
              >{"<"}</button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#ffd700cc] rounded-full text-[#181f32] font-bold shadow-lg opacity-80 hover:scale-110"
                onClick={nextImg}
                title="下一張"
              >{">"}</button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {work.imgs.map((img, idx) =>
                  <div key={idx}
                    className={`h-2 rounded-full ${idx === imgIdx ? "w-8 bg-[#ffd700]" : "w-2 bg-[#ffd70055]"}`} />
                )}
              </div>
            </>
          )}
        </div>
        {/* 互動功能 */}
        <div className="flex gap-4 mt-2 mb-3">
          <button className={`flex items-center gap-1 text-[#ffd700] font-bold hover:scale-110 ${like ? "opacity-80" : ""}`}
            onClick={() => setLike(l=>!l)}>
            <span>👍</span><span>讚</span>
          </button>
          <button className={`flex items-center gap-1 text-[#ff5aac] font-bold hover:scale-110 ${fav ? "opacity-80" : ""}`}
            onClick={() => setFav(f=>!f)}>
            <span>★</span><span>收藏</span>
          </button>
          <button className="flex items-center gap-1 text-[#61dafb] font-bold hover:scale-110"
            onClick={()=>navigator.share && navigator.share({title:work.title, url:window.location.href})}>
            <span>🔗</span><span>分享</span>
          </button>
          <span className="flex items-center gap-1 text-[#fffbdc]"><span>💬</span><span>{commentList.length} 則留言</span></span>
        </div>
        {/* 作者簡介 */}
        <div className="text-[#97b0cf] text-sm mb-7">作者介紹：{work.author.desc}</div>
        {/* 留言區 */}
        <div className="bg-[#181f32] rounded-xl p-4 mb-16">
          <div className="font-bold mb-2">留言討論區</div>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={commentVal}
              onChange={e=>setCommentVal(e.target.value)}
              className="flex-1 rounded px-3 py-1 text-white bg-[#181f32] border border-[#ffd70044] placeholder-[#ffd70099]"
              placeholder="發表留言…"
            />
            <button onClick={submitComment}
              className="px-4 py-1 bg-[#ffd700] rounded-lg text-[#181f32] font-bold hover:bg-[#fffde4]">送出</button>
          </div>
          <div className="flex flex-col gap-3">
            {commentList.map(c => (
              <div key={c.id} className="flex items-center gap-2 text-[#fffbdc]">
                <span className="font-bold">{c.user}：</span>
                <span>{c.text}</span>
                <span className="text-xs opacity-60 ml-auto">{c.time}</span>
              </div>
            ))}
          </div>
        </div>
        {/* 檢舉彈窗 */}
        {showReport && (
          <div className="fixed inset-0 flex items-center justify-center bg-[#000a] z-50">
            <div className="bg-[#182544] rounded-xl p-8 max-w-xs w-full">
              <div className="font-bold text-lg mb-4 text-[#ffd700]">檢舉作品</div>
              <div className="mb-4 text-sm">說明原因：</div>
              <textarea className="w-full h-24 rounded p-2 mb-4 text-black" placeholder="請簡要說明問題…" />
              <div className="flex gap-2">
                <button className="flex-1 bg-[#ffd700] rounded py-1 font-bold text-[#181f32]" onClick={()=>setShowReport(false)}>送出</button>
                <button className="flex-1 border border-[#ffd700] rounded py-1 text-[#ffd700]" onClick={()=>setShowReport(false)}>取消</button>
              </div>
            </div>
          </div>
        )}
        {/* 打賞彈窗 */}
        {showDonate && (
          <div className="fixed inset-0 flex items-center justify-center bg-[#000a] z-50">
            <div className="bg-[#182544] rounded-xl p-8 max-w-xs w-full">
              <div className="font-bold text-lg mb-4 text-[#ffd700]">打賞創作者</div>
              <div className="mb-4 text-sm">選擇金額：</div>
              <div className="flex gap-2 mb-4">
                <button className="flex-1 bg-[#ffd700] rounded py-1 font-bold text-[#181f32]">NT$30</button>
                <button className="flex-1 bg-[#ffd700] rounded py-1 font-bold text-[#181f32]">NT$99</button>
                <button className="flex-1 bg-[#ffd700] rounded py-1 font-bold text-[#181f32]">自訂</button>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-[#ffd700] rounded py-1 font-bold text-[#181f32]" onClick={()=>setShowDonate(false)}>送出</button>
                <button className="flex-1 border border-[#ffd700] rounded py-1 text-[#ffd700]" onClick={()=>setShowDonate(false)}>取消</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

