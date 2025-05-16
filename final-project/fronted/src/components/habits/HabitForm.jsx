import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const HabitForm = ({ onSubmit, isSubmitting, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    frequency: 'daily',
    reminderTime: '',
    color: '#3B82F6'
  });
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        category: initialData.category || '',
        frequency: initialData.frequency || 'daily',
        reminderTime: initialData.reminderTime || '',
        color: initialData.color || '#3B82F6'
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'custom', label: 'Custom' }
  ];

  const categoryOptions = [
    'Health',
    'Fitness',
    'Learning',
    'Productivity',
    'Mindfulness',
    'Creativity',
    'Social',
    'Financial',
    'Other'
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label 
            htmlFor="name" 
            className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Habit Name *
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
          />
        </div>
        
        <div>
          <label 
            htmlFor="description" 
            className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
          ></textarea>
        </div>
        
        <div>
          <label 
            htmlFor="category" 
            className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Category
          </label>
          <select
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
          >
            <option value="">Select a category</option>
            {categoryOptions.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label 
            htmlFor="frequency" 
            className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Frequency *
          </label>
          <select
            name="frequency"
            id="frequency"
            required
            value={formData.frequency}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
          >
            {frequencyOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label 
            htmlFor="reminderTime" 
            className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Reminder Time
          </label>
          <input
            type="time"
            name="reminderTime"
            id="reminderTime"
            value={formData.reminderTime}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
          />
        </div>
        
        <div>
          <label 
            htmlFor="color" 
            className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Color
          </label>
          <input
            type="color"
            name="color"
            id="color"
            value={formData.color}
            onChange={handleChange}
            className="mt-1 block w-full h-10 rounded-md"
          />
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Habit' : 'Create Habit'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default HabitForm;