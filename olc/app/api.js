import axios from 'axios';

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/auth`,
    // withCredentials: true,
});

export const googleAuth = (code) => {
    return api.get(`/google?code=${code}`);
}
