# Manufacturing Inventory Tracker

A small full-stack web application for tracking materials used in bottle production.

## Tech Stack

- React frontend
- Node.js and Express backend
- PostgreSQL database
- Chart.js dashboard charts

## Project Structure

```text
manufacturing-inventory-tracker/
  client/       React app
  server/       Express API
  database/     PostgreSQL schema and seed data
  README.md
```

## Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE manufacturing_inventory;
```

2. Run the schema and seed file:

```bash
psql -d manufacturing_inventory -f database/schema.sql
```

## Backend Setup

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Update `.env` if your PostgreSQL username, password, host, port, or database name is different.

The API runs on `http://localhost:5000`.

## Frontend Setup

Open another terminal:

```bash
cd client
npm install
npm run dev
```

The React app runs on `http://localhost:5173`.

## Useful Commands

Install both apps from the root:

```bash
npm run install:all
```

Run frontend and backend together from the root:

```bash
npm install
npm run dev
```

## Main Features

- Dashboard totals for materials, low stock items, and total stock value
- Bar chart showing stock by material
- Add, edit, delete, and view materials
- Record stock in and stock out transactions
- Automatic material quantity updates after each transaction

## Interview Notes

The app keeps responsibilities simple:

- React handles pages, forms, tables, and charts.
- Express exposes REST API routes.
- PostgreSQL stores materials and transaction history.
- Stock transactions are handled in a database transaction so quantity updates and transaction records stay consistent.
