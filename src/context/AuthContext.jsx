

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiRequest } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = sessionStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const result = await apiRequest("/auth/me");
        setUser(result.data.user);
      } catch {
        sessionStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  async function login(email, password) {
    const result = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    sessionStorage.setItem("token", result.data.token);
    setUser(result.data.user);

    return result.data.user;
  }

  async function register(name, email, password) {
    const result = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    return result.data.user;
  }

  function logout() {
    sessionStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
