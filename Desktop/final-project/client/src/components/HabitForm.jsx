// client/src/components/HabitForm.jsx
import React, { useState } from 'react';

export default function HabitForm({ onAddHabit, onClose }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💧');
  const [goal, setGoal] = useState(1);
  const [unit, setUnit] = useState('times');

  const handleSubmit = e => {
    e.preventDefault();
    onAddHabit({ name, icon, goal: +goal, unit });
  };

  return (
    <form onSubmit={handleSubmit} className="…">
      {/* name, icon picker, goal, unit inputs */}
      <button type="submit">Create habit</button>
    </form>
  );
}