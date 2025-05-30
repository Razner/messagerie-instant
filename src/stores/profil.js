import { defineStore } from "pinia";
import { jwtDecode } from 'jwt-decode';


export const ProfilStore = defineStore("ProfilStore", () => {
  const token = sessionStorage.getItem("token");
  const user = jwtDecode(token).sub;

  const getUser = async () => {
    try {
      const response = await fetch(`https://edu.tardigrade.land/msg/protected/user/meta?users=${user}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      })
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const CreateUserMeta = async (username, display_name, img, status) => {
    return await fetch(`https://edu.tardigrade.land/msg/protected/user/meta`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username,
        display_name,
        img,
        status,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Invalid credentials");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }


  return { user, getUser, CreateUserMeta }
})
