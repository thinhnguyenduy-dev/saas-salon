import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const session = await getSession();
    // console.log("[API Client] Session retrieved:", session);
    
    // Check for access_token in expected location
    const token = (session as any)?.user?.access_token || (session as any)?.access_token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
        // console.warn("[API Client] No access token found in session. User:", session?.user);
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn("[API Client] 401 Unauthorized. Redirecting to login...");
      
      // Avoid infinite loops by NOT calling signOut() repeatedly
      // Just redirect to login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
         window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
