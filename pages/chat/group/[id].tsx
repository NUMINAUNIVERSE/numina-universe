import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { FiImage, FiMusic, FiSmile } from "react-icons/fi";
import { supabase } from "@/lib/supabaseClient"; // 請確認路徑
import { useUser } from "@supabase/auth-helpers-react"; // 若無用到請移除

type Message = {
  id: string;
  group_id: string;
  sender_id: string;
  sender_name: string;
  type: string;
  content: string | null;
  img_url: string | null;
  sticker_url: string | null;
  created_at: string;
};

export default function GroupChatRoom() {
  const router = useRouter();
  const { id } = router.query; // group id
  const user = useUser();
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [groupName, setGroupName] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 取得群組名稱
  useEffect(() => {
    if (!id) return;
    supabase
      .from("chat_groups")
      .select("name")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) setGroupName(data.name);
      });
  }, [id]);

  // 取得歷史訊息
  useEffect(() => {
    if (!id) return;
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("id, group_id, sender_id, sender_name, type, content, img_url, sticker_url, created_at")
        .eq("group_id", id)
        .order("created_at", { ascending: true });
      if (!error && data) setMessages(data);
    };
    fetchMessages();

    // 監聽即時訊息（可選）
    const subscription = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `group_id=eq.${id}` },
        payload => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [id]);

  useEffect(() => {
    // 捲到最底
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 發送訊息
  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!msg.trim() || !user || !id) return;
    await supabase.from("chat_messages").insert({
      group_id: id,
      sender_id: user.id,
      sender_name: user.user_metadata?.name || user.email || "未知",
      type: "text",
      content: msg,
      img_url: null,
      sticker_url: null
    });
    setMsg("");
  }

  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 w-full flex flex-col">
        <div className="font-bold text-2xl mb-3 text-[#FFD700]">
          {groupName ? groupName : "NUMINA 宇宙創作者群組"}
        </div>
        <div className="flex-1 min-h-[400px] bg-[#222d44] rounded-xl p-5 overflow-y-auto flex flex-col gap-4">
          {messages.map((m, i) => (
            <div key={m.id || i} className={`flex ${m.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${m.sender_id === user?.id
                ? "bg-[#FFD700] text-[#0d1827] ml-16" : "bg-[#292f45] text-white mr-16"} shadow`}>
                {m.type === "text" && m.content && <span>{m.content}</span>}
                {m.img_url && <img src={m.img_url} alt="img" className="rounded-lg max-w-[180px]" />}
                {m.sticker_url && <img src={m.sticker_url} alt="sticker" className="w-14 h-14" />}
                <div className="text-xs mt-2 opacity-70">{m.sender_name}・{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
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
