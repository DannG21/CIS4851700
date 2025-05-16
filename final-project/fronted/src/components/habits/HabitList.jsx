import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { ThemeContext } from '../../context/ThemeContext';
import EditHabitModal from './EditHabitModal';

const HabitList = ({ habits, setHabits }) => {
  const [editingHabit, setEditingHabit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const api = useApi();
  const { darkMode } = useContext(ThemeContext);

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        await api.delete(`/habits/${id}`);
        setHabits(habits.filter(habit => habit.id !== id));
      } catch (err) {
        setError('Failed to delete habit');
        console.error(err);
      }
    }
  };

  const handleHabitUpdated = (updatedHabit) => {
    setHabits(habits.map(habit => 
      habit.id === updatedHabit.id ? updatedHabit : habit
    ));
    setIsModalOpen(false);
  };

  if (habits.length === 0) {
    return (
      <div className={`text-center py-6 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
        <p className="mb-4">You haven't created any habits yet.</p>
        <p>Click the "Add Habit" button to get started!</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`bg-${darkMode ? 'gray-700' : 'gray-50'}`}>
            <tr>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Habit
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Category
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Frequency
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Created
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-${darkMode ? 'gray-700' : 'gray-200'}`}>
            {habits.map((habit) => (
              <tr key={habit.id}>
                <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Link to={`/habits/${habit.id}`} className="hover:text-indigo-600">
                    {habit.name}
                  </Link>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  {habit.category}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  {habit.frequency}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  {new Date(habit.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleEdit(habit)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(habit.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {editingHabit && (
        <EditHabitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onHabitUpdated={handleHabitUpdated}
          habit={editingHabit}
        />
      )}
    </div>
  );
};

export default HabitList;