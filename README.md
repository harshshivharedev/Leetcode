<div align="center">

# CodeArena

**A full-stack LeetCode-inspired online coding platform**

[![Live Demo](https://img.shields.io/badge/Live-Demo-181717?style=for-the-badge&logo=vercel)](https://leetcode-rho-five.vercel.app)
[![API Status](https://img.shields.io/badge/API-Health%20Check-22c55e?style=for-the-badge&logo=render)](https://leetcode-hsxg.onrender.com/health)
[![Backend](https://img.shields.io/badge/Backend-Express-000000?style=for-the-badge&logo=express)](https://leetcode-hsxg.onrender.com/api/v1)

[Live Application](https://leetcode-rho-five.vercel.app) · [API Health](https://leetcode-hsxg.onrender.com/health) · [API Base URL](https://leetcode-hsxg.onrender.com/api/v1)

</div>

---

## About the Project

**CodeArena** is a complete online judge where users can explore coding problems, write solutions in a professional code editor, execute code against visible test cases, and submit solutions for asynchronous hidden-test evaluation.

The platform includes authentication, role-based administration, problem management, submission tracking, Judge0 integration, BullMQ worker processing, and Redis-backed queues—separated into a modern frontend and scalable backend services.

> Hosted services may enter an idle state. The first request after inactivity can take a few seconds.

---

## Screenshots

> Add screenshots from the live application here to showcase the interface.

| Problems Dashboard | Code Editor |
|:---:|:---:|
| `<Add screenshot URL>` | `<Add screenshot URL>` |

| Submission Result | Admin Panel |
|:---:|:---:|
| `<Add screenshot URL>` | `<Add screenshot URL>` |

---

## Key Features

### For Users

- Register, sign in, refresh sessions, and securely log out
- Browse and search published coding problems
- View difficulty, constraints, descriptions, examples, and visible test cases
- Write solutions using the Monaco code editor
- Switch between JavaScript, Python, Java, and C++
- Run code against visible test cases
- Submit code for complete hidden-test evaluation
- Track submission status, runtime, memory usage, and error output
- View paginated submission history with status filtering
- Update profile information

### For Administrators

- Create and update coding problems
- Manage problem metadata and descriptions
- Add, edit, and remove visible and hidden test cases
- Publish or unpublish problems
- Delete problems
- Use dedicated role-based admin APIs

### Engineering Features

- JWT access and refresh authentication
- bcryptjs password hashing
- Zod validation for request payloads and environment variables
- Protected and role-based route authorization
- Centralized API errors and async request handling
- Redis/BullMQ asynchronous submission processing
- Judge0 code execution integration
- Separate API server and background worker processes
- MongoDB-backed users, problems, and submissions
- Responsive React UI with Tailwind CSS and DaisyUI

---

## Tech Stack

<table>
<tr>
<td valign="top" width="50%">

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Redux Toolkit
- React Redux
- React Hook Form
- Zod
- Monaco Editor
- Tailwind CSS
- DaisyUI

</td>
<td valign="top" width="50%">

### Backend

- Node.js
- Express 5
- TypeScript
- MongoDB
- Mongoose
- Redis
- ioredis
- BullMQ
- Judge0
- JWT
- bcryptjs
- Zod
- Helmet
- CORS

</td>
</tr>
</table>

---

## System Architecture

```text
┌───────────────────────────────────────────┐
│                 Browser                   │
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│       React + Vite Frontend (Vercel)      │
│       Monaco Editor / Redux / Zod         │
└─────────────────────┬─────────────────────┘
                      │ REST API
                      ▼
┌───────────────────────────────────────────┐
│       Express + TypeScript API (Render)   │
│       Authentication / Validation / CORS  │
└───────┬──────────────────────┬────────────┘
        │                      │
        ▼                      ▼
┌────────────────┐    ┌────────────────────┐
│ MongoDB Atlas  │    │ Redis + BullMQ     │
│ Users / Problems│   │ Submission Jobs    │
│ Submissions    │    └─────────┬──────────┘
└───────▲────────┘              │
        │                       ▼
        │             ┌────────────────────┐
        └─────────────│ Background Worker  │
      Store results   │       (Render)      │
                      └─────────┬──────────┘
                                │
                                ▼
                      ┌────────────────────┐
                      │       Judge0       │
                      │  Code Execution    │
                      └────────────────────┘
```

---

## Submission Flow

```text
1. User writes code in Monaco and submits a solution
                    │
                    ▼
2. Frontend sends code, language, and problem ID
                    │
                    ▼
3. API validates the request and creates a pending submission
                    │
                    ▼
4. API adds a BullMQ job to Redis
                    │
                    ▼
5. Worker loads the problem and hidden test cases
                    │
                    ▼
6. Worker sends each test case to Judge0
                    │
                    ▼
7. Final result is stored in MongoDB
                    │
                    ▼
8. Frontend polls the submission endpoint and displays the result
```

Submission statuses include `pending`, `accepted`, `wrong_answer`, `runtime_error`, and other supported final/error states.

---

## Live Deployment

| Component | Platform | URL / Service |
|---|---|---|
| Frontend | Vercel | [leetcode-rho-five.vercel.app](https://leetcode-rho-five.vercel.app) |
| API | Render | [leetcode-hsxg.onrender.com](https://leetcode-hsxg.onrender.com) |
| Health Check | Render | [https://leetcode-hsxg.onrender.com/health](https://leetcode-hsxg.onrender.com/health) |
| API Base | Render | `https://leetcode-hsxg.onrender.com/api/v1` |
| Database | MongoDB Atlas | Hosted database |
| Queue | Redis | BullMQ submission queue |
| Code Execution | Judge0 | External code execution service |

---

## API Overview

### Base URL

```text
https://leetcode-hsxg.onrender.com/api/v1
```

### Route Groups

| Route | Purpose |
|---|---|
| `/auth` | Registration, login, logout, and refresh token operations |
| `/users` | Current user data and profile updates |
| `/problems` | Published problem listing and problem details |
| `/admin` | Admin-only problem management operations |
| `/submissions` | Code runs, submission creation, details, and pagination |

### Health Check

```bash
curl https://leetcode-hsxg.onrender.com/health
```

---

## Project Structure

```text
Leetcode/
├── backend/
│   ├── src/
│   │   ├── common/
│   │   │   ├── errors/
│   │   │   ├── middleware/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── env.ts
│   │   │   └── redis.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── admin/
│   │   │   ├── problems/
│   │   │   └── submissions/
│   │   ├── queue/
│   │   ├── routes/
│   │   ├── workers/
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── config/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
│   └── package.json
└── README.md
```

---

## Local Development

### Prerequisites

- Node.js 20 or newer
- MongoDB instance or MongoDB Atlas
- Redis instance or hosted Redis service
- Judge0 API access

### 1. Clone the repository

```bash
git clone https://github.com/harshshivharedev/Leetcode.git
cd Leetcode
```

### 2. Backend environment

Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=<mongodb connection string>
REDIS_URL=<redis connection url>
JWT_ACCESS_SECRET=<strong random access secret>
JWT_REFRESH_SECRET=<strong random refresh secret>
CLIENT_URL=http://localhost:5173
JUDGE0_BASE_URL=<judge0 base url>
```

> Keep real credentials only in local `.env` or your hosting provider's secret settings. Never commit production secrets.

Generate strong JWT secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Start the backend

```bash
cd backend
npm install
npm run dev
```

The API normally runs at:

```text
http://localhost:5000
```

### 4. Start the submission worker

Open a second terminal:

```bash
cd backend
npm run worker
```

### 5. Configure and start the frontend

Create `frontend/.env` if needed:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Then start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

If `VITE_API_BASE_URL` is not set, the frontend falls back to `http://localhost:5000/api/v1`.

---

## Production Environment Variables

### Vercel — Frontend

```env
VITE_API_BASE_URL=https://leetcode-hsxg.onrender.com/api/v1
```

After changing an environment variable in Vercel, redeploy the frontend.

### Render — API and Worker

Configure these variables for **both** the API service and the background worker:

```env
NODE_ENV=production
MONGO_URI=<mongodb atlas connection string>
REDIS_URL=<hosted redis connection url>
JWT_ACCESS_SECRET=<strong random production secret>
JWT_REFRESH_SECRET=<different strong random production secret>
CLIENT_URL=https://leetcode-rho-five.vercel.app
JUDGE0_BASE_URL=<judge0 service url>
```

The API and worker must use the same `MONGO_URI` and `REDIS_URL` values.

#### Render Commands

| Service | Root Directory | Build Command | Start Command |
|---|---|---|---|
| API Web Service | `backend` | `npm install && npm run build` | `npm start` |
| Submission Worker | `backend` | `npm install && npm run build` | `npm run worker` |

#### Vercel Configuration

| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

> Render or Vercel may provide infrastructure values such as the server port automatically. Do not hardcode deployment credentials in the repository.

---

## Available Scripts

### Backend

```bash
npm run dev        # Start API with automatic reload
npm run build      # Compile TypeScript
npm start          # Start compiled production API
npm run worker     # Start the submission worker
npm run typecheck  # Check TypeScript types
```

### Frontend

```bash
npm run dev        # Start Vite development server
npm run build      # Typecheck and create production build
npm run preview    # Preview the production build
npm run lint       # Run ESLint
```

---

## Deployment Verification

- Open [the health endpoint](https://leetcode-hsxg.onrender.com/health) and confirm that it returns a successful response.
- Open [the frontend](https://leetcode-rho-five.vercel.app) and test registration and login.
- Confirm that the frontend calls `https://leetcode-hsxg.onrender.com/api/v1` in the deployed build.
- Confirm that `CLIENT_URL` exactly matches the deployed frontend origin.
- Confirm that MongoDB Atlas allows connections from Render.
- Confirm that Redis is reachable from both Render services.
- Confirm that the worker is running; submissions remain queued until a worker processes them.
- Confirm that Judge0 accepts requests from the worker and that `JUDGE0_BASE_URL` is valid.

---

## Security Practices

- Passwords are hashed before database storage
- JWT secrets are kept outside source control
- Access and refresh authentication are separated
- Admin routes require role-based authorization
- Environment variables are validated at startup with Zod
- CORS restricts accepted frontend origins
- Helmet applies secure HTTP headers
- `.env` files and real secrets should never be committed

---

## Future Improvements

- Add OAuth authentication
- Add problem ratings and discussions
- Add leaderboards and global ranking
- Add test-case-by-test-case submission results
- Add code run result caching
- Add Docker-based local setup
- Add automated tests and CI/CD workflows
- Add dark/light theme customization
- Add analytics and submission insights
- Improve Redis/worker observability

---

## Author

**Harsh Shivhare**

- GitHub: [@harshshivharedev](https://github.com/harshshivharedev)
- Repository: [Leetcode](https://github.com/harshshivharedev/Leetcode)

---

<div align="center">

Built for learning, portfolio, and demonstration purposes.

**If you found this project useful, consider giving the repository a star!**

</div>
