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
  // 可依 DB 再加
};

interface UserContextProps {
  user: User | null;
  isLoadingUser: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  isLoadingUser: true,
  setUser: () => {},
  refreshUser: async () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const fetchUser = async () => {
    setIsLoadingUser(true);
    try {
      // Step1: 抓 supabase auth
      const { data, error: authError } = await supabase.auth.getUser();
      console.log("[UserContext] Step1: supabase.auth.getUser result", { data, authError });

      if (data?.user) {
        // Step2: 查 users profile
        const { data: userProfile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();
        console.log("[UserContext] Step2: supabase.from(users) result", { userProfile, profileError });

        // Step3: 結果合併
        const mergedUser = {
          id: data.user.id,
          email: data.user.email,
          ...data.user.user_metadata,
          ...(userProfile ?? {}),
        };
        console.log("[UserContext] Step3: mergedUser", mergedUser);

        setUser(mergedUser);
      } else {
        console.log("[UserContext] Step1: No auth user, setUser(null)");
        setUser(null);
      }
    } catch (e) {
      console.error("[UserContext] fetchUser error", e);
      setUser(null);
    }
    setIsLoadingUser(false);
  };

  useEffect(() => {
    fetchUser();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
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

export function useUser() {
  return useContext(UserContext);
}
