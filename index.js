const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database("./tasks.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create table with title and done columns
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER DEFAULT 0
    )
  `);

  db.get("SELECT COUNT(*) AS count FROM tasks", (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }

    if (row.count === 0) {
      db.run("INSERT INTO tasks (title, done) VALUES ('Learn Node.js', 0)");
      db.run("INSERT INTO tasks (title, done) VALUES ('Build CRUD API', 0)");
      db.run("INSERT INTO tasks (title, done) VALUES ('Learn SQLite', 0)");
    }
  });
});

// Home Route
app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "2.0",
    endpoints: ["/tasks", "/health"]
  });
});

// Health Route
app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

// Get All Tasks
app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const tasks = rows.map(task => ({
      id: task.id,
      title: task.title,
      done: Boolean(task.done)
    }));

    res.status(200).json(tasks);
  });
});

// Get Single Task
app.get("/tasks/:id", (req, res) => {
  db.get(
    "SELECT * FROM tasks WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!row) {
        return res.status(404).json({
          error: "Task not found"
        });
      }

      res.json({
        id: row.id,
        title: row.title,
        done: Boolean(row.done)
      });
    }
  );
});

// Add Task
app.post("/tasks", (req, res) => {
  const { title, done = false } = req.body;

  if (!title) {
    return res.status(400).json({
      error: "Title is required"
    });
  }

  db.run(
    "INSERT INTO tasks (title, done) VALUES (?, ?)",
    [title, done ? 1 : 0],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.status(201).json({
        message: "Task added",
        id: this.lastID
      });
    }
  );
});

// Update Task
app.put("/tasks/:id", (req, res) => {
  const { title, done } = req.body;

  if (!title) {
    return res.status(400).json({
      error: "Title is required"
    });
  }

  db.run(
    "UPDATE tasks SET title = ?, done = ? WHERE id = ?",
    [title, done ? 1 : 0, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          error: "Task not found"
        });
      }

      res.json({
        message: "Task updated"
      });
    }
  );
});

// Delete Task
app.delete("/tasks/:id", (req, res) => {
  db.run(
    "DELETE FROM tasks WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          error: "Task not found"
        });
      }

      res.status(204).send();
    }
  );
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});