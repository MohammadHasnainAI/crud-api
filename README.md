# Task API with SQLite

## Description
This project is a CRUD API built with Node.js, Express, and SQLite.

## Why SQLite?
SQLite is lightweight, easy to use, and stores data in a single file.

## Database
The database file is:
```
tasks.db
```

## How to Run

```bash
npm install
node index.js
```

The database is automatically created if it does not exist.

## API Endpoints

- GET /tasks
- GET /tasks/:id
- POST /tasks
- PUT /tasks/:id
- DELETE /tasks/:id

## Example SQL Query

```sql
SELECT * FROM tasks;
```

## Screenshot

(Add your DB Browser screenshot here.)
