import axios from 'axios';

const API = axios.create({
  baseURL: 'https://integrative-programming.onrender.com/api',
});

// Add the Authorization header to all requests if token exists
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '#/login';
    }
    return Promise.reject(error);
  }
);


export default API;
