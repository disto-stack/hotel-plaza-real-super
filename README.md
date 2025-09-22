# 🏨 Hotel Plaza Real Super

Sistema completo de gestión hotelera con administración, sitio web público y sistema POS integrado.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **pnpm** 8+
- **Supabase CLI** 1.0+
- **Docker** (for local database)

### Installation

```bash
git clone <repository-url>
cd hotel-plaza-real-super
pnpm install
cp env.example .env.local
pnpm run start
```

## 📋 Available Commands

### 🚀 Main Commands
- **`pnpm run start`** → Start everything (Supabase + Apps + Functions)
- **`pnpm run dev`** → Development only (Apps + Functions, requires Supabase running)
- **`pnpm run stop`** → Stop all services

### 🗄️ Supabase (Complete Services)
- **`pnpm run supabase:start`** → Start Supabase (DB + Auth + Storage + Functions + Studio)
- **`pnpm run supabase:stop`** → Stop Supabase
- **`pnpm run supabase:status`** → Supabase status
- **`pnpm run supabase:studio`** → Supabase Studio only

### 🗃️ Database (DB Specific)
- **`pnpm run db:reset`** → Reset database
- **`pnpm run db:migrate`** → Run migrations
- **`pnpm run db:seed`** → Seed database

### 🖥️ Applications (Apps Only)
- **`pnpm run apps:dev`** → Start apps only
- **`pnpm run apps:lint`** → Lint apps only
- **`pnpm run apps:lint:fix`** → Lint and fix apps
- **`pnpm run apps:format`** → Format apps only
- **`pnpm run apps:format:fix`** → Format and fix apps
- **`pnpm run apps:check-types`** → Type check apps
- **`pnpm run apps:clean`** → Clean apps
- **`pnpm run apps:test`** → Test apps only
- **`pnpm run apps:test:watch`** → Test apps in watch mode
- **`pnpm run apps:test:ui`** → Test apps with UI
- **`pnpm run apps:test:coverage`** → Test apps with coverage

### ⚡ Edge Functions
- **`pnpm run functions:serve`** → Serve Edge Functions with hot reloading
- **`pnpm run functions:deploy`** → Deploy functions
- **`pnpm run functions:test`** → Test functions
- **`pnpm run functions:test:watch`** → Test functions in watch mode
- **`pnpm run functions:format`** → Format functions
- **`pnpm run functions:format:fix`** → Format and fix functions
- **`pnpm run functions:lint`** → Lint functions
- **`pnpm run functions:lint:fix`** → Lint and fix functions
- **`pnpm run functions:check-types`** → Type check functions

### 🔧 Development Tools (All Projects)
- **`pnpm run lint`** → Lint entire project (apps + functions)
- **`pnpm run lint:fix`** → Lint and fix entire project
- **`pnpm run format`** → Format entire project
- **`pnpm run format:fix`** → Format and fix entire project
- **`pnpm run check-types`** → Type checking entire project
- **`pnpm run test`** → Run all tests (apps + functions)
- **`pnpm run test:watch`** → Run all tests in watch mode

## 🏗️ Architecture

### Project Structure

```
hotel-plaza-real-super/
├── apps/
│   ├── admin/          # Admin panel (Next.js)
│   └── web/            # Public website (Astro)
├── supabase/
│   ├── functions/      # Edge Functions (Deno)
│   ├── migrations/     # Database migrations
│   └── config.toml     # Supabase configuration
├── package.json        # Monorepo configuration
└── turbo.json         # Turbo configuration
```

### Tech Stack

- **Frontend**: Next.js 14, Astro 4, TypeScript
- **Backend**: Supabase Edge Functions (Deno)
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Monorepo**: Turbo, pnpm
- **Linting**: Biome
- **Testing**: Vitest (Node.js), Deno Test (Functions)
- **Deployment**: Vercel, Supabase

## 🌐 Development URLs

- **Admin Panel**: http://localhost:3000
- **Website**: http://localhost:3001
- **Supabase API**: http://localhost:54321
- **Supabase Studio**: http://localhost:54323
- **Edge Functions**: http://localhost:54321/functions/v1/
- **Email Testing**: http://localhost:54324

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.env.local` and configure:

```bash
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WEB_URL=http://localhost:3001
```

### Database

The database is configured automatically with:
- Migrations in `supabase/migrations/`
- Seed data in `supabase/seed.sql`

## 🚀 Deployment

### Development

```bash
pnpm run start
```

### Production

```bash
pnpm run build
pnpm run functions:deploy
```

## 🔄 Development Workflow

### 1. First time or complete reset
```bash
pnpm run start
```

### 2. Daily development (with Supabase running)
```bash
pnpm run dev
```

### 3. Supabase only
```bash
pnpm run supabase:start
```

### 4. Functions only
```bash
pnpm run functions:serve
```

### 5. Stop everything
```bash
pnpm run stop
```

### Development Process

1. **Create branch**: `git checkout -b feature/new-feature`
2. **Develop**: Use `pnpm run start` or `pnpm run dev`
3. **Test**: `pnpm run test`
4. **Lint**: `pnpm run lint:fix`
5. **Commit**: `git commit -m "feat: new feature"`
6. **Push**: `git push origin feature/new-feature`

### Conventions

- **Commits**: Conventional Commits
- **Code**: Strict TypeScript
- **Linting**: Biome
- **Testing**: Vitest/Deno Test
- **Documentation**: JSDoc

## 🐛 Troubleshooting

### Common Issues

**Port in use:**
```bash
lsof -i :3000
kill -9 <PID>
```

**Database not responding:**
```bash
pnpm run supabase:stop
pnpm run supabase:start
```

**Edge Functions not loading:**
```bash
pnpm run stop
pnpm run start
```

**Check Supabase status:**
```bash
pnpm run supabase:status
```

## 📚 Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Astro Docs](https://docs.astro.build)
- [Turbo Docs](https://turbo.build/repo/docs)

## 🤝 Contributing

1. Fork the project
2. Create your branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License. See `LICENSE` for more details.

---

**Developed with ❤️ for Hotel Plaza Real**