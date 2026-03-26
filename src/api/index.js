import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: BASE ? `${BASE}/api` : '/api',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('acervo_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('acervo_token');
      localStorage.removeItem('acervo_user');
      if (window.location.pathname.startsWith('/admin')) window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const changePassword = (data) => api.post('/auth/change-password', data);

// Collections
export const getCollections = () => api.get('/collections');
export const getAllCollections = () => api.get('/collections/all');
export const getCollection = (slug) => api.get(`/collections/${slug}`);
export const createCollection = (data) => api.post('/collections', data);
export const updateCollection = (id, data) => api.put(`/collections/${id}`, data);
export const deleteCollection = (id) => api.delete(`/collections/${id}`);

// Albums
export const getAlbums = (collectionId) => api.get('/albums', { params: { collection_id: collectionId } });
export const getAllAlbums = (collectionId) => api.get('/albums/all', { params: { collection_id: collectionId } });
export const getAlbum = (id) => api.get(`/albums/${id}`);
export const createAlbum = (data) => api.post('/albums', data);
export const updateAlbum = (id, data) => api.put(`/albums/${id}`, data);
export const deleteAlbum = (id) => api.delete(`/albums/${id}`);

// Images
export const getImages = (albumId) => api.get('/images', { params: { album_id: albumId } });
export const getImage = (id) => api.get(`/images/${id}`);
export const uploadImages = (albumId, files, onProgress) => {
  const form = new FormData();
  form.append('album_id', albumId);
  files.forEach(f => form.append('images', f));
  return api.post('/images/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress,
  });
};
export const updateImage = (id, data) => api.put(`/images/${id}`, data);
export const updateImageMetadata = (id, data) => api.put(`/images/${id}/metadata`, data);
export const deleteImage = (id) => api.delete(`/images/${id}`);
export const reorderImages = (orders) => api.post('/images/reorder', { orders });
export const searchImages = (q) => api.get('/images/search/q', { params: { q } });

// Settings
export const getSettings = (key) => api.get(`/settings/${key}`);
export const updateSettings = (key, value) => api.put(`/settings/${key}`, { value });

// Cover upload
export const uploadCover = (file, type, id) => {
  const form = new FormData();
  form.append('cover', file);
  form.append('type', type);
  if (id) form.append('id', id);
  return api.post('/upload/cover', form, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export default api;
