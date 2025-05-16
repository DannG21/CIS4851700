import api from './api';

export const getStreaks = async () => {
  return await api.get('/streaks');
};

export const getStreakByHabit = async (habitId) => {
  return await api.get(`/streaks/habit/${habitId}`);
};

export const getCurrentStreak = async (habitId) => {
  return await api.get(`/streaks/current/${habitId}`);
};

export const getLongestStreak = async (habitId) => {
  return await api.get(`/streaks/longest/${habitId}`);
};