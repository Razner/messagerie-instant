//fichier API pour l'authentification

import router from "@/router";
import { defineStore } from "pinia";

export const LoginStore = defineStore("LoginStore", () => {
  const saveTokenToLocalStorage = (token) => {
    sessionStorage.setItem('token', token);
  };

  const Login = async (username, password) => {
    console.log('Tentative de connexion avec:', username)
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
      .then(async (response) => {
        console.log('Réponse du serveur:', response.status)
        if (response.status === 200) {
          const data = await response.json()
          console.log('Données reçues:', data)
          return data
        } else {
          const errorData = await response.json()
          console.error('Erreur de connexion:', errorData)
          throw new Error(errorData.message || "Invalid credentials")
        }
      }).then((data) => {
        saveTokenToLocalStorage(data.token)
        router.push('/message')
      })
      .catch((error) => {
        console.error("Erreur de connexion:", error)
        throw error
      });
  }

  return { Login }
})

