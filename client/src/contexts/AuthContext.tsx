import React, { useState } from "react";
import api from "../services/api";
import type { User } from "../types";
import { AuthContext } from "./auth";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("trip-splitter-user");

    if (storedUser) {
      return JSON.parse(storedUser);
    }

    return null;
  });

  const saveUser = (nextUser: User) => {
    localStorage.setItem("trip-splitter-user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    saveUser(response.data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post("/auth/register", { name, email, password });
    saveUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem("trip-splitter-user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: Boolean(user), user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};