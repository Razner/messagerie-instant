//fichier API pour l'authentification

import router from "@/router";
import { defineStore } from "pinia";

export const LoginStore = defineStore("LoginStore", () => {
  const saveTokenToLocalStorage = (token) => {
    console.log('Sauvegarde du token:', token)
    // Décoder le token pour vérifier son contenu
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      console.log('Token décodé:', JSON.parse(jsonPayload))
    } catch (e) {
      console.error('Erreur lors du décodage du token:', e)
    }
    localStorage.setItem('token', token);
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

