import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useUser, User } from "@supabase/auth-helpers-react";

// 嚴格型別

interface RawChatRoomMember {
  room_id: string;
  chat_rooms: {
    id: string;
    name: string | null;
    avatar_url: string | null;
    type: string;
  } | null;
  user_id: string;
  id: string;
}

// 對前端可用資料做 parse 處理
function parseChatRoomList(
  data: unknown,
  type: "group" | "dm"
): { id: string; name: string; avatar_url: string | null }[] {
  if (!Array.isArray(data)) return [];
  return data
    .filter(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "chat_rooms" in item &&
        item.chat_rooms &&
        item.chat_rooms.type === type
    )
    .map((item) => ({
      id: (item as RawChatRoomMember).room_id,
      name:
        (item as RawChatRoomMember).chat_rooms?.name ??
        (type === "group" ? "群組聊天室" : "私人聊天室"),
      avatar_url: (item as RawChatRoomMember).chat_rooms?.avatar_url ?? null,
    }));
}

export default function ChatHome() {
  const [tab, setTab] = useState<"group" | "dm">("group");
  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-3xl mx-auto pt-10 pb-16 px-4 w-full flex flex-col">
        <div className="flex mb-5">
          <button
            className={`py-3 px-7 rounded-t-lg font-bold text-lg ${
              tab === "group"
                ? "bg-[#FFD700] text-[#0d1827]"
                : "bg-[#161e2d] text-white"
            }`}
            onClick={() => setTab("group")}
            type="button"
          >
            群組聊天室
          </button>
          <button
            className={`py-3 px-7 rounded-t-lg font-bold text-lg ml-2 ${
              tab === "dm"
                ? "bg-[#FFD700] text-[#0d1827]"
                : "bg-[#161e2d] text-white"
            }`}
            onClick={() => setTab("dm")}
            type="button"
          >
            私人訊息
          </button>
        </div>
        <div className="flex-1">
          {tab === "group" ? <GroupChatList /> : <DMChatList />}
        </div>
      </div>
      <Footer />
      <style>{`
        .font-sans { font-family: 'Noto Sans TC', 'Montserrat', 'sans-serif'; }
      `}</style>
    </div>
  );
}

function GroupChatList() {
  const user = useUser() as User | null;
  const [groups, setGroups] = useState<{ id: string; name: string; avatar_url: string | null }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("chat_room_members")
      .select("room_id, chat_rooms(id, name, avatar_url, type)")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (!error && data) {
          setGroups(parseChatRoomList(data, "group"));
        }
        setLoading(false);
      });
  }, [user]);

  if (!user) return <div>請先登入</div>;
  if (loading) return <div>載入中…</div>;
  return (
    <div>
      <div className="font-bold text-[#FFD700] text-lg mb-4">我的群組聊天室</div>
      <ul className="space-y-3">
        {groups.length === 0 && <li>目前尚無群組聊天室</li>}
        {groups.map((g) => (
          <li key={g.id}>
            <Link href={`/chat/group/${g.id}`} legacyBehavior>
              <a className="block bg-[#222d44] rounded-xl px-5 py-4 hover:bg-[#292f45] transition font-bold text-white">
                {g.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DMChatList() {
  const user = useUser() as User | null;
  const [dms, setDMs] = useState<{ id: string; name: string; avatar_url: string | null }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("chat_room_members")
      .select("room_id, chat_rooms(id, name, avatar_url, type)")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (!error && data) {
          setDMs(parseChatRoomList(data, "dm"));
        }
        setLoading(false);
      });
  }, [user]);

  if (!user) return <div>請先登入</div>;
  if (loading) return <div>載入中…</div>;
  return (
    <div>
      <div className="font-bold text-[#FFD700] text-lg mb-4">私人訊息</div>
      <ul className="space-y-3">
        {dms.length === 0 && <li>目前尚無私人訊息</li>}
        {dms.map((dm) => (
          <li key={dm.id}>
            <Link href={`/chat/dm/${dm.id}`} legacyBehavior>
              <a className="block bg-[#222d44] rounded-xl px-5 py-4 hover:bg-[#292f45] transition font-bold text-white">
                {dm.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
