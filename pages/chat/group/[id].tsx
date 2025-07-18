import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { FiImage, FiMusic, FiSmile } from "react-icons/fi";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  type: "text" | "image" | "sticker" | "audio";
  content: string;
  created_at: string;
  sender: {
    id: string;
    name: string;
    username: string;
    avatar_url?: string;
  } | null;
}

// 顯示每個用戶本地時區的訊息時間
function formatLocalTime(utcString: string) {
  if (!utcString) return "";
  const date = new Date(utcString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function GroupChatRoom() {
  const router = useRouter();
  const { id: roomId } = router.query;
  const user = useUser();
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [groupName, setGroupName] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 取得群組名稱
  useEffect(() => {
    if (!roomId) return;
    supabase
      .from("chat_rooms")
      .select("name")
      .eq("id", roomId)
      .eq("type", "group")
      .single()
      .then(({ data }) => {
        if (data) setGroupName(data.name || "NUMINA 群組聊天室");
      });
  }, [roomId]);

  // 取得歷史訊息
  useEffect(() => {
    if (!roomId) return;
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select(
          `
          id, room_id, sender_id, type, content, created_at,
          sender:users(id, name, username, avatar_url)
          `
        )
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });
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
    };
    fetchMessages();
  }, [roomId]);

  // 實時監聽新訊息（避免重複訊息）
  useEffect(() => {
    if (!roomId) return;
    const channel = supabase
      .channel("chat_messages_room_" + roomId)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `room_id=eq.${roomId}` },
        async (payload) => {
          const m = payload.new;
          const { data } = await supabase
            .from("users")
            .select("id, name, username, avatar_url")
            .eq("id", m.sender_id)
            .single();
          const normalized: ChatMessage = {
            id: m.id,
            room_id: m.room_id,
            sender_id: m.sender_id,
            type: m.type,
            content: m.content,
            created_at: m.created_at,
            sender: data ?? null,
          };
          setMessages((prev) => {
            // 若已存在就不再 push，避免重複
            if (prev.some((item) => item.id === m.id)) return prev;
            return [...prev, normalized];
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

  // 滾動到底
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 發送訊息（讓 Realtime 自動補進，不自己 setMessages）
  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!msg.trim() || !user || !roomId) return;
    const insertMsg = {
      room_id: roomId as string,
      sender_id: user.id,
      type: "text",
      content: msg.trim(),
    };
    await supabase.from("chat_messages").insert([insertMsg]);
    setMsg("");
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  }

  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 w-full flex flex-col">
        <div className="font-bold text-2xl mb-3 text-[#FFD700]">
          {groupName ? groupName : "NUMINA 群組聊天室"}
        </div>
        <div className="flex-1 min-h-[400px] bg-[#222d44] rounded-xl p-5 overflow-y-auto flex flex-col gap-4">
          {messages.map((m, i) => (
            <div key={m.id || i} className={`flex ${m.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${m.sender_id === user?.id
                ? "bg-[#FFD700] text-[#0d1827] ml-16"
                : "bg-[#292f45] text-white mr-16"} shadow`}>
                <div className="flex items-center gap-2 mb-1">
                  {m.sender_id !== user?.id && (
                    <img
                      src={m.sender?.avatar_url || "/demo/author2.jpg"}
                      alt="頭像"
                      className="w-7 h-7 rounded-full"
                    />
                  )}
                  <span className="text-sm font-bold">
                    {m.sender_id === user?.id ? "我" : m.sender?.name || "群組成員"}
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
                  {formatLocalTime(m.created_at)}
                </div>
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
          <button type="submit" className="rounded-xl bg-[#FFD700] text-[#0d1827] font-bold px-5 py-2 ml-2 hover:bg-[#ffe366] transition">
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
