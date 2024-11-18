import { useState } from "react";
import ApiContext from "./ApiContext";
import { Alert } from "react-native";


const ApiState = (props) => {
    const url = "https://api.sgtu.co.in"
    const [user, setUser] = useState("")

    async function verifyToken(token) {
      try {
        const response = await fetch(`${url}/api/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
       setUser(data.username);
        
        if(response.status = 200)return true;

        return false
      } catch (error) {
        console.error("Error verifying token:", error);
        return false; // Return null in case of an error
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
