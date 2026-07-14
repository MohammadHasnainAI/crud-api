const express = require("express");

const app = express();
app.use(express.json());

let tasks = [];

// Home Route
app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
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
  res.status(200).json(tasks);
});

// Add Task
app.post("/tasks", (req, res) => {
  if (!req.body.task) {
    return res.status(400).json({
      error: "Task is required"
    });
  }

  tasks.push(req.body);

  res.status(201).json({
    message: "Task added"
  });
});

// Update Task
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!tasks[id]) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  if (!req.body.task) {
    return res.status(400).json({
      error: "Task is required"
    });
  }

  tasks[id] = req.body;

  res.status(200).json({
    message: "Task updated"
  });
});

// Delete Task
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!tasks[id]) {
    return res.status(404).json({
      error: "Task not found"
    });
  }

  tasks.splice(id, 1);

  res.status(204).send();
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
