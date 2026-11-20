import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// ✅ اضافه کردن توکن به همه درخواست‌ها
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('auth_token');
        console.log("📤 Request to:", config.url, "Token:", token ? "Yes" : "No");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// مدیریت خطای 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = error.config?.url || '';
        const isAuthEndpoint = 
            url.includes('/login') || 
            url.includes('/send-otp') || 
            url.includes('/register-otp') ||
            url.includes('/reset-password') ||
            url.includes('/send-reset-code') ||
            url.includes('/logout');

        if (error.response?.status === 401 && !isAuthEndpoint) {
            console.log("🔒 401 Unauthorized - Logging out");
            Cookies.remove('auth_token', { path: '/' });
            Cookies.remove('user', { path: '/' });
            Cookies.remove('auth_token');
            Cookies.remove('user');
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;