import { useState } from "react";
import ApiContext from "./ApiContext";

const ApiState = (props) => {
    const url = "abc"
    const [user, setUser] = useState("")

  return (
    <ApiContext.Provider
      value={{
        url,
        user,
        setUser
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
};

export default ApiState;
