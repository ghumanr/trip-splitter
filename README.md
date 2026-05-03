# TripSplitter

TripSplitter is a full-stack web app for splitting shared travel expenses. Users can create trips, add members, record expenses, track equal splits, view balances, and record settlement payments.

## Tech Stack

- React, TypeScript, Vite, Tailwind CSS
- Node.js, Express
- Prisma ORM
- Neon Postgres

## Project Structure

```text
trip-splitter-client/
├── client/          React frontend
├── server/          Express API and Prisma database layer
├── package.json     Root scripts for running both apps
└── README.md
```

## Requirements

- Node.js 20 or newer
- npm
- A Neon Postgres database connection string

## Environment Setup

Create `server/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DATABASE?sslmode=require"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

Replace `DATABASE_URL` with your Neon connection string.

## Install Dependencies

From the project root:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

Or run:

```bash
npm run install:all
```

## Set Up the Database

Generate the Prisma client:

```bash
npm run db:generate
```

Apply the database migration:

```bash
npm run db:migrate
```

For development, if you want Prisma to push the schema directly:

```bash
npm run db:push
```

## Run the App

From the project root:

```bash
npm run dev
```

This starts:

- Client: `http://localhost:5173`
- Server: `http://localhost:5000`

## Useful Scripts

```bash
npm run dev
```

Runs the client and server together.

```bash
npm run dev:client
```

Runs only the React frontend.

```bash
npm run dev:server
```

Runs only the Express API.

```bash
npm run build
```

Builds the frontend for production.

```bash
npm run db:generate
```

Generates the Prisma client.

```bash
npm run db:migrate
```

Applies Prisma migrations to the database.

```bash
npm run db:push
```

Pushes the Prisma schema to the database.

## Common Issues

If the app cannot load trips, make sure the server is running and `server/.env` has a valid Neon `DATABASE_URL`.

If Prisma fails to connect, check that the Neon connection string includes `sslmode=require`.

If dependencies are missing, run installs in the root, client, and server folders.

## Main Features

- Register and log in
- Create trips
- Add trip members
- Add shared expenses
- Split expenses across members
- View balances
- View suggested settlements
- Record settlement payments
- View spending by category
