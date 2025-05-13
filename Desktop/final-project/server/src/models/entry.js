const pool = require('../db');

class Entry {
  constructor({ id, habit_id, entry_date, completed, notes }) {
    this.id = id;
    this.habit_id = habit_id;
    this.entry_date = entry_date;
    this.completed = completed;
    this.notes = notes;
  }

  static async listByHabit(habitId) {
    const { rows } = await pool.query(
      `SELECT * FROM entries WHERE habit_id=$1 ORDER BY entry_date DESC`,
      [habitId]
    );
    return rows.map(r => new Entry(r));
  }

  static async getById(habitId, id) {
    const { rows } = await pool.query(
      `SELECT * FROM entries WHERE id=$1 AND habit_id=$2`,
      [id, habitId]
    );
    return rows[0] ? new Entry(rows[0]) : null;
  }

  static async create({ habit_id, entry_date, completed = false, notes = null }) {
    const { rows } = await pool.query(
      `INSERT INTO entries (habit_id, entry_date, completed, notes)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [habit_id, entry_date, completed, notes]
    );
    return new Entry(rows[0]);
  }

  static async update(id, habitId, { entry_date, completed, notes }) {
    const { rows } = await pool.query(
      `UPDATE entries
       SET entry_date=$1, completed=$2, notes=$3
       WHERE id=$4 AND habit_id=$5
       RETURNING *`,
      [entry_date, completed, notes, id, habitId]
    );
    return rows[0] ? new Entry(rows[0]) : null;
  }

  static async patch(id, habitId, fields) {
    const keys = Object.keys(fields);
    if (!keys.length) throw new Error('No fields to patch');

    const setClauses = keys.map((k,i) => `${k}=$${i+1}`).join(', ');
    const values = keys.map(k => fields[k]).concat([id, habitId]);

    const { rows } = await pool.query(
      `UPDATE entries
       SET ${setClauses}
       WHERE id=$${keys.length+1} AND habit_id=$${keys.length+2}
       RETURNING *`,
      values
    );
    return rows[0] ? new Entry(rows[0]) : null;
  }

  static async remove(id, habitId) {
    const { rowCount } = await pool.query(
      `DELETE FROM entries WHERE id=$1 AND habit_id=$2`,
      [id, habitId]
    );
    return rowCount > 0;
  }
}

module.exports = Entry;
