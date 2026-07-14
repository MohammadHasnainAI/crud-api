const express = require("express");

const app = express();
app.use(express.json());

let todos = [];

app.get("/", (req, res) => {
  res.send("My First CRUD API");
});

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.post("/todos", (req, res) => {
  todos.push(req.body);
  res.json({ message: "Todo added" });
});

app.put("/todos/:id", (req, res) => {
  todos[req.params.id] = req.body;
  res.json({ message: "Todo updated" });
});

app.delete("/todos/:id", (req, res) => {
  todos.splice(req.params.id, 1);
  res.json({ message: "Todo deleted" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
