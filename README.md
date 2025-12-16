# Agit Assessment - Task Manager

Made by me, Hans Immanuel Julius

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) (Running locally or a cloud provider like Supabase/Neon)

## 🛠️ Installation & Setup

Follow these steps to get the project running locally.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd agit_assesment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory. You can copy the structure from a template if provided, or simply add your database connection string:

```env
# Connect to your PostgreSQL database
DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
```

### 4. Database Setup (Prisma)

Initialize your database schema and seed it with initial data.

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to the database (creates tables)
npx prisma db push

# Seed the database with initial tasks
npx prisma db seed
```

_Note: The seed command uses `prisma/seed.ts` to populate the database with sample tasks._

### 5. Run the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: UI components.
- `prisma/`: Database schema and seed script.
- `lib/`: Utility functions and validation schemas.
