import api from './api';

export const getHabits = async () => {
  return await api.get('/habits');
};

export const getHabit = async (id) => {
  return await api.get(`/habits/${id}`);
};

export const createHabit = async (habitData) => {
  return await api.post('/habits', habitData);
};

export const updateHabit = async (id, habitData) => {
  return await api.put(`/habits/${id}`, habitData);
};

export const deleteHabit = async (id) => {
  return await api.delete(`/habits/${id}`);
};