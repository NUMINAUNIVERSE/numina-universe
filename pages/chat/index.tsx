import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useUser, User } from "@supabase/auth-helpers-react";

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

interface SimpleUser {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
}

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
  const [showGroupModal, setShowGroupModal] = useState(false);

  // 狀態管理
  const [searchUser, setSearchUser] = useState("");
  const [searchResult, setSearchResult] = useState<SimpleUser[]>([]);
  const [dmLoading, setDmLoading] = useState(false);
  const [dmError, setDmError] = useState<string | null>(null);

  // 群組
  const [allUsers, setAllUsers] = useState<SimpleUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupCreating, setGroupCreating] = useState(false);
  const [groupError, setGroupError] = useState<string | null>(null);

  const user = useUser() as User | null;

  // 搜尋用戶，for DM
  useEffect(() => {
    if (!searchUser.trim()) {
      setSearchResult([]);
      setDmError(null);
      return;
    }
    const timeout = setTimeout(async () => {
      setDmLoading(true);
      setDmError(null);
      // 可自行調整搜尋條件（此處 username/name 任一含關鍵字）
      const { data, error } = await supabase
        .from("users")
        .select("id, name, username, avatar_url")
        .or(`username.ilike.%${searchUser.trim()}%,name.ilike.%${searchUser.trim()}%`)
        .neq("id", user?.id ?? "")
        .limit(8);
      if (error) setDmError("搜尋失敗，請稍後再試");
      setSearchResult(data ?? []);
      setDmLoading(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchUser, user?.id]);

  // 取得全部用戶，for 建群組
  useEffect(() => {
    if (!showGroupModal) return;
    supabase
      .from("users")
      .select("id, name, username, avatar_url")
      .neq("id", user?.id ?? "")
      .limit(50)
      .then(({ data }) => setAllUsers(data ?? []));
  }, [showGroupModal, user?.id]);

  // 發起 DM 流程
  async function handleCreateDM(target: SimpleUser) {
    if (!user) return;
    setDmError(null);

    // 1. 查找已存在的 DM 房（查 chat_rooms + chat_room_members 組合）
    // 查這兩人是否有共同 dm 房
    const { data: rooms1 } = await supabase
      .from("chat_room_members")
      .select("room_id")
      .eq("user_id", user.id);
    const { data: rooms2 } = await supabase
      .from("chat_room_members")
      .select("room_id")
      .eq("user_id", target.id);

    const userRooms = new Set((rooms1 || []).map((r) => r.room_id));
    const targetRooms = new Set((rooms2 || []).map((r) => r.room_id));
    let sharedRoomId: string | null = null;

    for (const id of userRooms) {
      if (targetRooms.has(id)) {
        // 檢查該房型態
        const { data: roomData } = await supabase
          .from("chat_rooms")
          .select("id,type")
          .eq("id", id)
          .eq("type", "dm")
          .single();
        if (roomData) {
          sharedRoomId = id;
          break;
        }
      }
    }

    let roomId: string | null = sharedRoomId;

    if (!roomId) {
      // 2. 建新聊天室 (只存 type/name/avatar，不存 member_ids)
      const { data, error } = await supabase
        .from("chat_rooms")
        .insert([
          {
            type: "dm",
            name: null,
            avatar_url: null,
            created_by: user.id,
          },
        ])
        .select()
        .single();

      if (error || !data || !data.id) {
        setDmError("建立對話失敗，請重試");
        return;
      }
      roomId = data.id;
      // 3. 插入 chat_room_members
      await supabase.from("chat_room_members").insert([
        { room_id: roomId, user_id: user.id },
        { room_id: roomId, user_id: target.id },
      ]);
    }
    // 4. 跳轉
    window.location.href = `/chat/dm/${roomId}`;
  }

  // 建群組
  async function handleCreateGroup() {
    if (!user) return;
    setGroupError(null);
    if (!groupName.trim()) {
      setGroupError("請輸入群組名稱");
      return;
    }
    if (selectedUsers.length === 0) {
      setGroupError("請至少選擇一位成員");
      return;
    }
    setGroupCreating(true);
    // 1. 建立 chat_rooms 群組 (不存 member_ids)
    const { data, error } = await supabase
      .from("chat_rooms")
      .insert([
        {
          type: "group",
          name: groupName.trim(),
          avatar_url: null,
          created_by: user.id,
        },
      ])
      .select()
      .single();

    if (error || !data || !data.id) {
      setGroupError("建立群組失敗，請重試");
      setGroupCreating(false);
      return;
    }
    const groupId = data.id;
    // 2. 插入 chat_room_members
    const allMemberIds = [user.id, ...selectedUsers];
    await supabase.from("chat_room_members").insert(
      allMemberIds.map(uid => ({ room_id: groupId, user_id: uid }))
    );
    setGroupCreating(false);
    setShowGroupModal(false);
    setSelectedUsers([]);
    setGroupName("");
    window.location.href = `/chat/group/${groupId}`;
  }

  return (
    <div className="min-h-screen bg-[#0d1827] text-white flex flex-col font-sans">
      <Navbar />
      <div className="max-w-3xl mx-auto pt-10 pb-16 px-4 w-full flex flex-col">
        {/* 功能區：搜尋用戶 DM、＋新群組 */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-7 gap-3">
          <div className="flex-1 w-full relative">
            <input
              className="rounded-xl bg-[#222d44] text-white p-3 w-full"
              placeholder="搜尋用戶聊天（帳號/暱稱）"
              value={searchUser}
              onChange={e => setSearchUser(e.target.value)}
              disabled={!user}
            />
            {searchUser.trim() && (
              <div className="absolute z-10 bg-[#222d44] border border-[#FFD700]/30 rounded-xl mt-2 w-full max-w-[400px] shadow-2xl">
                {dmLoading && <div className="py-4 text-center text-[#FFD700]">搜尋中…</div>}
                {!dmLoading && searchResult.length === 0 && (
                  <div className="py-4 text-center text-gray-400">沒有找到用戶</div>
                )}
                {!dmLoading &&
                  searchResult.map(u => (
                    <div
                      key={u.id}
                      className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-[#FFD700]/20 transition"
                      onClick={() => handleCreateDM(u)}
                    >
                      <img
                        src={u.avatar_url ?? "/demo/author1.jpg"}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold">{u.name}</div>
                        <div className="text-xs text-gray-400">@{u.username}</div>
                      </div>
                      <span className="ml-auto bg-[#FFD700] text-[#0d1827] rounded px-2 py-0.5 text-xs font-bold">發起對話</span>
                    </div>
                  ))}
                {dmError && <div className="py-3 text-center text-red-400">{dmError}</div>}
              </div>
            )}
          </div>
          <button
            className="rounded-xl px-6 py-3 bg-[#FFD700] text-[#0d1827] font-bold shadow-xl hover:bg-[#ffe366] transition"
            onClick={() => setShowGroupModal(true)}
            disabled={!user}
            type="button"
          >＋新群組聊天室</button>
        </div>
        {/* Tab + 聊天室清單 */}
        <div className="flex mb-5">
          <button
            className={`py-3 px-7 rounded-t-lg font-bold text-lg ${tab === "group"
              ? "bg-[#FFD700] text-[#0d1827]"
              : "bg-[#161e2d] text-white"}`}
            onClick={() => setTab("group")}
            type="button"
          >群組聊天室</button>
          <button
            className={`py-3 px-7 rounded-t-lg font-bold text-lg ml-2 ${tab === "dm"
              ? "bg-[#FFD700] text-[#0d1827]"
              : "bg-[#161e2d] text-white"}`}
            onClick={() => setTab("dm")}
            type="button"
          >私人訊息</button>
        </div>
        <div className="flex-1">
          {tab === "group" ? <GroupChatList /> : <DMChatList />}
        </div>
      </div>
      {/* 新群組聊天室 Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-[#161e2d] p-8 rounded-2xl max-w-xl w-full border border-[#FFD700]/30 shadow-2xl relative">
            <button
              className="absolute top-2 right-4 text-2xl text-[#FFD700] hover:text-white"
              onClick={() => setShowGroupModal(false)}
              type="button"
              aria-label="關閉"
            >✕</button>
            <div className="font-bold text-2xl mb-4 text-[#FFD700]">建立新群組聊天室</div>
            <input
              className="rounded-xl bg-[#222d44] text-white p-3 w-full mb-4"
              placeholder="群組名稱"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              maxLength={32}
            />
            <div className="mb-4 max-h-52 overflow-y-auto">
              {allUsers.map(u => (
                <div
                  key={u.id}
                  className="flex items-center gap-3 px-2 py-2 cursor-pointer rounded hover:bg-[#ffd700]/10"
                  onClick={() =>
                    setSelectedUsers(prev =>
                      prev.includes(u.id)
                        ? prev.filter(id => id !== u.id)
                        : [...prev, u.id]
                    )
                  }
                >
                  <img
                    src={u.avatar_url ?? "/demo/author2.jpg"}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="font-bold">{u.name}</div>
                  <div className="text-xs text-gray-400">@{u.username}</div>
                  {selectedUsers.includes(u.id) && (
                    <span className="ml-auto bg-[#FFD700] text-[#0d1827] rounded px-2 py-0.5 text-xs font-bold">已選</span>
                  )}
                </div>
              ))}
            </div>
            {groupError && <div className="mb-3 text-red-400">{groupError}</div>}
            <button
              className="w-full mt-2 py-3 rounded-xl bg-[#FFD700] text-[#0d1827] font-bold text-lg shadow hover:bg-[#ffe366] transition"
              disabled={groupCreating}
              onClick={handleCreateGroup}
              type="button"
            >
              {groupCreating ? "建立中…" : "建立群組"}
            </button>
          </div>
        </div>
      )}
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
