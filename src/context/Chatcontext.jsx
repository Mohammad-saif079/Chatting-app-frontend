import { createContext, useState, useContext } from "react";

// 1️⃣ Create the context
const chatContext = createContext();

// 2️⃣ Create the provider
export const ChatProvider = ({ children }) => {
    const [mainid, setmainid] = useState("")
    const [chatselected, setchatselected] = useState(false)
    const [contact, setcontact] = useState("")
    const [pfp, setpfp] = useState("default")
    const [contact_status, setcontact_status] = useState("")
    const [msgloading, setmsgloading] = useState(true)
      const [messages, setmessages] = useState([])

    const [chatbox, setchatbox] = useState("hidden");

    return (
        <chatContext.Provider value={{messages, setmessages ,mainid, contact, contact_status, setcontact, setcontact_status, setmainid, chatbox, setchatbox, chatselected, setchatselected,msgloading,setmsgloading, pfp, setpfp }}>
            {children}
        </chatContext.Provider>
    );
};

// 3️⃣ Optional custom hook
export const useChat = () => useContext(chatContext);
