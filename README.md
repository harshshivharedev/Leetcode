# CodeArena

CodeArena is a full-stack online coding platform inspired by LeetCode. Users can browse coding problems, write solutions in a Monaco-based editor, run code against visible test cases, submit solutions for asynchronous evaluation, and track their submission history.

The project also includes an admin workflow for creating, editing, publishing, and deleting coding problems.

## Live Demo

- Frontend: https://leetcode-rho-five.vercel.app
- Backend health check: https://leetcode-hsxg.onrender.com/health

> The live deployment may sleep on free hosting plans. The first request can therefore take a few seconds.

## Highlights

- JWT-based authentication with access and refresh tokens
- Secure password hashing with bcryptjs
- Role-based admin authorization
- Zod validation for request payloads and environment variables
- Problem creation, editing, publishing, unpublishing, and deletion
- Visible and hidden test-case support
- Monaco code editor with JavaScript, Python, Java, and C++ options
- Code execution through Judge0
- Asynchronous submission processing with BullMQ and Redis
- Submission polling with status, runtime, memory, and error details
- User submission history with pagination and status filtering
- User profile management
- Responsive React interface built with Tailwind CSS and DaisyUI
- Centralized API error handling and async request handling
- Production-ready separation of API server and background worker

## Architecture

```text
React + Vite frontend
          │
          │ REST API
          ▼
Express + TypeScript API server
     │          │           │
     │          │           └── MongoDB Atlas
     │          └── Redis / BullMQ queue
     └── JWT authentication

BullMQ worker ──► Judge0 ──► submission result ──► MongoDB
```

### Request flow for a submission

1. The frontend sends code, language, problem ID, and access token.
2. The API creates a submission with `pending` status.
3. A BullMQ job is added to Redis.
4. The background worker loads the problem and hidden test cases.
5. The worker sends each test case to Judge0.
6. The result is saved as `accepted`, `wrong_answer`, `runtime_error`, or another final status.
7. The frontend polls the submission endpoint and displays the result.

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Redux Toolkit and React Redux
- React Hook Form
- Zod and `@hookform/resolvers`
- Monaco Editor
- Tailwind CSS
- DaisyUI

### Backend

- Node.js
- Express 5
- TypeScript with strict mode
- MongoDB and Mongoose
- Redis and ioredis
- BullMQ
- Judge0
- JWT and bcryptjs
- Zod
- Helmet and CORS

## Project Structure

```text
.
├── backend/
│   └── src/
│       ├── common/          # errors, middleware, utilities, Judge0 client
│       ├── config/          # environment, database, Redis configuration
│       ├── modules/
│       │   ├── auth/
│       │   ├── users/
│       │   ├── admin/
│       │   ├── problems/
│       │   └── submissions/
│       ├── queue/            # BullMQ queues
│       ├── routes/            # API route composition
│       ├── workers/           # background submission worker
│       ├── app.ts
│       └── server.ts
│
├── frontend/
│   └── src/
│       ├── app/               # application routes and bootstrap
│       ├── components/        # reusable UI components
│       ├── pages/             # user and admin pages
│       ├── services/          # API clients
│       ├── store/             # Redux store and slices
│       └── config/            # frontend API configuration
│
└── README.md
```

## Local Development

### Requirements

- Node.js 20+
- MongoDB instance or MongoDB Atlas
- Redis instance
- Judge0 API access

### Backend setup

```bash
cd backend
npm install
npm run dev
```

Run the worker in a second terminal:

```bash
cd backend
npm run worker
```

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend normally runs at `http://localhost:5173` and the backend at `http://localhost:5000`.

## Environment Variables

Create `backend/.env` locally:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/codearena
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=replace-with-a-long-access-secret
JWT_REFRESH_SECRET=replace-with-a-long-refresh-secret
CLIENT_URL=http://localhost:5173
JUDGE0_BASE_URL=https://your-judge0-host
```

For the deployed frontend, configure:

```env
VITE_API_BASE_URL=https://leetcode-hsxg.onrender.com/api/v1
```

Never commit `.env` files or production secrets.

## Available Scripts

### Backend

```bash
npm run dev        # start the API in watch mode
npm run build      # compile TypeScript
npm start          # start compiled production server
npm run worker     # start the submission worker
npm run typecheck  # run TypeScript checks
```

### Frontend

```bash
npm run dev        # start Vite development server
npm run build      # typecheck and create production build
npm run preview    # preview the production build
npm run lint       # run ESLint
```

## API Areas

Base URL:

```text
/api/v1
```

Main route groups:

```text
/auth          register, login, logout, refresh token
/users         current user and profile updates
/problems      published problem list and details
/admin         admin-only operations
/submissions   create, run, inspect, and paginate submissions
```

The health endpoint is available at:

```text
/health
```

## Deployment

Recommended deployment layout:

- Frontend: Vercel, with `frontend` as the root directory
- API server: Render Web Service, with `backend` as the root directory
- Submission worker: Render Background Worker
- Database: MongoDB Atlas
- Redis: Upstash or another hosted Redis provider

The API server and worker must share the same `MONGO_URI` and `REDIS_URL`. The worker is a separate process because submission execution is asynchronous and should not block API requests.

## Engineering Practices Demonstrated

- Feature-based backend module organization
- Controller/service separation
- Centralized error middleware
- Reusable async handler
- Runtime validation at API and environment boundaries
- Role-based authorization middleware
- Queue-based processing for long-running work
- Database indexes for submission history queries
- Public/private separation of problem test data
- Environment-based configuration
- Separate frontend API configuration for local and production environments

## Current Scope

CodeArena currently focuses on the core online-judge experience: authentication, problem management, code execution, asynchronous submissions, and submission history. Future improvements can include richer analytics, rate limiting, token rotation, multi-device refresh sessions, stronger sandboxing, editorial content, and expanded admin tooling.

## License

This project is currently intended for learning, portfolio, and demonstration purposes.
