const db = require('../config/database');
const logger = require('../utils/logger');

class Habit {
  static async create({ user_id, title, description, frequency, target_count }) {
    const query = `
      INSERT INTO habits (user_id, title, description, frequency, target_count)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, [user_id, title, description, frequency, target_count]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Error creating habit: ' + error.message);
    }
  }
  
  static async findByUserId(user_id) {
    const query = 'SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await db.query(query, [user_id]);
    return result.rows;
  }
  
  static async findById(id) {
    const query = 'SELECT * FROM habits WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
  
  static async update(id, { title, description, frequency, target_count }) {
    const query = `
      UPDATE habits 
      SET title = $1, description = $2, frequency = $3, target_count = $4
      WHERE id = $5
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, [title, description, frequency, target_count, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Error updating habit: ' + error.message);
    }
  }
  
  static async delete(id) {
    const query = 'DELETE FROM habits WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
  
  static async logCompletion(habit_id, notes = '') {
    const query = `
      INSERT INTO habit_logs (habit_id, notes)
      VALUES ($1, $2)
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, [habit_id, notes]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Error logging habit completion: ' + error.message);
    }
  }
  
  static async getCompletionStats(habit_id, days = 30) {
    const query = `
      SELECT COUNT(*) as completion_count
      FROM habit_logs
      WHERE habit_id = $1
      AND completed_at >= NOW() - INTERVAL '${days} days'
    `;
    
    const result = await db.query(query, [habit_id]);
    return result.rows[0];
  }
  
  static async archive(id) {
    try {
      const result = await db.query(
        'UPDATE habits SET archived = TRUE WHERE id = $1 RETURNING *',
        [id]
      );
      
      return result.rows[0];
    } catch (err) {
      logger.error('Error archiving habit:', err);
      throw err;
    }
  }
  
  static async getWithStats(userId, startDate, endDate) {
    try {
      const query = `
        SELECT 
          h.*,
          COUNT(DISTINCT r.id) as total_records,
          SUM(CASE WHEN r.completed = TRUE THEN 1 ELSE 0 END) as completed_count,
          CASE 
            WHEN COUNT(DISTINCT r.id) > 0 
            THEN ROUND((SUM(CASE WHEN r.completed = TRUE THEN 1 ELSE 0 END)::numeric / COUNT(DISTINCT r.id)::numeric) * 100, 2) 
            ELSE 0 
          END as completion_rate,
          MAX(s.length) as longest_streak,
          CASE 
            WHEN EXISTS (
              SELECT 1 FROM streaks 
              WHERE habit_id = h.id AND current = TRUE
            ) 
            THEN (
              SELECT length FROM streaks 
              WHERE habit_id = h.id AND current = TRUE
              LIMIT 1
            )
            ELSE 0
          END as current_streak
        FROM 
          habits h
        LEFT JOIN 
          records r ON h.id = r.habit_id
          AND r.date BETWEEN $2 AND $3
        LEFT JOIN 
          streaks s ON h.id = s.habit_id
        WHERE 
          h.user_id = $1
          AND h.archived = FALSE
        GROUP BY 
          h.id
        ORDER BY 
          h.created_at DESC
      `;
      
      const result = await db.query(query, [userId, startDate, endDate]);
      return result.rows;
    } catch (err) {
      logger.error('Error getting habits with stats:', err);
      throw err;
    }
  }
}

module.exports = Habit;