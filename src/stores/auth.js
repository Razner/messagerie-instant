//fichier API pour l'authentification

import router from "@/router";
import { defineStore } from "pinia";

export const LoginStore = defineStore("LoginStore", () => {
  const saveTokenToLocalStorage = (token) => {
    localStorage.setItem('token', token);
  };

  const Login = async (username, password) => {
    return await fetch("https://edu.tardigrade.land/msg/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Invalid credentials");
        }
      }).then((data) => {
        saveTokenToLocalStorage(data.token);
        router.push('/')
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return { Login }
})

