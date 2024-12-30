import { useState } from "react";
import ApiContext from "./ApiContext";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const ApiState = (props) => {
  // const url = "https://api.sikkimglobaltechnicaluniversity.co.in/";
  const url = "http://192.168.1.100:5005/";
  const [user, setUser] = useState("");
  const [token, setToken] = useState(null)
  const [notification, setNotification] = useState([])

    async function verifyToken(token) {
    try {
      const response = await axios.get(`${url}verifyToken`, {headers: {
          Authorization: `Bearer ${token}`, 
        }})
      return true
    } catch (error) {
      console.error("Error verifying token:", error);
      return false;
    }
  }
  async function fetchnotifcation(){
    try {
      const response = await axios.get(`${url}notification`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotification(response.data.notifications);
      // console.log(response.data.notifications);
      
    } catch (error) {
      console.log("Error fetching Notification", error);
    }
  }

  return (
    <ApiContext.Provider
      value={{
        url,
        token,
        user,
        setUser,
        verifyToken,
        notification,
        setToken,
        fetchnotifcation
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
};

export default ApiState;
