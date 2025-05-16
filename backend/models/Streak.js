const db = require('../config/db');
const logger = require('../utils/logger');

class Streak {
  static async create(streakData) {
    try {
      const result = await db.query(
        `INSERT INTO streaks 
        (habit_id, start_date, end_date, current, length) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`,
        [
          streakData.habit_id,
          streakData.start_date,
          streakData.end_date || null,
          streakData.current || true,
          streakData.length
        ]
      );
      
      return result.rows[0];
    } catch (err) {
      logger.error('Error creating streak:', err);
      throw err;
    }
  }
  
  static async findById(id) {
    try {
      const result = await db.query(
        'SELECT * FROM streaks WHERE id = $1',
        [id]
      );
      
      return result.rows[0];
    } catch (err) {
      logger.error('Error finding streak by ID:', err);
      throw err;
    }
  }
  
  static async findByHabitId(habitId) {
    try {
      const result = await db.query(
        'SELECT * FROM streaks WHERE habit_id = $1 ORDER BY start_date DESC',
        [habitId]
      );
      
      return result.rows;
    } catch (err) {
      logger.error('Error finding streaks by habit ID:', err);
      throw err;
    }
  }
  
  static async getCurrentStreak(habitId) {
    try {
      const result = await db.query(
        'SELECT * FROM streaks WHERE habit_id = $1 AND current = TRUE',
        [habitId]
      );
      
      return result.rows[0] || { length: 0 };
    } catch (err) {
      logger.error('Error getting current streak:', err);
      throw err;
    }
  }
  
  static async update(id, streakData) {
    try {
      const result = await db.query(
        `UPDATE streaks 
        SET end_date = $1, current = $2, length = $3 
        WHERE id = $4 
        RETURNING *`,
        [
          streakData.end_date || null,
          streakData.current !== undefined ? streakData.current : true,
          streakData.length,
          id
        ]
      );
      
      return result.rows[0];
    } catch (err) {
      logger.error('Error updating streak:', err);
      throw err;
    }
  }
  
  static async endCurrentStreak(habitId, endDate, finalLength) {
    try {
      const result = await db.query(
        `UPDATE streaks 
        SET end_date = $1, current = FALSE, length = $3 
        WHERE habit_id = $2 AND current = TRUE 
        RETURNING *`,
        [endDate, habitId, finalLength]
      );
      
      return result.rows[0];
    } catch (err) {
      logger.error('Error ending current streak:', err);
      throw err;
    }
  }
  
  static async calculateStreaks(habitId) {
    try {
      const habitResult = await db.query(
        'SELECT * FROM habits WHERE id = $1',
        [habitId]
      );
      
      if (habitResult.rows.length === 0) {
        logger.warn(`Habit ${habitId} not found when calculating streaks`);
        return null;
      }
      
      const habit = habitResult.rows[0];
      
      let recordsQuery = `
        SELECT 
          * 
        FROM 
          records 
        WHERE 
          habit_id = $1
        ORDER BY 
          date ASC
      `;
      
      const recordsResult = await db.query(recordsQuery, [habitId]);
      const records = recordsResult.rows;
      
      if (records.length === 0) {
        return null;
      }
      
      await db.query(
        `UPDATE streaks 
        SET current = FALSE 
        WHERE habit_id = $1 AND current = TRUE`,
        [habitId]
      );
      
      let currentStreakStart = null;
      let currentStreakLength = 0;
      let streaks = [];
      
      const shouldConsiderDate = (date) => {
        const dateObj = new Date(date);
        
        switch (habit.frequency) {
          case 'daily':
            return true;
          case 'weekly':
            const startDay = new Date(habit.start_date).getDay();
            return dateObj.getDay() === startDay;
          case 'monthly':
            const startDate = new Date(habit.start_date).getDate();
            return dateObj.getDate() === startDate;
          case 'custom':
            return habit.target_days.includes(dateObj.getDay());
          default:
            return false;
        }
      };
      
      for (let i = 0; i < records.length; i++) {
        const record = records[i];
        
        if (record.completed && shouldConsiderDate(record.date)) {
          if (currentStreakStart === null) {
            currentStreakStart = record.date;
            currentStreakLength = 1;
          } else {
            currentStreakLength++;
          }
        } else if (currentStreakStart !== null) {
          streaks.push({
            habit_id: habitId,
            start_date: currentStreakStart,
            end_date: records[i-1].date,
            current: false,
            length: currentStreakLength
          });
          
          currentStreakStart = null;
          currentStreakLength = 0;
        }
      }
      
      if (currentStreakStart !== null) {
        streaks.push({
          habit_id: habitId,
          start_date: currentStreakStart,
          end_date: null,
          current: true,
          length: currentStreakLength
        });
      }
      
      for (const streak of streaks) {
        await this.create(streak);
      }
      
      return streaks;
    } catch (err) {
      logger.error('Error calculating streaks:', err);
      throw err;
    }
  }
  
  static async getStreakStats(userId) {
    try {
      const query = `
        SELECT 
          h.id as habit_id,
          h.name as habit_name,
          MAX(s.length) as longest_streak,
          COALESCE(
            (SELECT length FROM streaks WHERE habit_id = h.id AND current = TRUE LIMIT 1),
            0
          ) as current_streak
        FROM 
          habits h
        LEFT JOIN 
          streaks s ON h.id = s.habit_id
        WHERE 
          h.user_id = $1
          AND h.archived = FALSE
        GROUP BY 
          h.id, h.name
        ORDER BY 
          longest_streak DESC
      `;
      
      const result = await db.query(query, [userId]);
      
      return result.rows;
    } catch (err) {
      logger.error('Error getting streak stats:', err);
      throw err;
    }
  }
  
  static async delete(id) {
    try {
      await db.query(
        'DELETE FROM streaks WHERE id = $1',
        [id]
      );
      
      return true;
    } catch (err) {
      logger.error('Error deleting streak:', err);
      throw err;
    }
  }
}

module.exports = Streak;