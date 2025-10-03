import { createContext, useState, useContext } from "react";

// 1️⃣ Create the context
const chatContext = createContext();

// 2️⃣ Create the provider
export const ChatProvider = ({ children }) => {
    const [mainid, setmainid] = useState("651f2b4c8f0e4d23a1c7e9b5")

    const [contact, setcontact] = useState("")
    const [contact_status, setcontact_status] = useState("")

    const [chatbox, setchatbox] = useState("hidden");

    return (
        <chatContext.Provider value={{ mainid, contact, contact_status, setcontact, setcontact_status, setmainid, chatbox, setchatbox }}>
            {children}
        </chatContext.Provider>
    );
};

// 3️⃣ Optional custom hook
export const useChat = () => useContext(chatContext);
