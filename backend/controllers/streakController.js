const Streak = require('../models/Streak');
const Habit = require('../models/Habit');
const Record = require('../models/Record');

exports.getStreak = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.habitId);
    
    if (!habit) {
      return res.status(404).json({ msg: 'Habit not found' });
    }
    
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    let streak = await Streak.findOne({ habit: req.params.habitId });
    
    if (!streak) {
      streak = new Streak({
        habit: req.params.habitId,
        currentStreak: 0,
        maxStreak: 0,
        streakStart: null,
        lastUpdated: Date.now()
      });
      await streak.save();
    }
    
    res.json(streak);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllStreaks = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id });
    
    if (habits.length === 0) {
      return res.json([]);
    }
    
    const habitIds = habits.map(habit => habit._id);
    const streaks = await Streak.find({ habit: { $in: habitIds } });
    
    const formattedStreaks = streaks.map(streak => {
      const habit = habits.find(h => h._id.toString() === streak.habit.toString());
      
      return {
        _id: streak._id,
        habit: streak.habit,
        habitName: habit.name,
        currentStreak: streak.currentStreak,
        maxStreak: streak.maxStreak,
        streakStart: streak.streakStart,
        lastUpdated: streak.lastUpdated
      };
    });
    
    res.json(formattedStreaks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.recalculateStreak = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.habitId);
    
    if (!habit) {
      return res.status(404).json({ msg: 'Habit not found' });
    }
    
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    const records = await Record.find({ habit: req.params.habitId }).sort({ date: 1 });
    
    let currentStreak = 0;
    let maxStreak = 0;
    let streakStart = null;
    let inStreak = false;
    
    for (let i = 0; i < records.length; i++) {
      if (records[i].completed) {
        if (!inStreak) {
          inStreak = true;
          streakStart = records[i].date;
          currentStreak = 1;
        } else {
          currentStreak++;
        }
        
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
        }
      } else {
        inStreak = false;
        currentStreak = 0;
      }
    }
    
    let streak = await Streak.findOne({ habit: req.params.habitId });
    
    if (streak) {
      streak.currentStreak = currentStreak;
      streak.maxStreak = maxStreak;
      streak.streakStart = streakStart;
      streak.lastUpdated = Date.now();
      await streak.save();
    } else {
      streak = new Streak({
        habit: req.params.habitId,
        currentStreak,
        maxStreak,
        streakStart,
        lastUpdated: Date.now()
      });
      await streak.save();
    }
    
    res.json(streak);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id });
    
    if (habits.length === 0) {
      return res.json([]);
    }
    
    const habitIds = habits.map(habit => habit._id);
    const streaks = await Streak.find({ habit: { $in: habitIds } })
      .sort({ currentStreak: -1 })
      .limit(10);
    
    const leaderboard = [];
    
    for (const streak of streaks) {
      const habit = habits.find(h => h._id.toString() === streak.habit.toString());
      
      if (habit) {
        leaderboard.push({
          habitId: habit._id,
          habitName: habit.name,
          currentStreak: streak.currentStreak,
          maxStreak: streak.maxStreak,
          category: habit.category
        });
      }
    }
    
    res.json(leaderboard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getStreakStats = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id });
    
    if (habits.length === 0) {
      return res.json({
        totalHabits: 0,
        habitWithLongestStreak: null,
        habitWithLongestMaxStreak: null,
        averageCurrentStreak: 0,
        averageMaxStreak: 0
      });
    }
    
    const habitIds = habits.map(habit => habit._id);
    const streaks = await Streak.find({ habit: { $in: habitIds } });
    
    if (streaks.length === 0) {
      return res.json({
        totalHabits: habits.length,
        habitWithLongestStreak: null,
        habitWithLongestMaxStreak: null,
        averageCurrentStreak: 0,
        averageMaxStreak: 0
      });
    }
    
    let longestStreak = 0;
    let longestStreakHabitId = null;
    
    let longestMaxStreak = 0;
    let longestMaxStreakHabitId = null;
    
    let totalCurrentStreak = 0;
    let totalMaxStreak = 0;
    
    streaks.forEach(streak => {
      if (streak.currentStreak > longestStreak) {
        longestStreak = streak.currentStreak;
        longestStreakHabitId = streak.habit;
      }
      
      if (streak.maxStreak > longestMaxStreak) {
        longestMaxStreak = streak.maxStreak;
        longestMaxStreakHabitId = streak.habit;
      }
      
      totalCurrentStreak += streak.currentStreak;
      totalMaxStreak += streak.maxStreak;
    });
    
    const habitWithLongestStreak = habits.find(h => h._id.toString() === longestStreakHabitId?.toString());
    const habitWithLongestMaxStreak = habits.find(h => h._id.toString() === longestMaxStreakHabitId?.toString());
    
    res.json({
      totalHabits: habits.length,
      habitWithLongestStreak: habitWithLongestStreak ? {
        id: habitWithLongestStreak._id,
        name: habitWithLongestStreak.name,
        streak: longestStreak
      } : null,
      habitWithLongestMaxStreak: habitWithLongestMaxStreak ? {
        id: habitWithLongestMaxStreak._id,
        name: habitWithLongestMaxStreak.name,
        streak: longestMaxStreak
      } : null,
      averageCurrentStreak: streaks.length > 0 ? (totalCurrentStreak / streaks.length).toFixed(1) : 0,
      averageMaxStreak: streaks.length > 0 ? (totalMaxStreak / streaks.length).toFixed(1) : 0
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};