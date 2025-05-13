import React from 'react';

export default function HabitList({ habits, onHabitClick }) {
  return (
    <div className="space-y-4">
      {habits.map(habit => (
        <div
          key={habit.id}
          onClick={() => onHabitClick(habit)}
          className="…"
        >
          <span>{habit.icon}</span>
          <div>
            <h3>{habit.name}</h3>
            <p>Goal: {habit.goal} {habit.unit}/day</p>
          </div>
        </div>
      ))}
    </div>
  );
}
