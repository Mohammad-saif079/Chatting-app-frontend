import { createContext, useState, useContext } from "react";

// 1️⃣ Create the context
const AuthContext = createContext();

// 2️⃣ Create the provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // login & logout logic
  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3️⃣ Optional custom hook
export const useAuth = () => useContext(AuthContext);
