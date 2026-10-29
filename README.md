# KrishiMitr

KrishMithr is an account-backed agriculture field guide. Users move through **soil → crop → disease → detail**, save favorite crops, and learn through educational content managed by authorized editors.

## Current application

The live entry point is the repository root `index.html` with same-origin `app.js`, served by `server/server.js`. The older `AgriCare/index.html`, `script.js`, and `style.css` are archived reference files and are not loaded by the current app.

Vercel serves the root HTML and browser script as static assets and rewrites `/api/*` through `api/index.js` into the existing Express API, preserving nested paths such as `/api/auth/register`. API requests establish a cached MongoDB connection before handling the route. Configure `MONGODB_URI`, `MONGODB_DATABASE=KrishMithr`, `SESSION_TTL_DAYS=7`, `NODE_ENV=production`, and `TRUST_PROXY=1` in Vercel. Uploaded files use the function's temporary directory on Vercel and are not durable; configure persistent object storage before relying on admin uploads in production.

The application includes:

- Email sign-up/sign-in with duplicate-email feedback and server-side password hashing.
- Server-side expiring sessions delivered in an HTTP-only cookie.
- Profile name/email/password changes, sign-out, and account-level theme and favorites.
- Search, season filters, soil/crop/disease routes, disease guidance, and Telugu video links.
- Database-backed content, hero/about imagery, FAQs, and site settings.
- Authenticated contact enquiries, legal pages, a branded 404, and responsive layouts.
- Role-protected content administration, media upload, user roles, and enquiry status.

## Use the existing MongoDB database

The application is pinned to the database named **`KrishMithr`**. It refuses a different `MONGODB_DATABASE`; when MongoDB does not yet show that database, initialization creates only `KrishMithr` by adding the app indexes and seed records. It never selects a second database. MongoDB credentials are used by the server only.

1. Copy `.env.example` to `.env` in the repository root.
2. Replace `<db_password>` in `MONGODB_URI` with the MongoDB user password. URL-encode special characters in the password. Keep the URI's authentication database as supplied; the server selects `KrishMithr` separately.
3. Install dependencies, initialize `KrishMithr` and seed missing content:

   ```sh
   npm install
   npm run db:seed
   npm start
   ```

4. Open `http://localhost:3000`.

The seed script imports the catalog from `data/catalog-source.json` only when a matching ID is missing. Existing content is never overwritten. It seeds soil, crop, disease, media, and site-settings records in the existing database.

### Create the first administrator

Set `ADMIN_NAME`, `ADMIN_EMAIL`, and a unique `ADMIN_PASSWORD` of at least 12 characters temporarily in `.env`, run `npm run admin:create`, then remove `ADMIN_PASSWORD`. Public registration creates a regular user account; it cannot grant itself editor or admin access. Admins can assign editor/admin roles in the protected dashboard.

## Database collections

| Collection | Contents |
|---|---|
| `users` | Normalized email, display name, scrypt password hash, role, preferences |
| `sessions` | Hashed opaque session tokens with TTL expiry |
| `favorites` | User-specific saved crop/soil pairs |
| `soils`, `crops`, `diseases` | Published field-guide records and associations |
| `media` | Image URLs/uploads and disease video metadata |
| `site_settings` | Home/about copy, hero imagery, footer note, FAQs |
| `enquiries` | Authenticated contact messages and status |

## Security notes

- Passwords and MongoDB credentials never go to the browser.
- The app server checks sessions and roles on every private API route; hiding a page is not access control.
- Login and registration endpoints are rate-limited. Mutating requests check same-origin headers and use a `SameSite=Strict` session cookie.
- The first admin is provisioned through the local CLI; registration cannot create privileged accounts.
- Production deployment must use HTTPS, a restricted MongoDB database user, backups, and a trusted reverse proxy. Set `TRUST_PROXY=1` only behind a proxy you control.
- The browser uses external Pexels imagery, Google Fonts, and user-selected YouTube resources. Photo content is illustrative, not diagnostic.

## Project documents

- [Product requirements](PRD.md)
- [Architecture and security boundary](architecture.md)
- [UI and interaction design](design.md)
- [Delivery phases](phases.md)
