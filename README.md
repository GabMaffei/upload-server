# Upload Server

A course-based Fastify API for storing image uploads in Cloudflare R2 and recording their metadata in PostgreSQL. It is the backend companion to the `upload-widget` frontend exercise.

## Features

- `POST /uploads` accepts multipart image files up to 2 MB and supports JPEG, PNG, and WebP.
- `GET /uploads` lists uploads with optional filename search, created-date sorting, and pagination (20 items per page by default).
- `GET /uploads/exports` streams a filtered CSV report to R2 and returns its public URL.
- PostgreSQL metadata persistence through Drizzle ORM.
- OpenAPI documentation at `/docs`.

The API listens on port `3333`. `POST /uploads` currently returns an empty `201` response even though the upload use case creates a public URL. The companion frontend expects a JSON `url` field, so this upload response is not integrated end to end. The CSV export endpoint returns a `reportUrl`.

## Technology

Node.js, TypeScript, Fastify, Zod, Drizzle ORM, PostgreSQL, Cloudflare R2 via the AWS SDK, `csv-stringify`, Vitest, Biome, and pnpm.

## Run locally

Use Node.js and pnpm. Install dependencies and provide a PostgreSQL database and R2 bucket. The repository includes a PostgreSQL Compose service:

```bash
pnpm install
docker compose up -d
```

Set the server environment variables below. Apply the database migration, then start the API:

```bash
pnpm db:migrate
pnpm dev
```

Swagger UI is available at `http://localhost:3333/docs` while the API is running. The `PORT` environment variable is validated, but the current HTTP listener uses the fixed port `3333`.

## Environment variables

- `PORT` (defaults to `3333`)
- `NODE_ENV` (`development`, `test`, or `production`)
- `DATABASE_URL` (PostgreSQL connection URL)
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_ACCESS_KEY_ID`
- `CLOUDFLARE_SECRET_ACCESS_KEY`
- `CLOUDFLARE_BUCKET`
- `CLOUDFLARE_PUBLIC_URL`

The repository does not include a `.env.example`. Supply your own values and keep credentials out of version control. Tests use `.env.test` and run a database migration before Vitest through the package scripts.

## Project status

This repository is a guided learning project, not a deployed service. It includes upload, listing, and CSV export code, but the upload route's response differs from what the frontend expects. Automated tests require the configured test database and storage environment.

## Source guide

| Source | What to inspect |
| --- | --- |
| [Server setup](src/infra/http/server.ts) | Route registration, error handling, and OpenAPI UI. |
| [Upload route](src/infra/http/routes/upload-image.ts) | Multipart input validation and the current response. |
| [Listing route](src/infra/http/routes/get-uploads.ts) | Search, sorting, and pagination parameters. |
| [CSV export route](src/infra/http/routes/export-uploads.ts) | Filtered export request and reportUrl response. |

## API request examples

After configuring the local database and your R2 bucket, the listing route accepts explicit search and pagination parameters:

```bash
curl 'http://localhost:3333/uploads?searchQuery=example&sortBy=createdAt&sortDirection=desc&page=1&pageSize=20'
```

To request a filtered CSV export:

```bash
curl 'http://localhost:3333/uploads/exports?searchQuery=example'
```

The export response contains `reportUrl`, not the image-upload `url` expected by the companion frontend. These examples document request contracts; they are not recorded test results.
