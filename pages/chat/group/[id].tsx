import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useRef } from "react";
import { FiImage, FiMusic, FiSmile } from "react-icons/fi";

export default function GroupChatRoom() {
  const [msg, setMsg] = useState("");
  const dummyUser = "我";
  const messages = [
    { sender: "Andy", text: "NUMINA衝起來！🔥", time: "09:15", type: "text" },
    { sender: dummyUser, text: "感謝支持～", time: "09:17", type: "text" },
    { sender: "Julia", text: "", img: "/demo/illust1.jpg", time: "09:18", type: "image" },
    { sender: dummyUser, text: "", sticker: "/demo/sticker1.png", time: "09:19", type: "sticker" }
  ];
  const chatEndRef = useRef<HTMLDivElement>(null);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
  }

  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 w-full flex flex-col">
        <div className="font-bold text-2xl mb-3 text-[#FFD700]">NUMINA 宇宙創作者群組</div>
        <div className="flex-1 min-h-[400px] bg-[#222d44] rounded-xl p-5 overflow-y-auto flex flex-col gap-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === dummyUser ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${m.sender === dummyUser
                ? "bg-[#FFD700] text-[#0d1827] ml-16" : "bg-[#292f45] text-white mr-16"} shadow`}>
                {m.type === "text" && <span>{m.text}</span>}
                {m.img && <img src={m.img} alt="img" className="rounded-lg max-w-[180px]" />}
                {m.sticker && <img src={m.sticker} alt="sticker" className="w-14 h-14" />}
                <div className="text-xs mt-2 opacity-70">{m.sender}・{m.time}</div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form className="flex items-center gap-2 mt-5" onSubmit={handleSend}>
          <button type="button" className="text-[#FFD700]"><FiImage size={24} /></button>
          <button type="button" className="text-[#FFD700]"><FiMusic size={24} /></button>
          <button type="button" className="text-[#FFD700]"><FiSmile size={24} /></button>
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
