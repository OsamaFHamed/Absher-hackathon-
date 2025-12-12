import axios from 'axios';

const API_BASE_URL = 'https://check-docs-absher-mvp--TryServify.replit.app';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const registerDocument = async (issuerName, file) => {
  const formData = new FormData();
  formData.append('issuer', issuerName);
  formData.append('file', file);
  
  const response = await api.post('/register', formData);
  return response.data;
};

export const revokeDocument = async (documentHash) => {
  const formData = new FormData();
  formData.append('hash', documentHash);
  
  const response = await api.post('/revoke', formData);
  return response.data;
};

export const verifyDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/verify-document', formData);
  return response.data;
};

export const analyzeDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/analyze', formData);
  return response.data;
};

export const getRegistry = async () => {
  const response = await api.get('/registry');
  return response.data;
};

export const getLedger = async () => {
  const response = await api.get('/ledger');
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const getRegistryStats = async () => {
  const response = await api.get('/registry/stats');
  return response.data;
};

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
