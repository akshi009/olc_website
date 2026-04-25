import axios, { AxiosInstance, AxiosError } from 'axios';

// Get the base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============ PRODUCTS API ============
export const productsAPI = {
  getAll: async (params?: any) => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  create: async (data: FormData) => {
    const response = await apiClient.post('/products/add', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: string, data: FormData) => {
    const response = await apiClient.put(`/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  search: async (query: string) => {
    const response = await apiClient.get('/products', { params: { search: query } });
    return response.data;
  },
};

// ============ CART API ============
export const cartAPI = {
  getCart: async (userId: string) => {
    const response = await apiClient.get(`/cart/${userId}`);
    return response.data;
  },

  addToCart: async (userId: string, productId: string, quantity: number) => {
    const response = await apiClient.post('/cart/add', {
      userId,
      productId,
      quantity,
    });
    return response.data;
  },

  updateCart: async (userId: string, productId: string, quantity: number) => {
    const response = await apiClient.put('/cart/update', {
      userId,
      productId,
      quantity,
    });
    return response.data;
  },

  removeFromCart: async (userId: string, productId: string) => {
    const response = await apiClient.delete('/cart/remove', {
      data: { userId, productId },
    });
    return response.data;
  },

  clearCart: async (userId: string) => {
    const response = await apiClient.delete('/cart/clear', {
      data: { userId },
    });
    return response.data;
  },
};

// ============ WISHLIST API ============
export const wishlistAPI = {
  getWishlist: async (userId: string) => {
    const response = await apiClient.get(`/wishlist/${userId}`);
    return response.data;
  },

  addToWishlist: async (userId: string, productId: string) => {
    const response = await apiClient.post('/wishlist/add', {
      userId,
      productId,
    });
    return response.data;
  },

  removeFromWishlist: async (userId: string, productId: string) => {
    const response = await apiClient.delete('/wishlist/remove', {
      data: { userId, productId },
    });
    return response.data;
  },
};

// ============ PROFILE API ============
export const profileAPI = {
  getProfile: async (userId: string) => {
    const response = await apiClient.get(`/profile/${userId}`);
    return response.data;
  },

  updateProfile: async (userId: string, data: any) => {
    const response = await apiClient.put(`/profile/${userId}`, data);
    return response.data;
  },

  updatePassword: async (userId: string, oldPassword: string, newPassword: string) => {
    const response = await apiClient.post(`/profile/${userId}/change-password`, {
      oldPassword,
      newPassword,
    });
    return response.data;
  },
};

// ============ ORDERS API ============
export const ordersAPI = {
  getOrders: async (userId: string) => {
    const response = await apiClient.get(`/orders/${userId}`);
    return response.data;
  },

  getOrderById: async (orderId: string) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  createPayment: async (data: any) => {
    const response = await apiClient.post('/orders/create-payment', data);
    return response.data;
  },

  verifyPayment: async (data: any) => {
    const response = await apiClient.post('/orders/verify-payment', data);
    return response.data;
  },

  createOrder: async (data: any) => {
    const response = await apiClient.post('/orders', data);
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await apiClient.put(`/orders/${orderId}`, { status });
    return response.data;
  },

  cancelOrder: async (orderId: string) => {
    const response = await apiClient.post(`/orders/${orderId}/cancel`, {});
    return response.data;
  },
};

// ============ EVENTS API ============
export const eventsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/events');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  },

  create: async (data: FormData) => {
    const response = await apiClient.post('/events', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: string, data: FormData) => {
    const response = await apiClient.put(`/events/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/events/${id}`);
    return response.data;
  },
};

// ============ AUTH API ============
export const authAPI = {
  googleLogin: async (code: string) => {
    const response = await apiClient.get(`/auth/google?code=${code}`);
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
  },
};

export default apiClient;
