# Link Analytics

A production-minded URL shortener and click analytics platform built to demonstrate backend engineering with Node.js, TypeScript, PostgreSQL, Prisma, secure JWT authentication, automated tests, and complete OpenAPI documentation.

## 🚀 About the Project

Long URLs are difficult to share and provide no visibility into engagement. Link Analytics gives authenticated users short, non-predictable links, records real request metadata on every visit, redirects visitors, and exposes ownership-protected analytics. The codebase prioritizes clear boundaries, reliable validation, security, and a realistic API rather than tutorial-style abstractions.

## ✨ Features

- Account registration and JWT login with bcrypt password hashing
- Unique seven-character short codes generated with a cryptographic random source
- Public HTTP 302 redirects with automatic click recording
- Paginated, ownership-scoped link management
- Analytics for totals, today, 7/30-day periods, daily trends, referrers, devices, browsers, operating systems, and recent visits
- Zod validation and consistent JSON errors
- Helmet, configurable CORS, body limits, and rate limiting
- Swagger UI plus machine-readable OpenAPI JSON
- Responsive demonstration dashboard in vanilla HTML/CSS/JS
- Focused Vitest test suite

## 🛠️ Tech Stack

Node.js 20+, TypeScript, Express 5, PostgreSQL, Prisma ORM, JWT, bcrypt, Zod, UAParser.js, Swagger UI, Vitest, Supertest, ESLint, and Prettier.

## 🏗️ Architecture

Controllers translate HTTP requests, services hold business rules, repositories isolate database access, schemas validate inputs, and middleware handles cross-cutting concerns.

```text
link-analytics/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/                 # Minimal demo dashboard
├── src/
│   ├── config/             # Environment and Prisma
│   ├── controllers/
│   ├── docs/               # OpenAPI definition
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
└── tests/
```

## 🔄 How It Works

```text
User → Create short link → Share link → Visitor opens URL
     → API records click → HTTP 302 redirect → Analytics available
```

HTTP `302 Found` is intentional: the redirect is temporary, discouraging clients from permanently caching the destination and allowing future destination management without a stale permanent redirect.

## 📡 API Endpoints

| Method | Endpoint                   | Authentication | Description                |
| ------ | -------------------------- | -------------: | -------------------------- |
| POST   | `/api/auth/register`       |             No | Create account             |
| POST   | `/api/auth/login`          |             No | Receive JWT                |
| GET    | `/api/links`               |     Bearer JWT | List own links (paginated) |
| POST   | `/api/links`               |     Bearer JWT | Create short link          |
| GET    | `/api/links/:id`           |     Bearer JWT | Get own link               |
| DELETE | `/api/links/:id`           |     Bearer JWT | Delete own link            |
| GET    | `/api/links/:id/analytics` |     Bearer JWT | Get own link analytics     |
| GET    | `/:code`                   |             No | Record click and redirect  |
| GET    | `/api/health`              |             No | Service health             |

## 🔐 Authentication

Passwords are hashed with bcrypt (cost 12) and never returned. Login issues a signed JWT. For protected endpoints send `Authorization: Bearer <token>`. Link queries always combine resource ID with the authenticated user's ID, preventing cross-account access.

## 📊 Analytics

The redirect captures the available IP address, user agent, referrer, device class, browser, operating system, and timestamp. Analytics are calculated from PostgreSQL data; no demonstration values are injected by the backend. IP/user-agent collection may constitute personal data, so deployments should publish an appropriate privacy notice and retention policy.

## 📚 API Documentation

With the server running, open `http://localhost:3000/api/docs`. Use **Authorize** with your JWT. The JSON specification is at `/api/openapi.json`.

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable         | Purpose                                       |
| ---------------- | --------------------------------------------- |
| `DATABASE_URL`   | PostgreSQL connection string (Neon supported) |
| `JWT_SECRET`     | Random secret of at least 32 characters       |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d`                     |
| `PORT`           | HTTP port                                     |
| `APP_URL`        | Public base URL used in short links           |
| `NODE_ENV`       | `development`, `test`, or `production`        |
| `CORS_ORIGIN`    | Comma-separated allowed origins               |
| `TRUST_PROXY`    | `true` behind a trusted hosting proxy         |

## 💻 Running Locally

```bash
git clone <your-repository-url>
cd link-analytics
npm install
cp .env.example .env
# Edit .env with your hosted PostgreSQL/Neon URL and secret
npm run prisma:migrate
npm run dev
```

Open the demo at `http://localhost:3000/dashboard/`. No Docker or local PostgreSQL installation is required when using Neon.

For production, set all environment variables, run `npm run prisma:deploy`, build with `npm run build`, and start with `npm start`. Set `APP_URL`, `CORS_ORIGIN`, and `TRUST_PROXY=true` to match the host.

## 🧪 Tests and Quality

```bash
npm test
npm run lint
npm run format:check
npm run build
npm run prisma:validate
```

Tests cover validation, authentication, short-code creation, ownership authorization, unknown codes, redirection, and click metadata recording.

## 📸 Screenshots

Add portfolio screenshots here after running the dashboard with your own data:

- Authentication screen
- Link dashboard
- Analytics breakdown
- Swagger UI

## 🗺️ Future Improvements

- Redis caching and distributed rate limiting
- Custom aliases, QR codes, expiration dates, and password protection
- Advanced geographic analytics with explicit privacy controls
- Background event ingestion for higher traffic
- Docker image and CI/CD pipeline

## 👨‍💻 Author

**Vitor Dutra Melo** — Backend Developer

## License

MIT — see [LICENSE](LICENSE).
