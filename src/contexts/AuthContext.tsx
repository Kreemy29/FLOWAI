import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { saveUser, getUserByEmail, getAllUsers, isSupabaseAvailable } from "@/services/supabase";

interface User {
  email: string;
  role: "admin" | "user";
}

interface UserAccount {
  email: string;
  password: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = "krimirayen296@gmail.com";
const ADMIN_PASSWORD = "password346139";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const getStoredAccounts = (): UserAccount[] => {
    const stored = localStorage.getItem("userAccounts");
    return stored ? JSON.parse(stored) : [];
  };

  const saveAccount = (account: UserAccount) => {
    const accounts = getStoredAccounts();
    accounts.push(account);
    localStorage.setItem("userAccounts", JSON.stringify(accounts));
  };

  const signup = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    console.log('🔄 signup called with:', email);
    
    // Validate email format
    if (!email || !email.includes("@")) {
      return { success: false, message: "Please enter a valid email address" };
    }

    // Validate password
    if (!password || password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters long" };
    }

    // Cannot signup as admin
    if (email === ADMIN_EMAIL) {
      return { success: false, message: "Cannot register with admin email" };
    }

    // Check if email is already registered (check both localStorage and Supabase)
    const accounts = getStoredAccounts();
    if (accounts.some((acc) => acc.email === email)) {
      return { success: false, message: "Email is already registered" };
    }

    // Check Supabase if available
    if (isSupabaseAvailable()) {
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return { success: false, message: "Email is already registered" };
      }
    }

    // Create new user account
    const newAccount: UserAccount = {
      email,
      password, // In production, this should be hashed
      role: "user",
    };

    // Save to localStorage (for backward compatibility)
    saveAccount(newAccount);

    // Save to Supabase if available
    if (isSupabaseAvailable()) {
      console.log('✅ Supabase available, saving user to Supabase...');
      const supabaseSuccess = await saveUser(email, password, "user");
      if (supabaseSuccess) {
        console.log('✅ User saved to Supabase successfully!');
      } else {
        console.warn('⚠️ Failed to save user to Supabase, but saved to localStorage');
      }
    } else {
      console.warn('⚠️ Supabase not available, user saved to localStorage only');
    }

    // Automatically log in the new user
    const newUser: User = { email, role: "user" };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));

    return { success: true, message: "Account created successfully!" };
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔄 login called with:', email);
    
    // Admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: User = { email, role: "admin" };
      setUser(adminUser);
      localStorage.setItem("user", JSON.stringify(adminUser));
      return true;
    }

    // Regular user login - check Supabase first if available
    if (isSupabaseAvailable()) {
      console.log('✅ Supabase available, checking user in Supabase...');
      const supabaseUser = await getUserByEmail(email);
      if (supabaseUser && supabaseUser.password_hash === password) {
        console.log('✅ User found in Supabase, logging in...');
        const regularUser: User = { email, role: supabaseUser.role as "admin" | "user" };
        setUser(regularUser);
        localStorage.setItem("user", JSON.stringify(regularUser));
        return true;
      }
    }

    // Fallback to localStorage accounts
    const accounts = getStoredAccounts();
    const account = accounts.find((acc) => acc.email === email && acc.password === password);

    if (account) {
      console.log('✅ User found in localStorage, logging in...');
      const regularUser: User = { email, role: account.role };
      setUser(regularUser);
      localStorage.setItem("user", JSON.stringify(regularUser));
      return true;
    }

    console.log('❌ Login failed: Invalid email or password');
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

