# AutoDoc AI Frontend

React + Vite client for AutoDoc AI, a GitHub-connected documentation dashboard for syncing repositories, browsing generated technical documentation, and viewing infrastructure diagrams.

## Features

- GitHub OAuth login through the AutoDoc AI backend.
- Repository dashboard for connecting and syncing GitHub repositories.
- File explorer for repository structure and generated documentation.
- Infrastructure map view for Mermaid-based architecture diagrams.
- Central docs page with search across generated documentation.
- User settings for notification preferences.

## Tech Stack

- React 19
- Vite
- React Router
- TanStack Query
- Axios
- Tailwind CSS
- Framer Motion
- Mermaid
- Lucide React

## Prerequisites

- Node.js 20 or newer
- npm
- Running AutoDoc AI backend API, normally at `http://localhost:5000`

## Environment

Create a local `.env` from the example file:

```bash
cp .env.example .env
```

Available variable:

| Variable | Description | Default for local development |
| --- | --- | --- |
| `VITE_API_BASE` | Base URL for the backend API | `http://localhost:5000` |

The backend must allow this frontend origin through its `CLIENT_URL` setting.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot reload. |
| `npm run build` | Create a production build in `dist`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint across the project. |

## Project Structure

```text
src/
  App.jsx                 Route definitions and protected route wrapper
  main.jsx                React entrypoint
  hooks/useAuth.jsx       Session lookup and logout helper
  pages/                  Dashboard, docs, login, settings, and repo views
  components/             Shared layout, loading, and visual components
public/                   Static assets, icons, favicon, and redirects
```

## Backend Integration

The client sends authenticated requests to `VITE_API_BASE` with cookies enabled. In local development, keep these values aligned:

- Frontend `.env`: `VITE_API_BASE=http://localhost:5000`
- Backend `.env`: `CLIENT_URL=http://localhost:5173`
- GitHub OAuth callback: `http://localhost:5000/auth/callback`

If login succeeds but the dashboard still redirects to `/login`, check that the backend is running, MongoDB is reachable, and browser cookies are not blocked.

## Build and Deployment

Build the app:

```bash
npm run build
```

The production output is written to `dist`. The included `wrangler.toml` is configured for Cloudflare Pages with `pages_build_output_dir = "dist"`.
