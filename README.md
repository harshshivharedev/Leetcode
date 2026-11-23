# CodeArena

CodeArena is a full-stack online coding platform inspired by LeetCode. Browse coding problems, write solutions in the Monaco editor, run code against visible test cases, and submit solutions for evaluation against hidden test cases.

## Live Demo

- **Frontend:** [https://leetcode-rho-five.vercel.app](https://leetcode-rho-five.vercel.app)
- **API health:** [https://leetcode-hsxg.onrender.com/health](https://leetcode-hsxg.onrender.com/health)
- **API base URL:** `https://leetcode-hsxg.onrender.com/api/v1`

> The API is hosted on a free service and may sleep when idle. Its first request after a period of inactivity can take a little longer.

## Features

- User registration, login, and logout with JWT access and refresh tokens
- Password hashing with bcryptjs
- Role-based authorization for admin features
- Browse published coding problems and view problem details
- Admin workflow to create, edit, publish, unpublish, and delete problems
- Visible and hidden test cases
- Monaco-based code editor with JavaScript, Python, Java, and C++ options
- Run code against visible test cases and submit solutions for evaluation
- Asynchronous code execution using BullMQ and Redis, with Judge0
- Submission status, runtime, memory, and error details
- Paginated submission history with status filtering
- User profile management
- Responsive interface built with React, Tailwind CSS, and DaisyUI

## How submissions work

1. The frontend sends the code, selected language, problem ID, and access token to the API.
2. The API creates a submission with a pending status and adds a job to Redis through BullMQ.
3. The background worker loads the problem and its hidden test cases.
4. The worker sends the code and test cases to Judge0 for execution.
5. The result is saved to MongoDB with a final status, such as `accepted`, `wrong_answer`, or `runtime_error`.
6. The frontend polls the API and displays the submission result.

## Architecture

```text
Browser
  │
  ▼
React + Vite frontend (Vercel)
  │ REST API
  ▼
Express + TypeScript API (Render)
  ├── MongoDB Atlas
  └── Redis / BullMQ
         │
         ▼
   Background worker (Render)
         │
         ▼
       Judge0
```

## Technology Stack

### Frontend

- React 19, TypeScript, and Vite
- React Router
- Redux Toolkit and React Redux
- React Hook Form and Zod
- Monaco Editor
- Tailwind CSS and DaisyUI

### Backend

- Node.js and Express 5
- TypeScript
- MongoDB and Mongoose
- Redis, ioredis, and BullMQ
- Judge0
- JWT and bcryptjs
- Zod, Helmet, and CORS

## Deployment

This project is deployed as separate frontend, API, and worker services:

| Service | Hosting | Configuration |
| --- | --- | --- |
| Frontend | Vercel | Set the project root directory to `frontend` |
| API server | Render Web Service | Set the root directory to `backend`; start with `npm start` |
| Submission worker | Render Background Worker | Set the root directory to `backend`; start with `npm run worker` |
| Database | MongoDB Atlas | Configure the connection string as `MONGO_URI` |
| Queue | Upstash Redis or another hosted Redis provider | Configure the connection URL as `REDIS_URL` |
| Code execution | Judge0 | Configure the service URL as `JUDGE0_BASE_URL` |

### Frontend environment variable

Set this in the Vercel project settings for the deployed frontend, then redeploy:

```env
VITE_API_BASE_URL=https://leetcode-hsxg.onrender.com/api/v1
```

### Backend and worker environment variables

Configure these in the Render environment settings for **both** the API service and worker. Use the same MongoDB and Redis connections for both processes.

```env
NODE_ENV=production
MONGO_URI=<your MongoDB connection string>
REDIS_URL=<your Redis connection URL>
JWT_ACCESS_SECRET=<strong random secret, at least 16 characters>
JWT_REFRESH_SECRET=<a different strong random secret, at least 16 characters>
CLIENT_URL=https://leetcode-rho-five.vercel.app
JUDGE0_BASE_URL=<your Judge0 service URL>
```

Render provides the service port through the environment. The backend defaults to port `5000` if `PORT` is not set.

> Never commit `.env` files, database credentials, tokens, or production secrets. Set secrets in your hosting provider's environment settings.

### Deployment checks

- Open `https://leetcode-hsxg.onrender.com/health` and confirm the API responds.
- Confirm the Vercel `VITE_API_BASE_URL` points to the deployed API and includes `/api/v1`.
- Confirm `CLIENT_URL` matches the deployed frontend origin.
- Confirm the API and worker use the same `MONGO_URI` and `REDIS_URL`.
- Confirm the worker is running; queued submissions need it to be processed.

## Local Development (Optional)

The live demo above is the deployed version. To run the project locally for development, you will need Node.js 20+, MongoDB, Redis, and Judge0 API access.

### 1. Configure the backend

Create `backend/.env` with your local development values:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/codearena
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=replace-with-a-random-secret-at-least-16-characters
JWT_REFRESH_SECRET=replace-with-a-different-random-secret
CLIENT_URL=http://localhost:5173
JUDGE0_BASE_URL=<your Judge0 service URL>
```

Then start the API:

```bash
cd backend
npm install
npm run dev
```

In another terminal, start the background worker:

```bash
cd backend
npm run worker
```

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

For local development, the frontend runs at `http://localhost:5173` and the API at `http://localhost:5000` by default. The frontend API configuration falls back to `http://localhost:5000/api/v1` when `VITE_API_BASE_URL` is not set.

## API

The deployed API base URL is:

```text
https://leetcode-hsxg.onrender.com/api/v1
```

Main route groups:

```text
/auth          Registration, login, logout, and refresh token
/users         Current user and profile updates
/problems      Published problem list and details
/admin         Admin-only operations
/submissions   Create, run, inspect, and paginate submissions
```

Health check: `https://leetcode-hsxg.onrender.com/health`

## Available Scripts

Run these commands from the relevant directory (`backend` or `frontend`).

### Backend

```bash
npm run dev        # Start the API in watch mode
npm run build      # Compile TypeScript
npm start          # Start the compiled production API
npm run worker     # Start the submission worker
npm run typecheck  # Run TypeScript checks
```

### Frontend

```bash
npm run dev        # Start the Vite development server
npm run build      # Typecheck and create the production build
npm run preview    # Preview the production build
npm run lint       # Run ESLint
```

## Project Structure

```text
.
├── backend/
│   └── src/
│       ├── common/       # Errors, middleware, utilities, Judge0 client
│       ├── config/       # Environment, database, and Redis configuration
│       ├── modules/      # Auth, users, admin, problems, submissions
│       ├── queue/        # BullMQ queues
│       ├── routes/       # API route composition
│       ├── workers/      # Background submission worker
│       ├── app.ts
│       └── server.ts
├── frontend/
│   └── src/
│       ├── app/          # Application routes and bootstrap
│       ├── components/   # Reusable UI components
│       ├── pages/        # User and admin pages
│       ├── services/     # API clients
│       ├── store/        # Redux store and slices
│       └── config/       # Frontend API configuration
└── README.md
```

## Engineering Practices

- Feature-based backend organization with controller/service separation
- Centralized error handling and reusable async request handling
- Runtime validation for API payloads and environment variables
- Role-based authorization
- Queue-based processing for long-running code execution
- Database indexes for submission history queries
- Separation of public problem data and hidden test cases
- Environment-based configuration for local and deployed environments

## License

This project is intended for learning, portfolio, and demonstration purposes.
