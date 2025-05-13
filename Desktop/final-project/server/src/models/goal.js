const pool = require('../db');

class Goal {
  constructor({ id, habit_id, target_count, period }) {
    this.id = id;
    this.habit_id = habit_id;
    this.target_count = target_count;
    this.period = period;
  }

  static async listByHabit(habitId) {
    const { rows } = await pool.query(
      `SELECT * FROM goals WHERE habit_id=$1`,
      [habitId]
    );
    return rows.map(r => new Goal(r));
  }

  static async getById(habitId, id) {
    const { rows } = await pool.query(
      `SELECT * FROM goals WHERE id=$1 AND habit_id=$2`,
      [id, habitId]
    );
    return rows[0] ? new Goal(rows[0]) : null;
  }

  static async create({ habit_id, target_count, period }) {
    const { rows } = await pool.query(
      `INSERT INTO goals (habit_id, target_count, period)
       VALUES ($1, $2, $3) RETURNING *`,
      [habit_id, target_count, period]
    );
    return new Goal(rows[0]);
  }

  static async update(id, habitId, { target_count, period }) {
    const { rows } = await pool.query(
      `UPDATE goals
       SET target_count=$1, period=$2
       WHERE id=$3 AND habit_id=$4
       RETURNING *`,
      [target_count, period, id, habitId]
    );
    return rows[0] ? new Goal(rows[0]) : null;
  }

  static async patch(id, habitId, fields) {
    const keys = Object.keys(fields);
    if (!keys.length) throw new Error('No fields to patch');

    const setClauses = keys.map((k,i) => `${k}=$${i+1}`).join(', ');
    const values = keys.map(k => fields[k]).concat([id, habitId]);

    const { rows } = await pool.query(
      `UPDATE goals
       SET ${setClauses}
       WHERE id=$${keys.length+1} AND habit_id=$${keys.length+2}
       RETURNING *`,
      values
    );
    return rows[0] ? new Goal(rows[0]) : null;
  }

  static async remove(id, habitId) {
    const { rowCount } = await pool.query(
      `DELETE FROM goals WHERE id=$1 AND habit_id=$2`,
      [id, habitId]
    );
    return rowCount > 0;
  }
}

module.exports = Goal;
