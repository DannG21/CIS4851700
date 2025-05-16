import api from './api';

export const getRecordsByHabit = async (habitId) => {
  return await api.get(`/records/habit/${habitId}`);
};

export const getRecordsByDate = async (date) => {
  return await api.get(`/records/date/${date}`);
};

export const createRecord = async (recordData) => {
  return await api.post('/records', recordData);
};

export const updateRecord = async (id, recordData) => {
  return await api.put(`/records/${id}`, recordData);
};

export const deleteRecord = async (id) => {
  return await api.delete(`/records/${id}`);
};