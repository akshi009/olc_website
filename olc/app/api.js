import axios from 'axios';

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BASE}/auth`,
    // withCredentials: true,
});

export const googleAuth = (code) => {
    return api.get(`/google?code=${code}`);
}