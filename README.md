# My Fitness Pro

A fitness application built with Next.js and PostgreSQL.

## Tech Stack

- **Frontend & Backend**: Next.js
- **Database**: PostgreSQL (via Docker Compose)
- **ORM**: Prisma
- **Authentication**: NextAuth.js (Auth.js)

## Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- npm, yarn, pnpm, or bun

## Getting Started

### 1. Start PostgreSQL Database

Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```

This will start PostgreSQL on port `5432` with the following defaults:
- **Database**: `fitness_db`
- **User**: `fitness_user`
- **Password**: `fitness_password`
- **Port**: `5432`

To stop the database:
```bash
docker-compose down
```

To stop and remove all data:
```bash
docker-compose down -v
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=postgresql://fitness_user:fitness_password@localhost:5432/fitness_db
NEXTAUTH_SECRET=your-secret-key-here-generate-a-random-string
NEXTAUTH_URL=http://localhost:3000
```

**Note:** Generate a secure random string for `NEXTAUTH_SECRET`. You can use:
```bash
openssl rand -base64 32
```

### 3. Install Dependencies and Run Development Server

Install dependencies:
```bash
npm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Connection

The PostgreSQL database is accessible at:
- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `fitness_db`
- **User**: `fitness_user`
- **Password**: `fitness_password`

## Prisma Setup

This project uses Prisma as the ORM for database management.

### Generate Prisma Client

After installing dependencies, generate the Prisma Client:

```bash
npm run db:generate
```

### Create Database Schema

Define your database models in `prisma/schema.prisma`, then push the schema to the database:

```bash
npm run db:push
```

Or create and run migrations:

```bash
npm run db:migrate
```

### Prisma Studio

Open Prisma Studio to visually manage your database:

```bash
npm run db:studio
```

### Using Prisma in Your Code

Import and use the Prisma client in your Next.js app:

```typescript
import { prisma } from '@/lib/prisma'

// Example: Fetch data
const users = await prisma.user.findMany()
```

The Prisma client is configured as a singleton to prevent multiple instances in development.

## Authentication Setup

This project uses NextAuth.js (Auth.js v5) for authentication.

### Environment Variables

Make sure your `.env.local` includes:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret key for JWT encryption (generate a random string)
- `NEXTAUTH_URL` - Your application URL (default: `http://localhost:3000`)

### Database Schema

After setting up Prisma, run migrations to create the authentication tables:

```bash
npm run db:push
```

This will create the following tables:
- `User` - User accounts
- `Account` - OAuth provider accounts
- `Session` - User sessions
- `VerificationToken` - Email verification tokens

### Authentication Flow

1. **Login**: Users can login at `/login` using email and password
2. **Signup**: New users can create accounts at `/signup`
3. **Protected Routes**: All routes except `/login`, `/signup`, and `/forgot-password` require authentication
4. **Middleware**: Authentication is enforced via `middleware.ts` which redirects unauthenticated users to the login page

### Using Authentication in Components

```typescript
import { auth } from "@/auth"
import { signOut } from "@/auth"

// Get current session (server component)
const session = await auth()

// Sign out (client component)
import { signOut } from "next-auth/react"
await signOut({ redirectTo: "/login" })
```

### Authentication Wrapper

All routes are automatically protected by the middleware. The middleware checks authentication status and redirects to `/login` if the user is not authenticated.

## Project Structure

```
my-fitness-pro/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utilities and database helpers
│   └── prisma.ts    # Prisma client instance
├── prisma/          # Prisma schema and migrations
│   └── schema.prisma
└── public/          # Static assets
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
