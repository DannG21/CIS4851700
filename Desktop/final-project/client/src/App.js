import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';

import LoginForm from './components/LoginForm';
import HabitList from './components/HabitList';
import HabitForm from './components/HabitForm';
import HabitDetail from './components/HabitDetail';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        {/* Public login route */}
        <Route
          path="/login"
          element={<LoginForm onLogin={() => window.location.replace('/')} />}
        />

        {/* Protected root route */}
        <Route
          path="/"
          element={
            token
              ? <ProtectedApp />
              : <Navigate to="/login" replace />
          }
        />

        {/* Catch-all redirects unknown paths */}
        <Route
          path="*"
          element={<Navigate to={token ? "/" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

import Navbar from './components/Navbar';

function ProtectedApp() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);

  // Load habits on mount
  useEffect(() => {
    async function loadHabits() {
      const res = await fetch('/api/habits', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setHabits(await res.json());
      } else {
        console.error('Failed to fetch habits');
      }
    }
    loadHabits();
  }, [token]);

  // Add a new habit via POST /api/habits
  async function handleAddHabit({ name, icon, goal, unit }) {
    const res = await fetch('/api/habits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, icon, goal, unit })
    });
    if (res.ok) {
      const habit = await res.json();
      setHabits(h => [...h, habit]);
      setShowForm(false);
    } else {
      console.error('Create habit failed');
    }
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Habits</h2>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
            >
              + New Habit
            </button>
          )}
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
          />
        )}

        {selectedHabit && (
          <HabitDetail
            habit={selectedHabit}
            onClose={() => setSelectedHabit(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
