# KrishMithr — Product Requirements Document (PRD)

**Product name:** KrishMithr  
**Tagline:** Smart Farming. Better Decisions. Healthier Crops.  
**Document version:** 1.0  
**Year:** 2026  
**Status:** Approved for implementation  
**Product type:** Educational AgriTech web application  

---

## 1. Project Overview

KrishMithr is an interactive agriculture assistant that helps farmers, students, and agri-enthusiasts make better crop decisions by following a guided discovery flow:

```text
SOIL → CROP → DISEASE → DISEASE DETAILS
```

Users start by selecting their field soil type. The system then shows only crops suitable for that soil. After a crop is chosen, common diseases for that crop are listed. Selecting a disease opens detailed educational content covering symptoms, causes, favorable conditions, prevention, and general management.

The product is delivered as a modern, responsive web application with search, filters, favorites, dark mode, educational content pages, and (in the full platform) optional admin content management.

**Core value proposition:** Reduce guesswork in early crop planning by connecting soil knowledge, crop suitability, and disease awareness in one simple guided experience.

> **Current implementation note:** The root `index.html` is served by the Node application and starts with database-backed sign-in/sign-up. User records, password hashes, sessions, profile preferences, favorites, content, images, and enquiries use the existing MongoDB database named `KrishMithr`. The frontend route check is for navigation; server middleware is the authorization boundary. See `architecture.md` and `.env.example` for setup. The database password was not included in the supplied URI and must be configured locally before connecting.

---

## 2. Project Vision

To become a trusted, easy-to-use educational AgriTech companion that empowers every grower—regardless of technical background—to understand the relationship between soil, crops, and plant health, and to make safer, more informed farming decisions.

KrishMithr aims to feel like a polished agricultural technology product: clean, mobile-first, fast, accessible, and scientifically careful (educational guidance without unsafe chemical prescriptions).

---

## 3. Business Objective

| Objective | Description |
|-----------|-------------|
| **Primary** | Deliver a complete, demonstrable AgriTech web product suitable for academic projects, hackathons, portfolios, NGOs, and agri-extension demos |
| **Secondary** | Establish a scalable content platform for soils, crops, and diseases that can grow via admin CMS |
| **Tertiary** | Build user trust through clarity, accessibility, disclaimers, and responsible disease-management guidance |
| **Long-term** | Enable multi-language content, regional crop packs, and partnership with agricultural institutions |

**Business outcomes:**
- High completion rate of the Soil → Crop → Disease journey
- Strong engagement with disease detail pages
- Favorites and return visits
- Shareable educational utility with clear attribution and legal pages

---

## 4. Problem Statement

Farmers and learners often struggle to answer three connected questions:

1. **Which crops suit my soil?**  
2. **What diseases commonly affect those crops?**  
3. **What should I watch for, and how do I prevent problems?**

Information is scattered across PDFs, generic websites, and expert consultations that may be hard to access quickly. Beginners may misidentify soil–crop fit or miss early disease symptoms. Existing tools are often either too technical, not mobile-friendly, or incomplete.

**KrishMithr solves this** by offering a single guided path with structured data, visual cards, search/filter, and clear educational disease details—plus a responsible disclaimer directing users to local experts before applying any crop-protection product.

---

## 5. Goals

1. Present soil selection as the first interactive step after landing.
2. Dynamically show only crops suitable for the selected soil.
3. Dynamically show diseases for the selected crop.
4. Display detailed disease information (symptoms, cause, conditions, prevention, management).
5. Support full navigation without full page reloads for the core flow (SPA-style experience).
6. Provide global search across soils, crops, and diseases.
7. Provide crop filtering by season and name.
8. Allow users to favorite crops (persisted).
9. Support light/dark theme (persisted).
10. Be fully responsive (mobile, tablet, desktop).
11. Meet basic accessibility and SEO standards.
12. Include About, legal pages, thank-you, and custom 404.
13. (Platform) Allow admins to manage content securely via dashboard.
14. Keep all pesticide guidance non-prescriptive and safety-first.

---

## 6. Non-Goals

KrishMithr will **not** (in v1 / stated scope):

- Prescribe specific chemical dosages, brands, or spray schedules as medical/agronomic advice
- Replace licensed agronomists, soil lab tests, or government extension services
- Provide real-time IoT sensor integration (soil moisture probes, weather stations)
- Offer marketplace / e-commerce for seeds or pesticides
- Provide AI image-based disease diagnosis from user photos (future consideration only)
- Support native iOS/Android apps (responsive web only)
- Guarantee yield predictions or financial farm planning
- Store sensitive personal farmer financial data
- Provide multi-tenant SaaS billing in the initial release

---

## 7. Target Users

| Segment | Needs |
|---------|--------|
| **Small & marginal farmers** | Simple guidance on soil–crop fit and disease awareness in local context |
| **Agriculture students** | Structured learning aid for soil science / pathology basics |
| **Extension workers & NGOs** | Demo tool for training sessions |
| **Home/kitchen gardeners** | Easy crop and disease education |
| **Hackathon / portfolio reviewers** | Polished, complete product demonstration |
| **Content admins (platform)** | Ability to add/edit soils, crops, diseases, and pages |

---

## 8. User Personas

### Persona A — Ravi, 34, Smallholder Farmer
- **Context:** Owns 2 acres; mixed soil knowledge from tradition  
- **Goals:** Choose a profitable crop for his soil; spot disease early  
- **Frustrations:** Complex websites, English-heavy PDFs, unsafe pesticide rumors  
- **KrishMithr use:** Selects Black Soil → Cotton → views Boll Rot details  

### Persona B — Ananya, 21, B.Sc. Agriculture Student
- **Context:** Needs quick revision of crop–disease relationships  
- **Goals:** Study structured content; save favorites for exams  
- **Frustrations:** Fragmented notes; no interactive flow  
- **KrishMithr use:** Search “Blast”, open rice disease details, dark mode at night  

### Persona C — Meera, 42, NGO Trainer
- **Context:** Runs farmer workshops in rural districts  
- **Goals:** Live demo on projector/phone; credible educational content  
- **Frustrations:** Tools that need constant connectivity setup or login for basic use  
- **KrishMithr use:** Public flow without forced signup; About + disclaimer  

### Persona D — Karan, 29, Content Admin
- **Context:** Maintains educational dataset for the organization  
- **Goals:** Add a new soil, crop, or disease; update images and SEO text  
- **Frustrations:** Editing raw JS objects without UI  
- **KrishMithr use:** Admin dashboard CRUD with preview  

---

## 9. User Roles

| Role | Access level | Capabilities |
|------|--------------|--------------|
| **Guest / Public user** | Public | Browse home, soil–crop–disease flow, search, filter, favorites (local), about, legal pages, contact |
| **Registered user** | Authenticated | Field guide, synced favorites and theme, profile, contact enquiry |
| **Editor** | Admin (content) | CRUD soils, crops, diseases, media, blog/about snippets |
| **Admin** | Full admin | All editor rights + users, settings, analytics view, legal page publish |
| **Super Admin** | System | Role assignment, environment, security settings |

**Current implementation:** Registered user + Editor + Admin. Registration/login are required before using the application.  
**Access boundary:** Authenticated APIs enforce user and content-management permissions on the server.

---

## 10. User Journeys

### Journey 1 — Guided discovery (primary)
1. Land on Home / Hero  
2. Click **Explore Soils**  
3. Review soil cards → **Select Soil**  
4. See crops for that soil → optional season filter / search  
5. **View Diseases** on a crop  
6. **View Details** on a disease  
7. Read prevention/management → optional **Start Again**

### Journey 2 — Search-first
1. Type “Rust” or “Black Soil” in header search  
2. Select a result  
3. Jump directly to soil, crop list, or disease detail in context  

### Journey 3 — Favorites
1. During crop browsing, tap ⭐  
2. Open **My Favorites**  
3. **Open Crop** to resume disease exploration  

### Journey 4 — Contact / enquiry
1. Open Contact  
2. Submit name, email, message  
3. See Thank-You page  

### Journey 5 — Admin content update
1. Admin logs in  
2. Opens Diseases → Edit “Early Blight”  
3. Updates symptoms text and image  
4. Saves → public site reflects change  

---

## 11. User Stories

### Public
- As a farmer, I want to select my soil type so that I only see suitable crops.  
- As a user, I want to see crop season, water need, and duration so that I can plan.  
- As a user, I want to view common diseases for my crop so that I can prepare.  
- As a user, I want disease symptoms and prevention explained simply.  
- As a user, I want to search soil/crop/disease names quickly.  
- As a user, I want to filter crops by season.  
- As a user, I want to favorite crops for later.  
- As a user, I want dark mode for low-light use.  
- As a user, I want the site to work on my phone.  
- As a user, I want a clear disclaimer so I know this is educational.  

### Admin
- As an admin, I want to log in securely.  
- As an editor, I want to add a new soil with description and image.  
- As an editor, I want to attach crops to soils and diseases to crops.  
- As an admin, I want to manage contact enquiries.  

---

## 12. Complete Website Structure

```text
KrishMithr
├── Public
│   ├── Home (Hero + entry to flow)
│   ├── Soil Selection (Step 1)
│   ├── Crop Selection (Step 2)
│   ├── Disease Selection (Step 3)
│   ├── Disease Details (Step 4)
│   ├── My Favorites
│   ├── About
│   ├── Contact
│   ├── Thank You
│   ├── Privacy Policy
│   ├── Terms & Conditions
│   ├── Cookie Policy (if analytics/cookies used)
│   └── 404
├── Utility
│   ├── Search overlay/results
│   ├── Progress indicator
│   └── Theme toggle
└── Admin (full platform)
    ├── Login
    ├── Dashboard
    ├── Soils CRUD
    ├── Crops CRUD
    ├── Diseases CRUD
    ├── Media Library
    ├── Enquiries
    ├── Site Settings
    └── Users / Roles (admin)
```

---

## 13. Navigation Structure

### Primary header nav
- Home  
- Soil  
- Crops  
- Diseases  
- Favorites  
- About  
- Contact (platform)  

### Header utilities
- Search: “Search soil, crop or disease...”  
- Dark mode toggle  
- Mobile hamburger menu  

### In-flow navigation
- Select Soil → Crops  
- View Diseases → Disease list  
- View Details → Detail panel  
- Back to Soils / Crops / Diseases  
- Start Again (reset to soil)  

### Footer
- Logo + tagline  
- Quick links (Home, Soil, Crops, Diseases, About, Contact, Privacy, Terms)  
- Disclaimer  
- © year KrishMithr  

---

## 14. Page-by-Page Requirements

### 14.1 Home
- **Purpose:** Brand introduction and entry into soil flow  
- **User:** Public  
- **Inputs:** CTA click  
- **Expected behavior:** Hero with heading, subtitle, agriculture imagery, **Explore Soils** scrolls/navigates to soil step  
- **Output:** User enters Step 1  
- **Acceptance criteria:** Hero visible on load; CTA works; tagline shown; responsive  

### 14.2 Soil Selection
- **Purpose:** Choose field soil  
- **User:** Public  
- **Inputs:** Soil card selection  
- **Expected behavior:** ≥7 soil cards (image, name, description, suitable crops, Select Soil); hover states; store selection; go to crops  
- **Output:** `selectedSoil` set; crops section shown  
- **Acceptance criteria:** Only one active selection path; unknown soil handled gracefully  

### 14.3 Crop Selection
- **Purpose:** Choose crop suited to soil  
- **User:** Public  
- **Inputs:** Soil context; optional search + season chips; favorite; View Diseases  
- **Expected behavior:** Dynamic crop list; ≥5 crops per soil; show season, water, duration; filters update list  
- **Output:** `selectedCrop` set; diseases section shown  
- **Acceptance criteria:** Crop list changes with soil; empty filter state shown  

### 14.4 Disease Selection
- **Purpose:** List common diseases for crop  
- **User:** Public  
- **Inputs:** View Details  
- **Expected behavior:** ≥3 diseases per crop; card with name, short description, cause badge  
- **Output:** Disease list UI  
- **Acceptance criteria:** List bound to selected crop only  

### 14.5 Disease Details
- **Purpose:** Educate on one disease  
- **User:** Public  
- **Inputs:** Back / Start Again  
- **Expected behavior:** Show name, symptoms, cause, favorable conditions, prevention, general management, important pesticide note  
- **Output:** Detail panel  
- **Acceptance criteria:** Required sections present; safety note always visible  

### 14.6 Favorites
- **Purpose:** Quick access to starred crops  
- **User:** Public  
- **Inputs:** Open crop / unfavorite  
- **Expected behavior:** Persist favorites; empty state if none  
- **Output:** Favorites grid  
- **Acceptance criteria:** Survives refresh and follows the signed-in account  

### 14.7 About
- **Purpose:** Explain mission and features  
- **User:** Public  
- **Expected behavior:** Platform description + feature cards (Soil Analysis, Crop Information, Disease Awareness)  
- **Acceptance criteria:** Content accurate to product  

### 14.8 Contact
- **Purpose:** Collect enquiries  
- **User:** Public  
- **Inputs:** Name, email, message (+ optional phone)  
- **Expected behavior:** Validate → submit → thank-you  
- **Acceptance criteria:** Required fields enforced; success/error states  

### 14.9 Thank You
- **Purpose:** Confirm submission  
- **Acceptance criteria:** Clear message + link home  

### 14.10 Privacy / Terms / Cookies
- **Purpose:** Legal compliance and trust  
- **Acceptance criteria:** Readable pages linked in footer  

### 14.11 404
- **Purpose:** Recover from bad URLs  
- **Acceptance criteria:** Branded 404 + CTA to Home / Soil  

### 14.12 Admin pages (platform)
- Login, dashboard stats, CRUD modules, settings — see Admin Requirements  

---

## 15. Functional Requirements

| ID | Requirement |
|----|-------------|
| FR-01 | On first interactive flow, soil selection is presented first |
| FR-02 | Selecting soil stores state and renders suitable crops only |
| FR-03 | Selecting crop stores state and renders that crop’s diseases |
| FR-04 | Selecting disease opens full detail view |
| FR-05 | Back buttons restore previous step without losing higher-level selection inappropriately |
| FR-06 | Start Again clears soil/crop/disease and returns to soils |
| FR-07 | Progress indicator reflects current step (Soil / Crop / Disease) |
| FR-08 | Search queries soils, crops, diseases and navigates on result click |
| FR-09 | Crop season filter and text filter update crop grid live |
| FR-10 | Favorite toggle persists and Favorites section updates |
| FR-11 | Dark mode toggles theme and persists preference |
| FR-12 | Mobile nav collapses to hamburger |
| FR-13 | Missing/unknown entities show safe empty/error UI (never blank crash) |
| FR-14 | Disease details always include expert-consultation note for chemical use |
| FR-15 | Admin/editor content CRUD persists in MongoDB and is role-checked by the API |
| FR-16 | Contact form stores an authenticated enquiry in MongoDB and shows thank-you |

---

## 16. Feature Requirements (Detailed)

### 16.1 Soil Selection Engine
- **Purpose:** Anchor the decision tree on soil  
- **User:** Public  
- **Inputs:** Click Select Soil  
- **Expected behavior:** Validate soil exists in dataset; set state; animate/scroll to crops; update progress  
- **Output:** Filtered crop collection  
- **Acceptance criteria:** 7+ soils; cards complete; selection reliable  

### 16.2 Crop Suitability Engine
- **Purpose:** Show agronomically relevant crops per soil  
- **User:** Public  
- **Inputs:** selectedSoil, filters  
- **Expected behavior:** Render cards from data model; apply season/name filters  
- **Output:** Crop cards  
- **Acceptance criteria:** ≥5 crops/soil; metadata visible  

### 16.3 Disease Catalog
- **Purpose:** Disease awareness per crop  
- **User:** Public  
- **Inputs:** selectedCrop  
- **Expected behavior:** List diseases; open detail  
- **Output:** Disease cards + detail  
- **Acceptance criteria:** 3–5+ diseases; all detail fields  

### 16.4 Search
- **Purpose:** Fast random access  
- **User:** Public  
- **Inputs:** Query string  
- **Expected behavior:** Case-insensitive match; typed results; empty query hides panel; empty results message  
- **Output:** Result list with type labels  
- **Acceptance criteria:** Soil/crop/disease covered; click navigates correctly  

### 16.5 Favorites
- **Purpose:** Save crops of interest  
- **User:** Public  
- **Inputs:** Star button  
- **Expected behavior:** Toggle; persist; render list  
- **Output:** Favorites section  
- **Acceptance criteria:** Persistence key stable; unfavorite works  

### 16.6 Dark Mode
- **Purpose:** Comfort and accessibility preference  
- **User:** Public  
- **Inputs:** Toggle  
- **Expected behavior:** CSS theme switch; persist  
- **Output:** Themed UI  
- **Acceptance criteria:** Readable contrast both themes  

### 16.7 Progress Indicator
- **Purpose:** Orient user in multi-step flow  
- **User:** Public  
- **Inputs:** Step state  
- **Expected behavior:** Highlight current; mark completed  
- **Output:** Step UI + selection summary  
- **Acceptance criteria:** Updates on every step change  

---

## 17. Forms and Form Fields

### Contact form
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full name | text | Yes | 2–80 chars |
| Email | email | Yes | Valid email format |
| Phone | tel | No | Optional E.164/local pattern |
| Subject | select/text | No | Max 120 chars |
| Message | textarea | Yes | 10–2000 chars |
| Consent | checkbox | Yes (if privacy requires) | Must be checked |

### Admin login
| Field | Type | Required |
|-------|------|----------|
| Email | email | Yes |
| Password | password | Yes |

### Admin soil form
| Field | Required |
|-------|----------|
| Name | Yes |
| Description | Yes |
| Suitable note | No |
| Image URL/file | Yes |
| Published | Yes |

### Admin crop form
| Field | Required |
|-------|----------|
| Name | Yes |
| Soil association(s) | Yes |
| Description | Yes |
| Season | Yes |
| Water | Yes |
| Duration | Yes |
| Image | Yes |
| Published | Yes |

### Admin disease form
| Field | Required |
|-------|----------|
| Name | Yes |
| Crop association(s) | Yes |
| Description | Yes |
| Symptoms | Yes |
| Cause | Yes |
| Conditions | Yes |
| Prevention | Yes |
| Management | Yes |
| Image | No |
| Published | Yes |

---

## 18. CTA Requirements

| CTA | Placement | Action |
|-----|-----------|--------|
| Explore Soils ↓ | Hero | Scroll/navigate to soil step |
| Select Soil | Soil card | Advance to crops |
| View Diseases | Crop card | Advance to diseases |
| View Details | Disease card | Open detail |
| Back to … | Section actions | Previous step |
| Start Again | Section actions | Reset flow |
| Open Crop | Favorites | Resume at diseases |
| Contact Us | About/Footer | Contact page |
| Send Message | Contact | Submit form |
| Back to Home | 404 / Thank you | Home |

**CTA rules:** Primary CTAs use solid brand green; secondary outline; destructive rare; always keyboard accessible; loading state on async submit.

---

## 19. Admin Requirements

- Secure login (email/password with server-side scrypt hashing and opaque database sessions)  
- Dashboard overview: counts of soils, crops, diseases, enquiries  
- CRUD for soils, crops, diseases  
- Media upload to storage  
- Enquiry list + mark read  
- Site settings: site name, tagline, footer disclaimer  
- Role-based access (Admin/Editor)  
- Protected admin routes  
- Audit-friendly updated_at / updated_by where feasible  
- No public exposure of service-role keys  

---

## 20. Content Management Requirements

- All educational entities structured and editable without code deploy (platform)  
- Draft/publish flag optional  
- Image alt text fields  
- Rich plain-text sections for disease details (markdown optional)  
- Content preview before publish (nice-to-have)  
- Static v1 may embed content in JS objects with documented extension process  

---

## 21. Search / Filter Requirements

### Global search
- Searches soil names, crop names, disease names (and short descriptions optionally)  
- Debounce 200–300ms on platform; instant acceptable on static  
- Max 20 results  
- Group or label by type  
- Keyboard: Escape closes  

### Crop filters
- Text search within current soil’s crops  
- Season chips: All, Kharif, Rabi, Zaid, Year-round  
- Combined filter logic (AND)  
- Empty state when no matches  

---

## 22. Authentication Requirements

| Mode | Requirement |
|------|-------------|
| Public site | Sign-in required for all application routes and catalog APIs |
| Admin | Mandatory authentication and role authorization |
| Sessions | Opaque server-side sessions in MongoDB, HTTP-only SameSite cookies |
| Password | Min length 8+; salted scrypt hash stored server-side |
| Logout | Clears session |
| Password reset | Email reset flow for admins |
| MFA | Optional for Super Admin (recommended production) |

**Never** store plaintext passwords. **Never** expose service-role keys in the browser.

---

## 23. Authorization / RBAC

| Resource | Guest | Editor | Admin |
|----------|-------|--------|-------|
| Public pages | R | R | R |
| Contact submit | C | C | C |
| Soils/Crops/Diseases public read | R | R | R |
| Content write | — | CUD | CUD |
| Enquiries read | — | R | RUD |
| Settings | — | — | RU |
| User roles | — | — | Full |

Enforce in backend middleware and MongoDB collection permissions. Least privilege by default; never expose MongoDB credentials to the browser.

---

## 24. Database Requirements

### Collections (current and planned)
- `soils`  
- `crops`  
- `soil_crops` (M:N or soil_id on crops)  
- `diseases`  
- `crop_diseases`  
- `media`  
- `enquiries`  
- `users` and `sessions`  
- `site_settings`  

### Rules
- UUID primary keys preferred  
- Timestamps `created_at`, `updated_at`  
- Soft delete optional  
- Foreign keys with referential integrity  
- Indexes on name/search columns  
- Unique index on normalized user email; TTL index on session expiry  
- Authenticated server APIs only; MongoDB URI remains server-side  

*(The root frontend loads this content from the existing MongoDB database. `data/catalog-source.json` is a non-public, idempotent seed source and never overwrites existing records.)*

---

## 25. SEO Requirements

- Unique `<title>` and meta description per route  
- Semantic HTML5 landmarks  
- Descriptive headings (single H1 per page)  
- Alt text on images  
- Clean URLs (`/soils`, `/about`, `/diseases/[slug]`) on platform  
- Canonical URLs  
- sitemap.xml  
- robots.txt  
- Open Graph + Twitter cards  
- JSON-LD `WebSite` / `Organization` where applicable  
- Fast LCP; indexable critical content  

---

## 26. Accessibility Requirements

- WCAG 2.1 AA target  
- Keyboard navigation for all controls  
- Visible focus states  
- Sufficient color contrast (light and dark)  
- Skip to main content link  
- ARIA labels on icon-only buttons  
- Form labels and error announcements  
- `prefers-reduced-motion` respected where possible  
- Alt text mandatory for content images  

---

## 27. Responsive Requirements

| Breakpoint | Layout |
|------------|--------|
| Mobile ≤560px | 1 card/row; hamburger; stacked filters |
| Tablet ≤900px | 2 cards/row |
| Desktop ≥1100px | 3–4 cards/row |
| Large desktop | Contained max width ~1180px |

Touch targets ≥44px where possible. No horizontal scroll on standard devices.

---

## 28. Performance Requirements

- First contentful paint target &lt; 2.5s on mid mobile (optimized host)  
- Lazy-load below-fold images  
- Minify/bundle assets on platform  
- Avoid layout shift on image load (width/height or aspect ratio)  
- Debounce search  
- Cache static assets with CDN  
- Database queries indexed; avoid N+1 on public APIs  

---

## 29. Security Requirements

- HTTPS only in production  
- Input validation client + server  
- Output encoding to prevent XSS  
- CSRF protection on mutating web routes/forms  
- MongoDB driver queries use validated identifiers and server-controlled filters  
- Server role checks protect content writes and enquiry/user administration  
- Secure headers (CSP, X-Frame-Options, etc.)  
- Rate limit auth and contact endpoints  
- Admin routes protected  
- No stack traces to clients  
- Secrets only in environment variables  
- Least-privilege storage policies  

---

## 30. Loading States

- Initial app bootstrap: optional subtle skeleton for card grids  
- Contact submit: button disabled + spinner + “Sending…”  
- Admin table fetch: skeleton rows  
- Image load: soft placeholder background  
- Search: no full-page blocker; inline results  

---

## 31. Empty States

| Context | Message / CTA |
|---------|----------------|
| No favorite crops | “No favorites yet. Tap ⭐ on any crop card…” |
| No crops for filter | “No crops match your filters…” |
| No search hits | “No matches for …” |
| No diseases | “No disease records found for this crop.” |
| Admin empty table | “No items yet. Create the first…” |
| No enquiries | “No enquiries yet.” |

Empty states must never leave a blank white void.

---

## 32. Error States

- Unknown soil/crop/disease → toast + safe message  
- Network failure (platform) → retry CTA  
- Form validation errors inline per field  
- Auth failure → generic “Invalid credentials” (no user enumeration detail)  
- 403 admin → redirect login or unauthorized page  
- JS init failure → fallback message in soil grid  
- Image `onerror` → emoji/CSS placeholder  

---

## 33. Success States

- Soil/crop selected → toast confirmation  
- Favorite added/removed → toast  
- Theme switched → toast  
- Contact submitted → Thank-You page  
- Admin save → success banner “Saved successfully”  
- Admin delete → confirmation then success  

---

## 34. Custom 404 Page

- KrishMithr branding  
- Friendly message: “This field path doesn’t exist.”  
- CTAs: Home, Explore Soils  
- Optional search entry  
- HTTP status 404 on platform  

---

## 35. Thank-You Page

- Confirmation that message was received  
- Expected response window (e.g., 2–3 business days) if applicable  
- CTA back to Home / Soil explorer  
- No sensitive data echoed unnecessarily  

---

## 36. Privacy Policy Requirements

Must cover:
- What data is collected (account name/email, password hash, contact form, account favorites/theme)  
- Purpose of processing  
- Legal basis / consent where required  
- Third parties (hosting, analytics, auth provider)  
- Retention  
- User rights  
- Contact for privacy requests  
- Disclaimer that agricultural content is educational  

---

## 37. Terms & Conditions Requirements

Must cover:
- Educational use only; no professional agronomy warranty  
- Acceptable use  
- Intellectual property  
- Limitation of liability  
- User-generated content rules (if any)  
- Admin/account terms  
- Governing law placeholder  
- Changes to terms  

---

## 38. Cookie Requirements

- If only the essential HTTP-only session cookie and no tracking cookies: disclose in Privacy  
- If analytics cookies: Cookie banner with Accept / Reject non-essential; link Cookie Policy  
- Document cookie names, purpose, duration  
- Honor withdrawal of consent  

---

## 39. Analytics Requirements

- Page views: Home, Soil, Crop, Disease detail  
- Funnel: soil_selected → crop_selected → disease_viewed  
- CTA clicks: Explore Soils, Select Soil, View Diseases  
- Search queries (anonymized)  
- Contact submit success  
- No PII in event payloads  
- Provider example: Plausible / GA4 / Vercel Analytics  
- Admin-only aggregate views optional  

---

## 40. Image Optimization Requirements

- Prefer modern formats (WebP/AVIF) on platform  
- Responsive `srcset` where applicable  
- Lazy loading for non-critical images  
- Compression without visible artifacts  
- Explicit width/height or aspect-ratio boxes  
- Alt text required  
- CDN delivery  
- Admin uploads: type/size validation (e.g., max 2–5MB; jpg/png/webp)  

---

## 41. Metadata Requirements

Per page:
- `title` (brand pattern: `{Page} | KrishMithr`)  
- `description` (140–160 chars)  
- `og:title`, `og:description`, `og:image`, `og:url`, `og:type`  
- `twitter:card`  
- Canonical link  
- Language `lang=en` (or i18n later)  

---

## 42. Sitemap Requirements

- Include all public indexable routes  
- Exclude admin, thank-you (optional), API  
- Auto-generate on platform build or via app route  
- Update on content publish when possible  

---

## 43. Robots.txt Requirements

```text
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Sitemap: https://<domain>/sitemap.xml
```

Adjust for staging (`Disallow: /` on non-prod).

---

## 44. Open Graph Requirements

- Default OG image: farm/brand visual ≥1200×630  
- Home, About, and key landing pages custom descriptions  
- Disease detail pages may use dynamic OG title: `{Disease} on {Crop} | KrishMithr`  
- Absolute HTTPS image URLs  

---

## 45. Acceptance Criteria (Product-Level)

1. Opening the site shows branding **KrishMithr** and hero.  
2. Soil step is available as first flow step.  
3. Selecting each of 7 soils shows a distinct crop set.  
4. Selecting a crop shows 3+ diseases.  
5. Disease detail shows all required sections + safety note.  
6. Back and Start Again work without full reload of app shell.  
7. Search finds soil, crop, and disease entries.  
8. Season filter changes visible crops.  
9. Favorites persist after refresh.  
10. Dark mode persists after refresh.  
11. Mobile hamburger works; layouts usable at 360px width.  
12. No uncaught errors on happy path.  
13. Footer disclaimer present.  
14. (Platform) Admin can CRUD a disease end-to-end.  
15. (Platform) Unauthenticated user cannot access `/admin`.  

---

## 46. Success Metrics

| Metric | Target (indicative) |
|--------|---------------------|
| Flow completion to disease detail | ≥ 40% of engaged sessions |
| Search usage rate | ≥ 15% of sessions |
| Mobile traffic usability (CLS/LCP good) | Core Web Vitals “good” on home |
| Contact form success rate | ≥ 95% of valid submits |
| Bounce on hero only | Monitor; improve CTA clarity |
| Admin content update time | &lt; 5 minutes for one disease edit |
| Accessibility smoke test | Critical paths keyboard-usable |

---

## 47. Definition of Done

A feature/page is done when:

- [ ] Implements stated purpose and acceptance criteria  
- [ ] Matches design.md tokens and components  
- [ ] Responsive checked (mobile/tablet/desktop)  
- [ ] Accessibility basics (labels, focus, contrast)  
- [ ] Empty/loading/error/success states handled  
- [ ] Security checks for any data mutation  
- [ ] No console errors on happy path  
- [ ] Content reviewed for educational accuracy tone + disclaimer  
- [ ] SEO meta present for routable pages  
- [ ] Code reviewed / documented if architectural  
- [ ] Deployed to staging and smoke-tested  

---

## 48. Final Product Checklist

### Brand & content
- [ ] Name **KrishMithr** everywhere  
- [ ] Tagline correct  
- [ ] Disclaimer on footer and disease details  

### Core flow
- [ ] Soil → Crop → Disease → Details  
- [ ] Progress indicator  
- [ ] Back / Start Again  

### Data
- [ ] ≥7 soils  
- [ ] ≥5 crops per soil  
- [ ] ≥3 diseases per crop  

### UX features
- [ ] Search  
- [ ] Filters  
- [ ] Favorites  
- [ ] Dark mode  

### Pages
- [ ] Home, About, Contact, Thank You, 404  
- [ ] Privacy, Terms, Cookies (as applicable)  

### Quality
- [ ] Responsive  
- [ ] Accessible  
- [ ] Performance pass  
- [ ] Security pass (platform)  

### Platform extras
- [ ] Auth + RBAC  
- [ ] Admin CRUD  
- [ ] Review MongoDB least-privilege role and API authorization policies  
- [ ] Sitemap, robots, OG  
- [ ] Analytics  
- [ ] Production deploy HTTPS  

---

## Appendix A — Feature Spec Template (applied above)

For every major feature document:

| Field | Meaning |
|-------|---------|
| **Purpose** | Why the feature exists |
| **User** | Who uses it |
| **Inputs** | What the user/system provides |
| **Expected Behavior** | What the system does |
| **Output** | What the user sees/gets |
| **Acceptance Criteria** | Testable pass/fail conditions |

---

## Appendix B — Safety Copy (mandatory)

> Consult a qualified agricultural expert or follow the pesticide label and local agricultural recommendations before applying any crop-protection product.

> Information provided by KrishMithr is for general educational purposes. Consult local agricultural experts for crop-specific recommendations.

---

**Document owner:** Product team  
**Last updated:** 2026  
**Related docs:** `design.md`, `architecture.md`, `phases.md`
