# KrishMithr Application Architecture

**Status:** Implemented application architecture  
**Current entry point:** Root `index.html`, served by `server/server.js`  
**Database:** Existing MongoDB database `KrishMithr`  
**Reviewed:** 2026-10-29

## 1. System overview

KrishMithr is a same-origin web application. The browser renders the field-guide interface; the Node server owns identity, sessions, authorization, catalog reads, favorites, contact storage, and editorial mutations. The MongoDB URI is read from the server environment and never appears in frontend code.

```text
Browser (root index.html + root app.js)
  ├── hash routes + accessible responsive UI
  ├── search/filter/rendering for fetched catalog
  └── same-origin JSON/FormData requests + HTTP-only session cookie
       │
       ▼
Node / Express application (server/server.js)
  ├── origin checks, security headers, body limits, rate limits
  ├── scrypt password hashing, opaque session validation, role middleware
  ├── public-for-authenticated-users and protected admin APIs
  ├── image upload validation and static media delivery
  └── MongoDB driver → existing database `KrishMithr`
       ├── users, sessions, favorites
       ├── soils, crops, diseases, media, site_settings
       └── enquiries
```

The root document is the deployed app. The older `AgriCare/index.html`, `script.js`, and `style.css` form a standalone reference copy and are not served by the Node application.

## 2. Startup and existing database selection

`server/db.js` requires `MONGODB_URI` and pins `MONGODB_DATABASE` to `KrishMithr`. It connects with one MongoClient and always selects only `client.db('KrishMithr')`; it never derives a database name from a request or selects a second database. MongoDB creates `KrishMithr` when its first indexes or seed records are written if the account does not already have it. The connection URI keeps its original authentication database; the application database is selected separately.

Startup creates application indexes only in `KrishMithr`: unique normalized email, unique session token hashes, TTL session expiry, unique catalog IDs, and enquiry creation time. This initializes that database if needed; it never creates a differently named database. The MongoDB user needs connection and read/write permissions for `KrishMithr`.

The provided URI contains `<db_password>`, so no live connection can be made until that local secret is supplied. Use `.env.example` as a template, keep `.env` untracked, and URL-encode URI-reserved characters in the password. Never put the connection URI in HTML, JavaScript, a public issue, or a client bundle.

## 3. Authentication and authorization

### Registration and login

- Registration trims names, lowercases email, validates email and field lengths, checks for an existing address, then inserts a `users` record.
- Duplicate registration returns HTTP 409 with `EMAIL_EXISTS`, so the sign-up form can tell the user to sign in.
- Passwords are stored as salted `scrypt` hashes. Raw password fields are never returned or stored.
- Login compares the supplied password with the stored hash and returns a generic invalid-credentials message.
- Login and registration have per-IP/per-route rate limits. Production deployments should also apply distributed edge limits.

### Sessions

- A cryptographically random opaque token is returned only in the `krishmithr_session` cookie.
- MongoDB stores only the SHA-256 token hash, user ID, issue time, and expiry.
- Cookie flags: `HttpOnly`, `SameSite=Strict`, root path, and `Secure` in production.
- MongoDB TTL deletes expired session records; middleware also checks expiry on each request.
- Logout deletes the session server-side and clears the cookie. Changing the password revokes existing sessions before issuing a new one.

### Authorization

Roles are `user`, `editor`, and `admin`. Every catalog/profile/favorites/contact endpoint requires an authenticated session. Editorial reads and writes require `editor` or `admin`; destructive content actions and user-role management require `admin`. Role checks run in server middleware for every request. Registration can create only `user`; the first admin is provisioned with `npm run admin:create`.

Same-origin mutations check the browser `Origin` header, and the app uses no cross-origin API access. Cookies use `SameSite=Strict`. Admin endpoints validate identifiers, content shape, relation IDs, and image URLs. Uploaded images are limited to 5 MB and JPEG, PNG, or WebP; the server checks file signatures before publishing a UUID-named file.

## 4. Routes

### Browser routes

| Route | Purpose | Session / role |
|---|---|---|
| `#login`, `#signup` | Account entry | Public |
| `#home`, `#soils` | Landing and soil selection | Signed in |
| `#crops/{soilId}` | Suitable crop list | Signed in |
| `#diseases/{soilId}/{cropId}` | Disease list | Signed in |
| `#disease/{soilId}/{cropId}/{diseaseId}` | Disease details | Signed in |
| `#favorites` | Account favorites | Signed in |
| `#contact`, `#thank-you` | Enquiry and receipt | Signed in |
| `#about`, `#questions`, `#privacy`, `#terms`, `#cookies` | Information and legal pages | Signed in |
| `#admin` | Editorial console | Editor/Admin; server checks each call |

Malformed and unknown catalog routes render a branded recovery state. Hash routes preserve back/forward navigation and validate IDs against the database catalog loaded into the browser.

### API routes

| Method and path | Access | Action |
|---|---|---|
| `POST /api/auth/register` | Public, limited | Create a user account and start a session |
| `POST /api/auth/login` | Public, limited | Verify credentials and start a session |
| `GET /api/auth/me` | Signed in | Return safe profile fields |
| `PATCH /api/auth/profile` | Signed in | Update name/email and optionally password |
| `POST /api/auth/logout` | Signed in | Revoke the current session |
| `GET /api/catalog` | Signed in | Fetch published soils, crops, diseases, media and site copy |
| `GET/PUT /api/favorites` | Signed in | Read/update user-specific favorite pairs |
| `PATCH /api/preferences` | Signed in | Persist account theme |
| `POST /api/contact` | Signed in, limited | Store a validated enquiry |
| `/api/admin/*` | Editor/Admin by operation | Catalog CRUD, media upload, settings, stats, enquiry status, roles |

## 5. Database model

| Collection | Main fields and indexes |
|---|---|
| `users` | `fullName`, unique normalized `email`, `passwordHash`, `role`, `preferences`, timestamps |
| `sessions` | `userId`, unique `tokenHash`, `createdAt`, `expiresAt` with TTL index |
| `favorites` | Unique `userId`, validated `{cropId, soilId}` pairs, `updatedAt` |
| `soils` | Unique `id`, descriptive copy, image URL/alt, `cropIds`, publication flag |
| `crops` | Unique `id`, metadata, image URL/alt, season list, `soilIds` |
| `diseases` | Unique `(cropId, id)`, symptoms/cause/conditions/prevention/management, media URL |
| `media` | Unique `id`, image or video metadata, publication flag; uploads store path and MIME type |
| `site_settings` | Public copy, hero/about images, footer disclaimer, FAQ content |
| `enquiries` | User ID, name/email/subject/message, consent timestamp, status, created time |

Relationships are maintained by the admin API when soil/crop associations change. The catalog endpoint excludes private fields and un-published entries. The seed file `data/catalog-source.json` holds the existing educational catalog for first-time import; `npm run db:seed` uses insert-only upserts and does not overwrite matching IDs.

## 6. Browser data and rendering

- The browser requests `/api/auth/me` before showing authenticated routes.
- After sign-in it requests `/api/catalog`, then builds the in-memory soil → crop → disease graph from database records.
- All content images, including hero and About imagery, resolve from `media` or catalog image fields populated in MongoDB.
- Search and crop filters run locally over the fetched catalog. The URL hash remains the selected journey state.
- Favorites and theme are persisted to MongoDB under the authenticated user, never localStorage.
- Dynamic content is HTML-escaped before template insertion; content mutations are server-validated.

## 7. Content administration

The editor console provides overview counts; create/edit/delete flows for soils, crops, and diseases; a public-site settings editor; image uploads; account-role management for admins; and enquiry review/status changes. Each mutation writes `createdAt`/`updatedAt` and actor IDs where applicable. Soil/crop links are synchronized in both documents. Deleting crops removes linked diseases and saved favorites; deleting soils removes associations and favorites referencing that soil.

## 8. Deployment and operational requirements

- Run with `npm install`, then `npm run db:seed`, then `npm start`.
- Vercel deploys through the root `server.js` Express entry point. `vercel.json` includes the HTML and browser script in the function bundle, and API middleware initializes one cached MongoDB connection before database requests. Configure the production environment variables in Vercel; function-local media uploads are temporary and need persistent object storage for production use.
- `npm run admin:create` provisions the first administrator using temporary environment values; remove the one-time password afterward.
- The Node server serves the app and API from the same origin. Deploy behind HTTPS; set `NODE_ENV=production` and configure `TRUST_PROXY=1` only behind a trusted proxy.
- Security headers are configured with Helmet and a CSP that permits same-origin scripts/API, inline styles, HTTPS images, Google Fonts, and privacy-enhanced YouTube frames. App code loads from `/app.js` under `script-src 'self'`.
- Upload files are stored under `data/uploads` (gitignored), with metadata in MongoDB. Back up the upload directory and MongoDB together.
- This app does not configure outbound mail, so password-reset emails and email verification are not active. Analytics are intentionally absent; therefore no non-essential analytics cookie consent is needed.
- The server exposes a health route, `robots.txt`, sitemap, branded HTTP 404, JSON API errors, bounded request bodies, and no stack traces to clients.

## 9. Requirements still dependent on external setup

- Replace the MongoDB password placeholder and confirm the existing database/user grants.
- Seed missing content, then provision an initial admin.
- Configure HTTPS, trusted proxy, backups, host-level rate limiting, log retention, and monitoring for deployment.
- If account verification/password recovery is required, connect a mail provider and implement expiring single-use tokens before enabling those flows.
- Optional MFA and analytics remain outside the current implementation; analytics should stay disabled unless cookie consent and privacy updates are added.
