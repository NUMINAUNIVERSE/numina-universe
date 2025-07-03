import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { FiImage, FiMusic, FiSmile } from "react-icons/fi";
import { supabase } from "@/lib/supabaseClient";

interface DMMessage {
  id: string;
  room_id: string;
  sender_id: string;
  sender_name?: string;
  type: "text" | "image" | "sticker";
  content: string; // 文字內容或圖片/貼圖網址
  created_at: string;
}

export default function PrivateChatRoom() {
  const router = useRouter();
  const { id: roomId } = router.query;
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<DMMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 這裡建議根據你登入系統取得當前 user
  // 假設你有 useUser() hook 或其它方式
  const userId = typeof window !== "undefined" ? window.localStorage.getItem("user_id") || "" : "";
  const userName = typeof window !== "undefined" ? window.localStorage.getItem("user_name") || "我" : "我";

  // 取得聊天室訊息
  useEffect(() => {
    if (!roomId) return;
    setLoading(true);
    supabase
      .from("dm_messages")
      .select("id, room_id, sender_id, type, content, created_at")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true })
      .then(async ({ data, error }) => {
        if (!error && data) {
          // 可以進一步查詢 sender 的暱稱資料（這邊簡化）
          setMessages(data as DMMessage[]);
        }
        setLoading(false);
        setTimeout(() => {
          chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      });
    // 可再加上Realtime (subscription)自動刷新
  }, [roomId]);

  // 發送訊息
  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!msg.trim() || !roomId || !userId) return;
    const insertMsg = {
      room_id: roomId,
      sender_id: userId,
      type: "text",
      content: msg.trim(),
    };
    const { data, error } = await supabase.from("dm_messages").insert([insertMsg]).select();
    if (!error && data && data.length > 0) {
      setMessages(prev => [...prev, { ...data[0], sender_name: userName }]);
      setMsg("");
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 w-full flex flex-col">
        <div className="font-bold text-2xl mb-3 text-[#FFD700]">私人對話</div>
        <div className="flex-1 min-h-[400px] bg-[#222d44] rounded-xl p-5 overflow-y-auto flex flex-col gap-4">
          {loading && <div className="text-center text-gray-400">載入中…</div>}
          {messages.map((m, i) => (
            <div key={m.id || i} className={`flex ${m.sender_id === userId ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${m.sender_id === userId
                ? "bg-[#FFD700] text-[#0d1827] ml-16"
                : "bg-[#292f45] text-white mr-16"} shadow`}>
                {m.type === "text" && <span>{m.content}</span>}
                {m.type === "image" && m.content && <img src={m.content} alt="img" className="rounded-lg max-w-[180px]" />}
                {m.type === "sticker" && m.content && <img src={m.content} alt="sticker" className="w-14 h-14" />}
                <div className="text-xs mt-2 opacity-70">{m.sender_id === userId ? userName : (m.sender_name || "對方")}・{m.created_at.slice(11, 16)}</div>
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
