import { createContext, useState, useContext } from "react";

const Signupcontext = createContext();

export const Signupprovider = ({ children }) => {
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpass, setconfirmpass] = useState("");

  const [err1, seterr1] = useState("");
  const [err2, seterr2] = useState("");
  const [err3, seterr3] = useState("");
  const [err4, seterr4] = useState("");

  const states = {
    firstname, setfirstname,
    lastname, setlastname,
    username, setusername,
    password, setpassword,
    confirmpass, setconfirmpass,
    err1, seterr1,
    err2, seterr2,
    err3, seterr3,
    err4, seterr4
  };

  return (
    <Signupcontext.Provider value={states}>
      {children}
    </Signupcontext.Provider>
  );
};

export const Usesign = () => useContext(Signupcontext);

