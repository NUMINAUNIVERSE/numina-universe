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
  // 可以依你DB再加
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
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
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
