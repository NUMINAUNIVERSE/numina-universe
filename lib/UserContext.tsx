import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type User = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  username?: string;
  role?: string;
  is_verified?: boolean;
  [key: string]: any;
};

interface UserContextProps {
  user: User | null;
  isLoadingUser: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refreshUser: () => Promise<void>;
}

// 建立 Context
const UserContext = createContext<UserContextProps>({
  user: null,
  isLoadingUser: true,
  setUser: () => {},
  refreshUser: async () => {},
});

// Provider
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // 取得使用者
  const fetchUser = async () => {
    setIsLoadingUser(true);
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      // 進一步抓DB欄位（建議可以加這一段，未來延伸更完整 user info）
      const { data: userProfile } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();
      setUser({
        id: data.user.id,
        email: data.user.email,
        ...data.user.user_metadata,
        ...userProfile,
      });
    } else {
      setUser(null);
    }
    setIsLoadingUser(false);
  };

  useEffect(() => {
    fetchUser();
    // 監聽登入登出
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoadingUser,
        setUser,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// 共用 hook
export function useUser() {
  return useContext(UserContext);
}
