import Cookies from 'js-cookie';
import api from './axios';

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
}

export interface Profile {
    full_name: string | null;
    age: number | null;
    education: string | null;
    economic_status: string | null;
    number_of_children: number | null;
    children_ages: number | null;
    role: string;
}

class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'user';

    // دریافت توکن از کوکی
    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        const token = Cookies.get(this.TOKEN_KEY);
        console.log("🔑 Getting token:", token ? "存在" : "不存在");
        return token || null;
    }

    // ذخیره توکن در کوکی
    setToken(token: string): void {
        console.log("💾 Saving token:", token.substring(0, 20) + "...");
        Cookies.set(this.TOKEN_KEY, token, { expires: 7, path: '/' });
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth-changed'));
        }
    }

    // دریافت کاربر از کوکی
    getUser(): User | null {
        if (typeof window === 'undefined') return null;
        const user = Cookies.get(this.USER_KEY);
        return user ? JSON.parse(user) : null;
    }

    // ذخیره کاربر در کوکی
    setUser(user: User): void {
        console.log("👤 Saving user:", user);
        Cookies.set(this.USER_KEY, JSON.stringify(user), { expires: 7, path: '/' });
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth-changed'));
            window.dispatchEvent(new Event('profile-updated'));
        }
    }

    // بررسی لاگین بودن
    isLoggedIn(): boolean {
        const hasToken = !!this.getToken();
        console.log("🔐 Is logged in:", hasToken);
        return hasToken;
    }

    // خروج از حساب
    async logout(): Promise<void> {
        try {
            const token = this.getToken();

            // پاکسازی فوری و کامل تمام کوکی‌های احراز هویت
            Cookies.remove(this.TOKEN_KEY, { path: '/' });
            Cookies.remove(this.USER_KEY, { path: '/' });
            Cookies.remove(this.TOKEN_KEY);
            Cookies.remove(this.USER_KEY);

            if (typeof document !== 'undefined') {
                document.cookie = `${this.TOKEN_KEY}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0;`;
                document.cookie = `${this.USER_KEY}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0;`;
                document.cookie = `${this.TOKEN_KEY}=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0;`;
                document.cookie = `${this.USER_KEY}=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0;`;
            }

            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                localStorage.removeItem('auth_token');
                sessionStorage.clear();
                window.dispatchEvent(new Event('auth-changed'));
                window.dispatchEvent(new Event('profile-updated'));
            }

            if (token) {
                api.post('/logout').catch(() => {});
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    }

    // ورود با شماره و رمز
    async login(phone: string, password: string) {
        const response = await api.post('/login', { phone, password });
        if (response.data.token) {
            this.setToken(response.data.token);
            this.setUser(response.data.user);
        }
        return response.data;
    }

    // ثبت‌نام با OTP
    async registerWithOtp(phone: string, code: string) {
        const response = await api.post('/register-otp', { phone, code });
        if (response.data.token) {
            this.setToken(response.data.token);
            this.setUser(response.data.user);
        }
        return response.data;
    }
}

export const auth = new AuthService();