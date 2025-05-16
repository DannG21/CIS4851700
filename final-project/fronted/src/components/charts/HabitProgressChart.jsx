import React, { useEffect, useState } from 'react';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { recordService } from '../../services/recordService';

const HabitProgressChart = ({ habitId, goal, unit, timeRange = 30 }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchRecordData = async () => {
      try {
        setLoading(true);
        
        const endDate = new Date();
        const startDate = subDays(endDate, timeRange);
        
        const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
        const emptyData = dateRange.map(date => ({
          date: format(date, 'yyyy-MM-dd'),
          displayDate: format(date, 'MMM dd'),
          value: 0
        }));
        
        const records = await recordService.getHabitRecords(habitId, {
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd')
        });
        
        const mergedData = emptyData.map(emptyDay => {
          const match = records.find(record => record.date === emptyDay.date);
          return match ? { ...emptyDay, value: match.value } : emptyDay;
        });
        
        setData(mergedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching habit records:', err);
        setError('Failed to load habit progress data');
        setLoading(false);
      }
    };

    if (habitId) {
      fetchRecordData();
    }
  }, [habitId, timeRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4 text-gray-800">Progress Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis 
            dataKey="displayDate" 
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis
            label={{ value: unit, angle: -90, position: 'insideLeft' }}
            domain={[0, Math.max(goal * 1.2, ...data.map(item => item.value))]}
          />
          <Tooltip formatter={(value) => [`${value} ${unit}`, 'Value']} />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#4CAF50"
            activeDot={{ r: 8 }}
            strokeWidth={2}
            name={`Actual (${unit})`}
          />
          {/* Goal reference line */}
          <Line
            type="monotone"
            dataKey={() => goal}
            stroke="#FF5722"
            strokeDasharray="5 5"
            strokeWidth={1}
            dot={false}
            name={`Goal (${goal} ${unit})`}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-end mt-2">
        <select 
          className="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-3 rounded leading-tight focus:outline-none focus:bg-white focus:border-green-500"
          onChange={(e) => setTimeRange(parseInt(e.target.value))}
          value={timeRange}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last year</option>
        </select>
      </div>
    </div>
  );
};

export default HabitProgressChart;