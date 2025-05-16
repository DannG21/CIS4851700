import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { format, subDays, eachDayOfInterval, isEqual, parseISO } from 'date-fns';
import EditHabitModal from '../components/habits/EditHabitModal';

const HabitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  
  const [habit, setHabit] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [timeframe, setTimeframe] = useState('week');

  const getDateRange = () => {
    const today = new Date();
    let startDate;
    
    switch (timeframe) {
      case 'month':
        startDate = subDays(today, 30);
        break;
      case 'year':
        startDate = subDays(today, 365);
        break;
      case 'week':
      default:
        startDate = subDays(today, 7);
    }
    
    return eachDayOfInterval({ start: startDate, end: today });
  };
  
  const dateRange = getDateRange();
  
  useEffect(() => {
    const fetchHabitDetails = async () => {
      try {
        setLoading(true);
        const habitResponse = await api.get(`/api/habits/${id}`);
        setHabit(habitResponse.data);

        const recordsResponse = await api.get(`/api/records/habit/${id}`);
        setRecords(recordsResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching habit details:', err);
        setError('Failed to load habit details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchHabitDetails();
  }, [id, api]);
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      try {
        await api.delete(`/api/habits/${id}`);
        navigate('/');
      } catch (err) {
        console.error('Error deleting habit:', err);
        setError('Failed to delete habit. Please try again later.');
      }
    }
  };
  
  const handleRecordToggle = async (date) => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');

      const existingRecord = records.find(record => 
        isEqual(parseISO(record.date.split('T')[0]), parseISO(formattedDate))
      );
      
      if (existingRecord) {
        await api.delete(`/api/records/${existingRecord._id}`);
        setRecords(records.filter(record => record._id !== existingRecord._id));
      } else {
        const newRecord = {
          habit: id,
          date: formattedDate,
          completed: true
        };
        
        const response = await api.post('/api/records', newRecord);
        setRecords([...records, response.data]);
      }
    } catch (err) {
      console.error('Error toggling record:', err);
      setError('Failed to update habit record. Please try again later.');
    }
  };
  
  const isDateCompleted = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return records.some(record => 
      isEqual(parseISO(record.date.split('T')[0]), parseISO(formattedDate)) && 
      record.completed
    );
  };
  
  const handleHabitUpdate = (updatedHabit) => {
    setHabit(updatedHabit);
    setShowEditModal(false);
  };
  
  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="loader"></div></div>;
  
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  
  if (!habit) return <div className="text-center p-4">Habit not found</div>;
  
  const completionRate = dateRange.length > 0 
    ? Math.round((dateRange.filter(date => isDateCompleted(date)).length / dateRange.length) * 100) 
    : 0;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{habit.title}</h1>
            <p className="text-gray-600 mt-1">{habit.description}</p>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowEditModal(true)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button 
              onClick={handleDelete}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex space-x-2 mb-4">
            <button 
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1 rounded ${timeframe === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1 rounded ${timeframe === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Month
            </button>
            <button 
              onClick={() => setTimeframe('year')}
              className={`px-3 py-1 rounded ${timeframe === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Year
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-2 overflow-x-auto">
            {dateRange.map((date) => (
              <div 
                key={format(date, 'yyyy-MM-dd')}
                onClick={() => handleRecordToggle(date)}
                className={`
                  cursor-pointer p-2 text-center rounded-md transition-colors
                  ${isDateCompleted(date) ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}
                `}
              >
                <div className="text-xs mb-1">{format(date, 'E')}</div>
                <div className="font-medium">{format(date, 'd')}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Current Streak</div>
              <div className="text-3xl font-bold">{habit.currentStreak || 0} days</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Longest Streak</div>
              <div className="text-3xl font-bold">{habit.longestStreak || 0} days</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Completion Rate</div>
              <div className="text-3xl font-bold">{completionRate}%</div>
            </div>
          </div>
        </div>
      </div>
      
      {showEditModal && (
        <EditHabitModal 
          habit={habit}
          onSave={handleHabitUpdate}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default HabitDetails;