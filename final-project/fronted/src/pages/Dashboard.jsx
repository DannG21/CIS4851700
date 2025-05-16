import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';
import HabitList from '../components/habits/HabitList';

const Dashboard = () => {
  const api = useApi();
  const [habits, setHabits] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddHabit, setShowAddHabit] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const habitsResponse = await api.get('/api/habits');
        setHabits(habitsResponse.data);

        const today = format(new Date(), 'yyyy-MM-dd');
        const recordsResponse = await api.get(`/api/records/date/${today}`);
        setRecords(recordsResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDashboard();
  }, [api]);

  const groupedHabits = habits.reduce((acc, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = [];
    }
    acc[habit.category].push(habit);
    return acc;
  }, {});

  const handleToggleCompletion = async (habitId) => {
    try {
      const isCompleted = records.some(record => 
        record.habit === habitId && record.completed
      );
      
      if (isCompleted) {
        const record = records.find(r => r.habit === habitId);
        await api.delete(`/api/records/${record._id}`);
        setRecords(records.filter(r => r._id !== record._id));
      } else {
        const newRecord = {
          habit: habitId,
          date: format(new Date(), 'yyyy-MM-dd'),
          completed: true
        };
        
        const response = await api.post('/api/records', newRecord);
        setRecords([...records, response.data]);
      }
    } catch (err) {
      console.error('Error toggling completion:', err);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="loader"></div></div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={() => setShowAddHabit(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Habit
        </button>
      </div>

      {/* Today's date */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Today: {format(new Date(), 'EEEE, MMMM d, yyyy')}</h2>
      </div>

      {/* Habits for today */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Today's Habits</h2>
        <HabitList 
          habits={habits} 
          records={records}
          onToggleCompletion={handleToggleCompletion}
        />
      </div>

      {/* Habit categories */}
      <div className="space-y-8">
        {Object.keys(groupedHabits).map(category => (
          <div key={category} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">{category || 'Uncategorized'}</h2>
            <div className="space-y-4">
              {groupedHabits[category].map(habit => {
                const isCompleted = records.some(
                  record => record.habit === habit._id && record.completed
                );
                
                return (
                  <div key={habit._id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <div>
                      <h3 className="font-semibold">{habit.title}</h3>
                      <p className="text-sm text-gray-500">{habit.description}</p>
                    </div>
                    <button
                      onClick={() => handleToggleCompletion(habit._id)}
                      className={`px-3 py-1 rounded ${
                        isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {isCompleted ? 'Completed' : 'Mark Complete'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;