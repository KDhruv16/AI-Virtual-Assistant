import React, { createContext } from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
export const userDataContext = createContext();
import axios from "axios";


function UserContext({ children }) {
  const serverUrl = "http://localhost:8000";
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(false);
  const [userData, setUserData] = useState(null);

  async function getData() {
    try {
      let res = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
      if (res) {
        console.log("user data", res.data);
        setUserData(res.data);
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(`${serverUrl}/api/user/asktoassistant`, { command }, { withCredentials: true })
      return result.data
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData();
  }, [])

  const value = {
    serverUrl, frontendImage, setFrontendImage, backendImage,
    setBackendImage, userData, setUserData, selectedImage, setSelectedImage,
    getGeminiResponse
  }
  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  )
}

export default UserContext
