import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
import { FiImage, FiMusic, FiSmile } from "react-icons/fi";

interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  type: "text" | "image" | "sticker";
  content: string;
  created_at: string;
  sender: {
    id: string;
    name: string;
    username: string;
    avatar_url?: string;
  } | null;
}

function formatTaiwanTime(utcString: string) {
  if (!utcString) return "";
  const date = new Date(utcString);
  // 轉台灣時間（+8）
  date.setHours(date.getHours() + 8);
  // hh:mm 格式
  return date.toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Taipei",
  });
}

export default function PrivateChatRoom() {
  const router = useRouter();
  const { id: roomId } = router.query;
  const user = useUser();
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 取得訊息並 join sender info
  useEffect(() => {
    if (!roomId) return;
    setLoading(true);
    supabase
      .from("chat_messages")
      .select(
        `
        id, room_id, sender_id, type, content, created_at,
        sender:users(id, name, username, avatar_url)
        `
      )
      .eq("room_id", roomId)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) {
          // sender 型別修正
          const normalized = data.map((m: unknown) => {
            const msg = m as ChatMessage & {
              sender: ChatMessage["sender"][] | ChatMessage["sender"];
            };
            return {
              ...msg,
              sender: Array.isArray(msg.sender) ? msg.sender[0] : msg.sender,
            };
          }) as ChatMessage[];
          setMessages(normalized);
        }
        setLoading(false);
        setTimeout(() => {
          chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      });
  }, [roomId]);

  // 即時監聽新訊息 (只由 Realtime 插入，不由 handleSend 補)
  useEffect(() => {
    if (!roomId) return;
    const channel = supabase
      .channel("chat_messages_room_" + roomId)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `room_id=eq.${roomId}` },
        async (payload) => {
          const m = payload.new;
          // 查 sender info
          const { data } = await supabase
            .from("users")
            .select("id, name, username, avatar_url")
            .eq("id", m.sender_id)
            .single();
          // 型別安全組裝，避免重複訊息
          setMessages((prev) => {
            if (prev.some((item) => item.id === m.id)) return prev;
            return [
              ...prev,
              {
                id: m.id,
                room_id: m.room_id,
                sender_id: m.sender_id,
                type: m.type,
                content: m.content,
                created_at: m.created_at,
                sender: data ?? null,
              },
            ];
          });
          setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 150);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // 發送訊息（不再自己 setMessages，讓 Realtime 自動補）
  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!msg.trim() || !roomId || !user) return;
    const insertMsg = {
      room_id: roomId as string,
      sender_id: user.id,
      type: "text",
      content: msg.trim(),
    };
    await supabase
      .from("chat_messages")
      .insert([insertMsg]);
    setMsg("");
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  }

  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 w-full flex flex-col">
        <div className="font-bold text-2xl mb-3 text-[#FFD700]">私人對話</div>
        <div className="flex-1 min-h-[400px] bg-[#222d44] rounded-xl p-5 overflow-y-auto flex flex-col gap-4">
          {loading && <div className="text-center text-gray-400">載入中…</div>}
          {messages.map((m, i) => (
            <div
              key={m.id || i}
              className={`flex ${m.sender_id === user?.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                  m.sender_id === user?.id
                    ? "bg-[#FFD700] text-[#0d1827] ml-16"
                    : "bg-[#292f45] text-white mr-16"
                } shadow`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {m.sender_id !== user?.id && (
                    <img
                      src={m.sender?.avatar_url || "/demo/author2.jpg"}
                      alt="頭像"
                      className="w-7 h-7 rounded-full"
                    />
                  )}
                  <span className="text-sm font-bold">
                    {m.sender_id === user?.id ? "我" : m.sender?.name || "對方"}
                  </span>
                </div>
                {m.type === "text" && <span>{m.content}</span>}
                {m.type === "image" && m.content && (
                  <img
                    src={m.content}
                    alt="img"
                    className="rounded-lg max-w-[180px] mt-1"
                  />
                )}
                {m.type === "sticker" && m.content && (
                  <img
                    src={m.content}
                    alt="sticker"
                    className="w-14 h-14 mt-1"
                  />
                )}
                <div className="text-xs mt-2 opacity-70">
                  {formatTaiwanTime(m.created_at)}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form className="flex items-center gap-2 mt-5" onSubmit={handleSend}>
          <button type="button" className="text-[#FFD700]">
            <FiImage size={24} />
          </button>
          <button type="button" className="text-[#FFD700]">
            <FiMusic size={24} />
          </button>
          <button type="button" className="text-[#FFD700]">
            <FiSmile size={24} />
          </button>
          <input
            className="flex-1 rounded-xl bg-[#222d44] text-white p-3 focus:outline-none"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="輸入訊息..."
          />
          <button
            type="submit"
            className="rounded-xl bg-[#FFD700] text-[#0d1827] font-bold px-5 py-2 ml-2 hover:bg-[#ffe366] transition"
          >
            送出
          </button>
        </form>
      </div>
      <Footer />
      <style>{`
        .font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }
      `}</style>
    </div>
  );
}
