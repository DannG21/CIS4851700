import React, { useState, useEffect } from 'react';
import habitsData from './server/src/models/habit';
import entriesData from './server/src/models/entry';
import HabitList from './components/HabitList';
import HabitForm from './components/HabitForm';
import HabitDetail from './components/HabitDetail';

const App = () => {
  const [habits, setHabits] = useState(habitsData);
  const [entries, setEntries] = useState(entriesData);
  const [showForm, setShowForm] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);

  useEffect(() => {
    // Load from localStorage if available
    const savedHabits = JSON.parse(localStorage.getItem('habits'));
    const savedEntries = JSON.parse(localStorage.getItem('entries'));
    
    if (savedHabits && savedHabits.length > 0) {
      setHabits(savedHabits);
    }
    
    if (savedEntries && savedEntries.length > 0) {
      setEntries(savedEntries);
    }
  }, []);

  useEffect(() => {
    // Save to localStorage when data changes
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('entries', JSON.stringify(entries));
  }, [habits, entries]);

  const handleAddHabit = (newHabit) => {
    setHabits([...habits, newHabit]);
    setShowForm(false);
  };

  const handleAddEntry = (newEntry) => {
    setEntries([...entries, newEntry]);
  };

  const getStreak = (habitId) => {
    const dates = entries
      .filter(e => e.habitId === habitId)
      .map(e => e.date)
      .sort()
      .reverse();
    
    let streak = 0;
    let currentDate = new Date();
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (dates.includes(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">HabitHero</h1>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Habits</h2>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            + New Habit
          </button>
        </div>
        
        {showForm ? (
          <HabitForm 
            onAddHabit={handleAddHabit} 
            onClose={() => setShowForm(false)} 
          />
        ) : (
          <HabitList 
            habits={habits} 
            onHabitClick={setSelectedHabit}
            streak={getStreak}
          />
        )}
        
        {selectedHabit && (
          <HabitDetail
            habit={selectedHabit}
            onClose={() => setSelectedHabit(null)}
            onAddEntry={handleAddEntry}
            streak={getStreak(selectedHabit.id)}
          />
        )}
      </main>
    </div>
  );
};

export default App;