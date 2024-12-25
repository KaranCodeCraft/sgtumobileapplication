import { useState } from "react";
import ApiContext from "./ApiContext";
import { Alert } from "react-native";


const ApiState = (props) => {
    const url = "http://192.168.1.100:5000/"
    const [user, setUser] = useState("")

    async function verifyToken(token) {
      try {
        const response = await fetch(`${url}/api/aadhaar-login/verify-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ token })
        });
        const data = await response.json();
       setUser(data.username);
        
        if(response.status == 200)return true;

        return false
      } catch (error) {
        console.error("Error verifying token:", error);
        return false;
      }
    }

  return (
    <ApiContext.Provider
      value={{
        url,
        user,
        setUser,
        verifyToken,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
};

export default ApiState;