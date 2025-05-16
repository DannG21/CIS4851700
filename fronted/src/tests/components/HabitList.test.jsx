import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthContext } from '../../context/AuthContext';
import HabitList from '../../components/habits/HabitList';
import * as habitService from '../../services/habitService';

jest.mock('../../services/habitService');

describe('HabitList Component', () => {
  const mockHabits = [
    {
      _id: '1',
      name: 'Morning Meditation',
      description: 'Meditate for 10 minutes',
      frequency: 'daily',
      goalValue: 10,
      unit: 'minutes',
      color: '#4CAF50'
    },
    {
      _id: '2',
      name: 'Exercise',
      description: 'Physical activity',
      frequency: 'daily',
      goalValue: 30,
      unit: 'minutes',
      color: '#2196F3'
    }
  ];

  const mockAuthContext = {
    user: { id: 'user123', name: 'Test User' },
    isAuthenticated: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    habitService.getHabits.mockResolvedValue(mockHabits);
  });

  test('renders habit list with correct number of habits', async () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <HabitList />
      </AuthContext.Provider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(habitService.getHabits).toHaveBeenCalled();
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    expect(screen.getByText('Morning Meditation')).toBeInTheDocument();
    expect(screen.getByText('Exercise')).toBeInTheDocument();
  });

  test('shows error message when loading habits fails', async () => {
    habitService.getHabits.mockRejectedValue(new Error('Failed to load habits'));

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <HabitList />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load habits/i)).toBeInTheDocument();
    });
  });

  test('delete button triggers delete confirmation', async () => {
    habitService.deleteHabit.mockResolvedValue({ success: true });

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <HabitList />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(habitService.deleteHabit).toHaveBeenCalledWith('1');
    });
  });
});