# CRUD API with PostgreSQL & Docker

A simple CRUD API built with Node.js, Express, PostgreSQL, and Docker.

## Features

- Create tasks
- Read all tasks
- Read a single task
- Update tasks
- Delete tasks
- PostgreSQL database
- Docker Compose support
- Environment variables using .env

## Technologies

- Node.js
- Express
- PostgreSQL
- Docker
- Docker Compose

## Setup

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Create a `.env` file from `.env.example`

4. Start PostgreSQL

```bash
docker compose up -d
```

5. Start the server

```bash
node index.js
```

## API

- GET /tasks
- GET /tasks/:id
- POST /tasks
- PUT /tasks/:id
- DELETE /tasks/:id

## Docker

The PostgreSQL database runs inside Docker and stores data using a Docker volume, so the data remains after restarting the container.

## Author

Mohammad Hasnain