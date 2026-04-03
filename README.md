# DBMS Group Project

> **Project Work of DBMS** made by:
> - Upahar Khatiwada (080BCT094)
> - Suparna Neupane (080BCT091)
> - Saurav Adhikari (080BCT079)

---

## 🚀 Getting Started

Follow the steps below to run this project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/upahar-khatiwada/dbms-next.git
```

### 2. Open the Project in a Code Editor

Open the cloned folder in your preferred code editor (e.g., VS Code).

### 3. Install Dependencies

Make sure [Bun](https://bun.sh/) is installed as the TypeScript runtime, then run:

```bash
bun install
```

> To install Bun: `curl -fsSL https://bun.sh/install | bash`

### 4. Set Up Environment Variables

Create a `.env` file in the root of the project and add your database connection URL:

```env
DATABASE_URL="your_database_connection_url_here"
```

> Replace `your_database_connection_url_here` with your actual database URL (e.g., a PostgreSQL connection string).

### 5. Generate Prisma Client

```bash
bunx --bun prisma generate
```

### 6. Seed the Database

```bash
bunx --bun prisma db seed
```

### 7. Run the Development Server

```bash
bun run dev
```

The app should now be running at [http://localhost:3000](http://localhost:3000).

---

## 🛠 Tech Stack

- [Next.js](https://nextjs.org/)
- [Bun](https://bun.sh/)
- [Prisma](https://www.prisma.io/)
