import axios from 'axios';

const API_URL = 'https://edu.tardigrade.land/msg/';

export async function login(username, password) { 
    try {
      const response = await axios.post(`${API_URL}auth/login`, {
        username,
        password,
      });
  
      const token = response.data.token;
      console.log("Token récupéré :", token);
      localStorage.setItem('token', token); 
  
      return token;
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      return null;
    }
  }
  

export async function getChannels() {  
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const response = await axios.get(`${API_URL}channels`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des salons :', error);
    return [];
  }
}
