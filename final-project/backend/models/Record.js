const db = require('../config/database');
const logger = require('../utils/logger');

class Record {
  static async createOrUpdate(recordData) {
    try {
      const existingRecord = await db.query(
        'SELECT * FROM records WHERE habit_id = $1 AND date = $2',
        [recordData.habit_id, recordData.date]
      );
      
      if (existingRecord.rows.length > 0) {
        const result = await db.query(
          `UPDATE records 
          SET completed = $1, completion_time = $2, notes = $3 
          WHERE habit_id = $4 AND date = $5 
          RETURNING *`,
          [
            recordData.completed,
            recordData.completed ? new Date() : null,
            recordData.notes || null,
            recordData.habit_id,
            recordData.date
          ]
        );
        
        return result.rows[0];
      } else {
        const result = await db.query(
          `INSERT INTO records 
          (habit_id, date, completed, completion_time, notes) 
          VALUES ($1, $2, $3, $4, $5) 
          RETURNING *`,
          [
            recordData.habit_id,
            recordData.date,
            recordData.completed,
            recordData.completed ? new Date() : null,
            recordData.notes || null
          ]
        );
        
        return result.rows[0];
      }
    } catch (err) {
      logger.error('Error creating or updating record:', err);
      throw err;
    }
  }
  
  static async findById(id) {
    try {
      const result = await db.query(
        'SELECT * FROM habit_logs WHERE id = $1',
        [id]
      );
      
      return result.rows[0];
    } catch (err) {
      logger.error('Error finding record by ID:', err);
      throw err;
    }
  }
  
  static async findByHabitAndDate(habitId, date) {
    try {
      const result = await db.query(
        'SELECT * FROM records WHERE habit_id = $1 AND date = $2',
        [habitId, date]
      );
      
      return result.rows[0];
    } catch (err) {
      logger.error('Error finding record by habit and date:', err);
      throw err;
    }
  }
  
  static async findByHabitId(habitId) {
    try {
      const result = await db.query(
        'SELECT * FROM habit_logs WHERE habit_id = $1 ORDER BY completed_at DESC',
        [habitId]
      );
      return result.rows;
    } catch (error) {
      throw new Error('Error finding records: ' + error.message);
    }
  }
  
  static async findByUserIdAndDateRange(userId, startDate, endDate) {
    try {
      const query = `
        SELECT 
          r.* 
        FROM 
          records r
        JOIN 
          habits h ON r.habit_id = h.id
        WHERE 
          h.user_id = $1
          AND r.date BETWEEN $2 AND $3
        ORDER BY 
          r.date DESC
      `;
      
      const result = await db.query(query, [userId, startDate, endDate]);
      
      return result.rows;
    } catch (err) {
      logger.error('Error finding records by user ID and date range:', err);
      throw err;
    }
  }
  
  static async update(id, recordData) {
    const { notes } = recordData;
    try {
      const result = await db.query(
        `UPDATE habit_logs 
        SET notes = $1,
            completed_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *`,
        [notes, id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error('Error updating record: ' + error.message);
    }
  }
  
  static async delete(id) {
    try {
      await db.query('DELETE FROM habit_logs WHERE id = $1', [id]);
      return true;
    } catch (error) {
      throw new Error('Error deleting record: ' + error.message);
    }
  }
  
  static async getByDateForUser(userId, date) {
    try {
      const query = `
        SELECT 
          h.id as habit_id, 
          h.name as habit_name, 
          h.frequency,
          h.target_days,
          h.color,
          h.icon,
          r.id as record_id,
          r.date,
          r.completed,
          r.completion_time,
          r.notes
        FROM 
          habits h
        LEFT JOIN 
          records r ON h.id = r.habit_id AND r.date = $2
        WHERE 
          h.user_id = $1
          AND h.archived = FALSE
          AND (
            (h.frequency = 'daily') OR
            (h.frequency = 'weekly' AND $2::timestamp::date - h.start_date::date % 7 = 0) OR
            (h.frequency = 'monthly' AND EXTRACT(DAY FROM $2::timestamp) = EXTRACT(DAY FROM h.start_date)) OR
            (h.frequency = 'custom' AND EXTRACT(DOW FROM $2::timestamp) = ANY(h.target_days))
          )
        ORDER BY 
          h.created_at
      `;
      
      const result = await db.query(query, [userId, date]);
      
      return result.rows;
    } catch (err) {
      logger.error('Error getting records by date for user:', err);
      throw err;
    }
  }
  
  static async getDailyCompletionRate(userId, startDate, endDate) {
    try {
      const query = `
        WITH date_series AS (
          SELECT generate_series($2::date, $3::date, '1 day'::interval)::date AS date
        ),
        daily_stats AS (
          SELECT 
            ds.date,
            COUNT(DISTINCT h.id) AS total_habits,
            COUNT(DISTINCT CASE WHEN r.completed = TRUE THEN r.id END) AS completed_habits
          FROM 
            date_series ds
          CROSS JOIN 
            habits h
          LEFT JOIN 
            records r ON h.id = r.habit_id AND ds.date = r.date
          WHERE 
            h.user_id = $1
            AND h.archived = FALSE
            AND (
              (h.frequency = 'daily') OR
              (h.frequency = 'weekly' AND ds.date - h.start_date::date % 7 = 0) OR
              (h.frequency = 'monthly' AND EXTRACT(DAY FROM ds.date) = EXTRACT(DAY FROM h.start_date)) OR
              (h.frequency = 'custom' AND EXTRACT(DOW FROM ds.date) = ANY(h.target_days))
            )
            AND ds.date >= h.start_date
            AND (h.end_date IS NULL OR ds.date <= h.end_date)
          GROUP BY 
            ds.date
        )
        SELECT 
          date,
          total_habits,
          completed_habits,
          CASE 
            WHEN total_habits > 0 
            THEN ROUND((completed_habits::numeric / total_habits::numeric) * 100, 2) 
            ELSE 0 
          END as completion_rate
        FROM 
          daily_stats
        ORDER BY 
          date
      `;
      
      const result = await db.query(query, [userId, startDate, endDate]);
      
      return result.rows;
    } catch (err) {
      logger.error('Error calculating daily completion rate:', err);
      throw err;
    }
  }

  static async findByDateRange(habitId, startDate, endDate) {
    try {
      const result = await db.query(
        `SELECT * FROM habit_logs 
        WHERE habit_id = $1 
        AND completed_at >= $2 
        AND completed_at <= $3
        ORDER BY completed_at ASC`,
        [habitId, startDate, endDate]
      );
      return result.rows;
    } catch (error) {
      throw new Error('Error finding records by date range: ' + error.message);
    }
  }
}

module.exports = Record;