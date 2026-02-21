# 🚀 My Next App

A modern, high-performance web application built for speed, scalability, and developer experience.

---

## 🛠️ Tech Stack

| Tech                | Role          | Features                                        |
| :------------------ | :------------ | :---------------------------------------------- |
| **Next.js 16**      | Framework     | Turbopack, App Router, SSR/SSG.                 |
| **Tailwind CSS v4** | Styling       | Modern utility-first CSS with native at-rules.  |
| **TypeScript**      | Language      | Type-safe development and static analysis.      |
| **TanStack Query**  | Data Fetching | Singleton pattern for stable state management.  |
| **Zustand**         | State         | Lightweight and scalable global state.          |
| **Axios**           | HTTP Client   | Promise-based requests with auto-refresh logic. |
| **cookies-next**    | Cookies       | Unified cookie access for Client & Server.      |
| **Vitest**          | Testing       | Fast, modern unit and component testing.        |
| **Shadcn UI**       | Components    | Accessible, beautifully designed primitives.    |
| **Lucide**          | Icons         | Clean and consistent icon library.              |

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Accessible at [http://localhost:4000](http://localhost:4000)

---

## 🏗️ Development Workflow

We use a single command to keep the codebase healthy:

### **Integrity Check**

```bash
npm run check
```

This runs: **Linting** (🔍) → **Type Checking** (󰗖) → **Testing** (🧪) → **Formatting** (🎨).

---

## 📜 All Scripts

| Command                | Description                                         |
| :--------------------- | :-------------------------------------------------- |
| `npm run dev`          | Starts the development server on port 4000.         |
| `npm run build`        | Creates an optimized production build.              |
| `npm run start`        | Runs the compiled application in production mode.   |
| `npm run test`         | Runs the test suite once.                           |
| `npm run test:watch`   | Runs tests in interactive watch mode.               |
| `npm run check`        | Runs linting, type-checking, tests, and formatting. |
| `npm run prepare`      | Configures Git hooks (Husky) for the project.       |
| `npm run lint`         | Runs ESLint checks only.                            |
| `npm run format`       | Runs Prettier formatting only.                      |
| `npm run format:check` | Checks if files are formatted (dry-run).            |

---

## 🏗️ Module-Based Architecture

The project follows a **Feature-Driven Module Architecture** to ensure scalability and separation of concerns.

### 🍱 Directory Structure

Each feature is localized within its own directory under `src/modules/` (or similar):

```text
src/
  ├── app/        # Next.js App Router (pages & layouts)
  ├── components/ # Shared UI components (shadcn)
  ├── constants/  # Centralized app configuration & keys
  ├── lib/        # Shared libraries (api-client, query-client)
  ├── providers/  # Application-wide context providers
  ├── types/      # Centralized TypeScript definitions
  └── modules/
      └── [feature-name]/
          ├── components/ # Module-specific components
          ├── hooks/      # Module-specific hooks
          ├── services/   # API calls / business logic
          └── types/      # Module-specific TypeScript types
```

### 🎯 Rationale

- **High Cohesion**: Related logic stays together.
- **Low Coupling**: Features don't leak internals to other parts of the app.
- **Scalability**: New features can be added without bloating shared folders.

### 🔌 Universal API Client

Our `apiClient` (Axios) is designed to work in both Client and Server Components seamlessly. It uses `cookies-next` for authentication and includes an automatic refresh token flow with request queuing.

### 🏗️ Singleton QueryClient

To ensure stability across re-renders in Next.js and prevent data leakage on the server, we use a Singleton pattern for the `QueryClient`. This ensures a single browser instance while providing fresh instances for every server request.

### 📐 Centralized Constants & Types

We centralize `COOKIE_KEYS`, `API_ROUTES`, and shared `Interfaces` in dedicated folders. This eliminates "magic strings" and makes the codebase highly maintainable.

---

## ⚖️ Project Rules

To maintain high code quality and project health, we follow these core rules:

### 1. Zero Tolerance for Warnings

- **Rule**: Never commit code with active lint errors or TypeScript warnings.
- **Why**: Small warnings accumulate into massive technical debt. A clean "Problems" tab ensures we catch real issues immediately.

### 2. Mandatory Local Verification

- **Rule**: Always run `npm run check` before pushing changes.
- **Why**: It catches errors locally that would otherwise break the CI/CD pipeline or the build for other developers.

### 3. Strict Type Safety

- **Rule**: Avoid using `any`. Define proper interfaces/types for all data structures.
- **Why**: TypeScript is our safety net. Using `any` bypasses that safety and leads to unstable runtime behavior.

---

## 🚀 Deployment

The easiest way to deploy is through [Vercel](https://vercel.com/new).

```bash
npm run build
```
