const pool = require('../db');

class Habit {
  constructor({ id, user_id, name, description, created_at }) {
    this.id = id;
    this.user_id = user_id;
    this.name = name;
    this.description = description;
    this.created_at = created_at;
  }

  static async listByUser(userId) {
    const { rows } = await pool.query(
      `SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return rows.map(r => new Habit(r));
  }

  static async getById(userId, id) {
    const { rows } = await pool.query(
      `SELECT * FROM habits WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return rows[0] ? new Habit(rows[0]) : null;
  }

  static async create({ user_id, name, description }) {
    const { rows } = await pool.query(
      `INSERT INTO habits (user_id, name, description)
       VALUES ($1, $2, $3) RETURNING *`,
      [user_id, name, description]
    );
    return new Habit(rows[0]);
  }

  static async update(id, userId, { name, description }) {
    const { rows } = await pool.query(
      `UPDATE habits SET name=$1, description=$2
       WHERE id=$3 AND user_id=$4
       RETURNING *`,
      [name, description, id, userId]
    );
    return rows[0] ? new Habit(rows[0]) : null;
  }

  static async patch(id, userId, fields) {
    const keys = Object.keys(fields);
    if (!keys.length) throw new Error('No fields to patch');

    const setClauses = keys.map((k, i) => `${k}=$${i+1}`).join(', ');
    const values = keys.map(k => fields[k]).concat([id, userId]);

    const { rows } = await pool.query(
      `UPDATE habits SET ${setClauses}
       WHERE id=$${keys.length+1} AND user_id=$${keys.length+2}
       RETURNING *`,
      values
    );
    return rows[0] ? new Habit(rows[0]) : null;
  }

  static async remove(id, userId) {
    const { rowCount } = await pool.query(
      `DELETE FROM habits WHERE id=$1 AND user_id=$2`,
      [id, userId]
    );
    return rowCount > 0;
  }
}

module.exports = Habit;
