import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useRef } from "react";
import { FiSend, FiImage, FiMusic, FiSmile } from "react-icons/fi";

export default function DMChatRoom() {
  const [msg, setMsg] = useState("");
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<string | null>(null);
  const [showSticker, setShowSticker] = useState(false);

  // 假資料：你跟 Julia 的對話
  const myName = "我";
  const targetUser = "Julia（插畫家）";
  const messages = [
    { sender: targetUser, type: "text", text: "男神您好，謝謝支持我的作品！", time: "13:21" },
    { sender: myName, type: "text", text: "你的插畫真的很讚👍", time: "13:22" },
    { sender: myName, type: "image", img: "/demo/illust1.jpg", time: "13:23" },
    { sender: targetUser, type: "sticker", sticker: "/demo/sticker2.png", time: "13:23" },
    { sender: myName, type: "audio", audio: "/demo/demo_audio.mp3", time: "13:24" }
  ];

  const chatEndRef = useRef<HTMLDivElement>(null);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    // 真正開發請送API，這裡重置輸入
    setMsg(""); setPreviewImg(null); setPreviewAudio(null); setShowSticker(false);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPreviewImg(url);
      setPreviewAudio(null);
    }
  }
  function handleAudioUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPreviewAudio(url);
      setPreviewImg(null);
    }
  }
  function handleSelectSticker(url: string) {
    setShowSticker(false);
    setPreviewImg(null); setPreviewAudio(null);
    // 可以發送貼圖
  }

  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 w-full flex flex-col">
        <div className="font-bold text-2xl mb-3 text-[#FFD700]">{targetUser}</div>
        <div className="flex-1 min-h-[400px] bg-[#222d44] rounded-xl p-5 overflow-y-auto flex flex-col gap-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === myName ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${m.sender === myName
                ? "bg-[#FFD700] text-[#0d1827] ml-16" : "bg-[#292f45] text-white mr-16"} shadow`}>
                {m.type === "text" && <span>{m.text}</span>}
                {m.type === "image" && m.img && (
                  <img src={m.img} alt="img" className="rounded-lg max-w-[180px]" />
                )}
                {m.type === "audio" && m.audio && (
                  <audio controls src={m.audio} className="mt-2 w-full" />
                )}
                {m.type === "sticker" && m.sticker && (
                  <img src={m.sticker} alt="sticker" className="w-14 h-14" />
                )}
                <div className="text-xs mt-2 opacity-70">{m.sender}・{m.time}</div>
              </div>
            </div>
          ))}
          {/* 預覽上傳中的檔案 */}
          {(previewImg || previewAudio) && (
            <div className="flex justify-end">
              <div className="max-w-[70%] px-4 py-2 rounded-2xl bg-[#FFD700] text-[#0d1827] ml-16 shadow flex flex-col items-end">
                {previewImg && <img src={previewImg} alt="預覽圖片" className="rounded-lg max-w-[180px]" />}
                {previewAudio && <audio controls src={previewAudio} className="mt-2 w-full" />}
                <span className="text-xs mt-2 opacity-70">{myName}・預覽</span>
              </div>
            </div>
          )}
          {showSticker && (
            <div className="flex justify-end">
              <div className="max-w-[70%] px-4 py-2 rounded-2xl bg-[#FFD700] text-[#0d1827] ml-16 shadow flex flex-wrap gap-3">
                <span className="font-bold mb-2">選擇貼圖：</span>
                {/* 貼圖池可串WonderLand貼圖API */}
                <img src="/demo/sticker1.png" alt="貼圖1" className="w-12 h-12 cursor-pointer" onClick={() => handleSelectSticker("/demo/sticker1.png")} />
                <img src="/demo/sticker2.png" alt="貼圖2" className="w-12 h-12 cursor-pointer" onClick={() => handleSelectSticker("/demo/sticker2.png")} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <form className="flex items-center gap-2 mt-5" onSubmit={handleSend}>
          <label className="text-[#FFD700] cursor-pointer"><FiImage size={24} />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          <label className="text-[#FFD700] cursor-pointer"><FiMusic size={24} />
            <input type="file" accept="audio/*" className="hidden" onChange={handleAudioUpload} />
          </label>
          <button type="button" className="text-[#FFD700]" onClick={() => setShowSticker(v => !v)}>
            <FiSmile size={24} />
          </button>
          <input
            className="flex-1 rounded-xl bg-[#222d44] text-white p-3 focus:outline-none"
            value={msg}
            onChange={e => setMsg(e.target.value)}
            placeholder="輸入訊息..."
          />
          <button type="submit" className="rounded-xl bg-[#FFD700] text-[#0d1827] font-bold px-5 py-2 ml-2 hover:bg-[#ffe366] transition">送出</button>
        </form>
      </div>
      <Footer />
      <style>{`
        .font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }
      `}</style>
    </div>
  );
}
