import axios from 'axios';

// Configure a URL base da API - ajuste conforme necessário
// const API_BASE_URL = 'http://localhost:3000';
const API_BASE_URL = 'http://192.168.5.27:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Serviços para Clientes
export const clienteService = {
  getAll: () => api.get('/clientes'),
  getById: (id) => api.get(`/clientes/${id}`),
  create: (cliente) => api.post('/clientes', cliente),
  update: (id, cliente) => api.put(`/clientes/${id}`, cliente),
  delete: (id) => api.delete(`/clientes/${id}`),
};

// Serviços para Vagas
export const vagaService = {
  getAll: () => api.get('/vagas'),
  getById: (id) => api.get(`/vagas/${id}`),
  create: (vaga) => api.post('/vagas', vaga),
  update: (id, vaga) => api.put(`/vagas/${id}`, vaga),
  delete: (id) => api.delete(`/vagas/${id}`),
};

// Serviços para Veículos
export const veiculoService = {
  getAll: () => api.get('/veiculos'),
  getById: (id) => api.get(`/veiculos/${id}`),
  create: (veiculo) => api.post('/veiculos', veiculo),
  update: (id, veiculo) => api.put(`/veiculos/${id}`, veiculo),
  delete: (id) => api.delete(`/veiculos/${id}`),
};

export default api;

