import { createContext, useState, useContext } from "react";

// 1️⃣ Create the context
const AuthContext = createContext();

// 2️⃣ Create the provider
export const AuthProvider = ({ children }) => {
  const [authToken, setauthToken] = useState(localStorage.getItem("AuthToken"))

  return (
    <AuthContext.Provider value={{ authToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3️⃣ Optional custom hook
export const useAuth = () => useContext(AuthContext);
