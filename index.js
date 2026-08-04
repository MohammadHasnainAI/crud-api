require("dotenv").config();
const express = require("express");
const db = require("./database");

const app = express();
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "3.0",
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
app.get("/tasks", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tasks ORDER BY id");

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Task
app.get("/tasks/:id", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM tasks WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Add Task
app.post("/tasks", async (req, res) => {
  const { title, done = false } = req.body;

  if (!title) {
    return res.status(400).json({
      error: "Title is required"
    });
  }

  try {
    const result = await db.query(
      "INSERT INTO tasks(title, done) VALUES($1, $2) RETURNING id",
      [title, done]
    );

    res.status(201).json({
      message: "Task added",
      id: result.rows[0].id
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Update Task
app.put("/tasks/:id", async (req, res) => {
  const { title, done } = req.body;

  if (!title) {
    return res.status(400).json({
      error: "Title is required"
    });
  }

  try {
    const result = await db.query(
      "UPDATE tasks SET title=$1, done=$2 WHERE id=$3",
      [title, done, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    res.json({
      message: "Task updated"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Delete Task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM tasks WHERE id=$1",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});