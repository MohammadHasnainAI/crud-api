require("dotenv").config();
const { Pool } = require("pg");

// PostgreSQL Connection Pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Create table if it doesn't exist
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        done BOOLEAN DEFAULT FALSE
      );
    `);

    // Insert sample tasks only if table is empty
    const result = await pool.query("SELECT COUNT(*) FROM tasks");

    if (parseInt(result.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO tasks (title, done)
        VALUES
        ('Learn Node.js', false),
        ('Build CRUD API', false),
        ('Practice PostgreSQL', true);
      `);
    }

    console.log("✅ PostgreSQL database connected.");
  } catch (err) {
    console.error("Database Error:", err.message);
  }
}

initializeDatabase();

module.exports = pool;