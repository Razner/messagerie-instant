//fichier API pour l'authentification

import router from "@/router";
import { jwtDecode } from "jwt-decode";
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
          return data
        } else {
          const errorData = await response.json()
          console.error('Erreur de connexion:', errorData)
          throw new Error(errorData.message || "Invalid credentials")
        }
      }).then((data) => {
        saveTokenToLocalStorage(data.token)
        scheduleTokenRefresh(data.token);
        router.push('/')
      })
      .catch((error) => {
        console.error("Erreur de connexion:", error)
        throw error
      });
  }

  const refreshToken = async () => {
    return await fetch("https://edu.tardigrade.land/msg/protected/extend_session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
      .then(async (response) => {
        console.log('Réponse du serveur:', response.status)
        if (response.status === 200) {
          const data = await response.json()
          return data
        } else {
          const errorData = await response.json()
          console.error('Erreur de connexion:', errorData)
          throw new Error(errorData.message || "Invalid credentials")
        }
      }).then((data) => {
        saveTokenToLocalStorage(data.token)
        router.push('/')
      })
      .catch((error) => {
        console.error("Erreur de connexion:", error)
        throw error
      });
  }

  let refreshTimeoutId;

  function scheduleTokenRefresh(token) {
    console.log("Planification du rafraîchissement du token");
    const payload = jwtDecode(token);
    const issuedAt = payload.iat * 1000;
    const tokenLifetime = 3 * 3600000;
    const buffer = 1 * 60000;

    const refreshTime = issuedAt + tokenLifetime - buffer;
    const delay = refreshTime - Date.now();

    if (refreshTimeoutId) clearTimeout(refreshTimeoutId);

    if (delay <= 0) {
      console.warn("Token expiré ou trop proche de l'expiration");
      sessionStorage.removeItem(token);
      return;
    }

    refreshTimeoutId = setTimeout(() => {
      refreshToken().then(newToken => {
        sessionStorage.setItem("token", newToken);
        scheduleTokenRefresh(newToken);
      }).catch(err => {
        console.error("Échec du rafraîchissement :", err);
        sessionStorage.removeItem(token);
      });
    }, delay);
  }

  return { Login }
})

