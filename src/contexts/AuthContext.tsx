import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
    // Validate email format
    if (!email || !email.includes("@")) {
      return { success: false, message: "Please enter a valid email address" };
    }

    // Validate password
    if (!password || password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters long" };
    }

    // Check if email is already registered
    const accounts = getStoredAccounts();
    if (accounts.some((acc) => acc.email === email)) {
      return { success: false, message: "Email is already registered" };
    }

    // Cannot signup as admin
    if (email === ADMIN_EMAIL) {
      return { success: false, message: "Cannot register with admin email" };
    }

    // Create new user account
    const newAccount: UserAccount = {
      email,
      password, // In production, this should be hashed
      role: "user",
    };

    saveAccount(newAccount);

    // Automatically log in the new user
    const newUser: User = { email, role: "user" };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));

    return { success: true, message: "Account created successfully!" };
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: User = { email, role: "admin" };
      setUser(adminUser);
      localStorage.setItem("user", JSON.stringify(adminUser));
      return true;
    }

    // Regular user login - check stored accounts
    const accounts = getStoredAccounts();
    const account = accounts.find((acc) => acc.email === email && acc.password === password);

    if (account) {
      const regularUser: User = { email, role: account.role };
      setUser(regularUser);
      localStorage.setItem("user", JSON.stringify(regularUser));
      return true;
    }

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

