import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

const Statistics = () => {
  const api = useApi();
  const [habits, setHabits] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
  
        const habitsResponse = await api.get('/api/habits');
        setHabits(habitsResponse.data);
        
        const recordsResponse = await api.get('/api/records');
        setRecords(recordsResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching statistics data:', err);
        setError('Failed to load statistics. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [api]);

  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const weeklyCompletionData = daysOfWeek.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const completedHabits = records.filter(record => 
      record.date.split('T')[0] === dayStr && record.completed
    ).length;
    
    return {
      day: format(day, 'EEE'),
      completed: completedHabits,
    };
  });
  
  const habitCompletionData = habits.map(habit => {
    const totalRecords = records.filter(record => record.habit === habit._id).length;
    const completedRecords = records.filter(record => 
      record.habit === habit._id && record.completed
    ).length;
    
    const completionRate = totalRecords > 0 
      ? Math.round((completedRecords / totalRecords) * 100) 
      : 0;
    
    return {
      name: habit.title,
      value: completionRate,
    };
  });
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  
  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="loader"></div></div>;
  
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Habit Statistics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Weekly Completion Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Weekly Completion</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyCompletionData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" name="Completed Habits" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Habit Completion Rate Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Habit Completion Rate (%)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={habitCompletionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {habitCompletionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Top Habits Table */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Habit Performance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Habit
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Longest Streak
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Streak
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {habits.map(habit => {
                const habitCompletionData = habitCompletionData.find(data => data.name === habit.title);
                
                return (
                  <tr key={habit._id}>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {habit.title}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {habit.longestStreak || 0} days
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {habit.currentStreak || 0} days
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {habitCompletionData ? `${habitCompletionData.value}%` : '0%'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;