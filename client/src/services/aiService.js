import api from './api';

export async function suggestDescription(text) {
  const response = await api.post('/ai/suggest', { text });
  return response.data;
}
