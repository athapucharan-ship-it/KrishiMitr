# KrishMithr — Development Roadmap (Phases)

**Product name:** KrishMithr  
**Document version:** 1.0  
**Related:** `PRD.md`, `design.md`, `architecture.md`  

This roadmap covers evolution from the **existing static KrishMithr site** to a **full Next.js + Supabase platform**, while remaining valid for completing and hardening the static delivery.

---

# PHASE 1 — Project Planning & Setup

## Objective
Finalize scope, initialize repositories and tooling, and establish environments so design and build can proceed without rework.

## Tasks & Subtasks

### 1.1 Requirements finalization
- Review `PRD.md` with stakeholders  
- Confirm **KrishMithr** naming and tagline  
- Lock v1 scope: Soil → Crop → Disease flow + About + legal baseline  
- Mark platform-only items (Auth, Admin CMS) as Phase 4–5  
- Confirm non-goals (no chemical dosing advice, no e-commerce)  

### 1.2 Project initialization
- Ensure folder structure exists (`index.html`, `style.css`, `script.js` **or** Next app)  
- Create `.gitignore`, `.env.example`  
- Add documentation set: PRD, design, architecture, phases, README  

### 1.3 Git / GitHub setup
- Create private/public repo `krishmithr`  
- Initial commit  
- Set `main` protection rules  
- Define branch strategy (`feature/*` → PR → `main`)  
- Add PR template (optional)  

### 1.4 Next.js setup (platform track)
- `npx create-next-app@latest` with App Router  
- ESLint + Prettier  
- Absolute imports `@/`  

### 1.5 TypeScript setup
- Strict mode enabled  
- Shared types: `Soil`, `Crop`, `Disease`, `Enquiry`  
- Path aliases configured  

### 1.6 Tailwind setup
- Install Tailwind  
- Map **design.md** color tokens into theme extension  
- Typography plugin optional  

### 1.7 shadcn/ui setup
- Init shadcn  
- Add primitives: Button, Input, Card, Dialog, Dropdown, Table, Toast, Sheet  
- Align radius/colors with KrishMithr tokens  

### 1.8 Supabase setup
- Create Supabase project (dev)  
- Store URL + anon key in env  
- Service role in server env only  
- Enable email auth  

### 1.9 Environment configuration
- Local `.env.local`  
- Vercel preview/prod env plans  
- Document required vars in README  

## Dependencies
- Product decisions from PRD  
- Access to GitHub, Supabase, Vercel accounts (platform)  

## Expected Output
- Repo live  
- Tooling compiles  
- Env templates ready  
- Scope frozen for v1  

## Testing Checkpoint
- [ ] `npm run dev` starts (platform) **or** `index.html` opens (static)  
- [ ] Lint/typecheck pass  
- [ ] No secrets in git  

## Completion Criteria
- Planning docs approved  
- Project boots cleanly  
- Team can branch and PR  

---

# PHASE 2 — Design & UI System

## Objective
Implement a consistent KrishMithr visual system matching `design.md` (deep green, leaf green, earth, cream).

## Tasks & Subtasks

### 2.1 Brand setup
- Logo lockup 🌱 **KrishMithr**  
- Favicon  
- Tagline placement rules  

### 2.2 Typography
- Load Outfit + Inter  
- Apply display vs body roles  
- Heading scale from design.md  

### 2.3 Colors
- CSS variables / Tailwind theme  
- Light + dark palettes  
- Semantic success/warning/danger  

### 2.4 Components
- Button variants (primary, outline, ghost, icon)  
- Cards (soil, crop, disease, feature)  
- Meta tags, chips, badges  
- Toast  
- Empty/skeleton states  

### 2.5 Header
- Sticky header, blur, logo, nav, search, theme, hamburger  

### 2.6 Footer
- Brand, quick links, disclaimer, copyright  

### 2.7 Buttons
- States: hover, focus, active, disabled, loading  

### 2.8 Forms
- Label, input, textarea, error text, consent  
- Contact form layout  

### 2.9 Responsive system
- Breakpoints 560 / 768 / 900 / 1100  
- Grid 4 → 3 → 2 → 1 cards  
- Mobile nav + mobile search  

## Dependencies
- Phase 1 complete  
- design.md approved  

## Expected Output
- UI kit usable in Storybook or a `/design-system` page  
- Static CSS or Tailwind layer complete  

## Testing Checkpoint
- [ ] Contrast checked light/dark  
- [ ] Focus visible on all controls  
- [ ] Mobile header usable at 360px  

## Completion Criteria
- Components match design tokens  
- No one-off colors outside system  
- Dark mode toggle works  

---

# PHASE 3 — Public Website Development

## Objective
Ship all public-facing pages and the core interactive explorer required by the PRD.

## Tasks & Subtasks

### 3.1 Home
- Hero: heading, subtitle, farm imagery, **Explore Soils** CTA  
- Optional highlights linking to flow  

### 3.2 Explore — Soil (Step 1)
- Render ≥7 soil cards  
- Image, name, description, suitable crops, Select Soil  
- Progress step 1 active  
- Store selection  

### 3.3 Explore — Crop (Step 2)
- Dynamic crops for selected soil (≥5 each)  
- Season/water/duration  
- Season chips + search filter  
- Favorite star  
- View Diseases  

### 3.4 Explore — Disease list (Step 3)
- ≥3 diseases per crop  
- Cause badge, short description  
- View Details  

### 3.5 Explore — Disease details (Step 4)
- Symptoms, cause, conditions, prevention, management  
- Mandatory safety note  
- Back to Diseases / Start Again  

### 3.6 Progress indicator
- Soil → Crop → Disease states  
- Selection summary line  

### 3.7 Search
- Global search soils/crops/diseases  
- Results panel + navigation  

### 3.8 Favorites
- localStorage (or account later)  
- Favorites section empty state  

### 3.9 About
- Mission copy  
- Feature cards: Soil Analysis, Crop Information, Disease Awareness  

### 3.10 Contact
- Form fields per PRD  
- Client validation  

### 3.11 Thank You
- Confirmation + CTA home  

### 3.12 Legal
- Privacy Policy page  
- Terms & Conditions page  
- Cookie Policy if analytics cookies used  

### 3.13 Custom 404
- Branded 404 + Explore Soils CTA  

### 3.14 Navigation wiring
- Header/footer links  
- Smooth scroll / routing  
- Start Again reset  

## Dependencies
- Phase 2 UI system  
- Content dataset (static object or API)  

## Expected Output
- Complete public KrishMithr experience  

## Testing Checkpoint
- [ ] Full happy path soil→detail  
- [ ] Each soil shows different crops  
- [ ] Search opens correct entity  
- [ ] Filters + favorites + dark mode  
- [ ] Mobile flow complete  
- [ ] 404 and thank-you reachable  

## Completion Criteria
- PRD public pages done  
- No blocking UX bugs on primary journey  
- Disclaimers visible  

---

# PHASE 4 — Backend & Database

## Objective
Persist KrishMithr content and enquiries in Supabase with correct schema, APIs, validation, and RLS.

*(Skip to Phase 7 hardening if remaining on pure static hosting.)*

## Tasks & Subtasks

### 4.1 Database creation
- Create Supabase schema migrations  
- Enable extensions (`pgcrypto` for UUID)  

### 4.2 Tables
- `profiles`, `soils`, `crops`, `soil_crops`, `diseases`, `crop_diseases`, `media`, `enquiries`, `site_settings`  

### 4.3 Columns
- Implement columns per `architecture.md`  
- slugs, published flags, timestamps  

### 4.4 Relationships
- FKs and composite PKs on join tables  
- Indexes on `slug`, `name`, `is_published`  

### 4.5 Supabase configuration
- Dev project settings  
- Auth redirect URLs  
- API keys in env only  

### 4.6 Storage
- `media` bucket  
- MIME allowlist, size limits  
- Public read policy as designed  

### 4.7 APIs / Server Actions
- Public list/detail/search  
- Contact create  
- Admin CRUD endpoints  

### 4.8 Validation
- Zod schemas for all mutations  
- Shared types with frontend  

### 4.9 RLS
- Enable RLS all tables  
- Published read for anon  
- Enquiry insert for anon  
- Write for editor/admin  
- Test with anon key  

### 4.10 Seed data
- Seed 7 soils, crops, diseases from static `agricultureData`  
- Verify parity with static v1 content  

## Dependencies
- Architecture approval  
- Supabase project  
- Phase 3 UI can be wired to API progressively  

## Expected Output
- Migrated DB  
- Seeded educational graph  
- Working public read + contact write  

## Testing Checkpoint
- [ ] Anon can read published soils  
- [ ] Anon cannot update soils  
- [ ] Anon can insert enquiry only  
- [ ] Search returns expected rows  
- [ ] FK deletes behave as designed  

## Completion Criteria
- Migrations checked into repo  
- RLS verified  
- APIs documented  
- Service role not in client  

---

# PHASE 5 — Authentication & Admin Dashboard

## Objective
Enable secure admin access to manage content and enquiries.

## Tasks & Subtasks

### 5.1 Admin login
- Login page  
- Supabase email/password  
- Error handling without user enumeration  

### 5.2 Authentication
- SSR session helpers  
- Middleware on `/admin/**`  
- Logout  

### 5.3 Authorization
- `profiles.role`  
- Gate editor vs admin features  
- Server-side checks on every mutation  

### 5.4 Dashboard
- Counts: soils, crops, diseases, unread enquiries  
- Quick links to modules  

### 5.5 CRUD modules
- Soils CRUD  
- Crops CRUD + soil associations  
- Diseases CRUD + crop associations  

### 5.6 Content management
- Publish/unpublish  
- Slug generation  
- Preview link optional  

### 5.7 Enquiries
- List, filter unread  
- Mark read  
- Detail view  

### 5.8 Gallery / Media
- Upload, alt text, delete  
- Attach to entities  

### 5.9 Testimonials / Team / Blog
- **Only if PRD expands**—otherwise mark out of scope  
- Default KrishMithr v1: skip unless requested  

### 5.10 Website settings
- Site name, tagline, footer disclaimer JSON  

### 5.11 Security
- Rate-limit login  
- Audit optional  
- CSRF/session hardening  
- MFA optional for admin  

## Dependencies
- Phase 4 DB + RLS  
- Phase 2 admin UI patterns  

## Expected Output
- Functional `/admin` for editors  
- Content changes reflect on public site  

## Testing Checkpoint
- [ ] Guest redirected from `/admin`  
- [ ] Editor can create/edit disease  
- [ ] Editor cannot manage users (if restricted)  
- [ ] Admin can update settings  
- [ ] Session expires/logout works  

## Completion Criteria
- RBAC enforced server + RLS  
- CRUD stable  
- No privileged key leakage  

---

# PHASE 6 — Content & Media

## Objective
Populate production-quality educational content and optimized media.

## Tasks & Subtasks

### 6.1 Content entry
- Finalize soil descriptions  
- Crop agronomic fields (season, water, duration)  
- Disease sections complete + safety note in management  

### 6.2 Image upload
- Source licensed/real farm images  
- Upload via admin or `public/`  
- Consistent framing  

### 6.3 Image optimization
- WebP/AVIF  
- Card-sized derivatives  
- Lazy loading  
- Alt text for every image  

### 6.4 Blog content
- Optional; skip if not in PRD scope  

### 6.5 Training / Workshop / Service content
- Not core to KrishMithr explorer—only if product expands  

### 6.6 Copy review
- Educational tone  
- No unsafe pesticide prescriptions  
- Legal pages reviewed  

## Dependencies
- Admin CMS or static data edit access  
- design image guidelines  

## Expected Output
- Complete published dataset  
- Media library organized  

## Testing Checkpoint
- [ ] No missing images on primary cards  
- [ ] All diseases have full fields  
- [ ] Disclaimer present on details + footer  

## Completion Criteria
- Content QA signed off  
- Media optimized  
- Seed/export backup taken  

---

# PHASE 7 — SEO & Performance

## Objective
Make KrishMithr discoverable, shareable, and fast.

## Tasks & Subtasks

### 7.1 Meta titles
- Pattern: `{Page} | KrishMithr`  
- Dynamic disease/crop titles  

### 7.2 Meta descriptions
- Unique 140–160 char summaries  

### 7.3 Open Graph
- Default 1200×630 image  
- Per-page OG title/description  
- Absolute HTTPS URLs  

### 7.4 Sitemap
- Generate all public indexable routes  
- Exclude admin/api  

### 7.5 Robots.txt
- Allow public; disallow `/admin`, `/api`  
- Sitemap link  

### 7.6 Structured data
- `Organization` / `WebSite` JSON-LD  
- Optional `FAQPage` if added  

### 7.7 Image optimization
- Next/Image or CDN transforms  
- Dimension attributes to reduce CLS  

### 7.8 Lazy loading
- Below-fold cards and footer  

### 7.9 Performance optimization
- Reduce JS bundle for marketing pages  
- Cache headers  
- Font subsetting  
- Lighthouse pass on Home + Explore  

## Dependencies
- Stable routes from Phase 3–5  
- Production domain (for final OG URLs)  

## Expected Output
- SEO files live  
- CWV targets on track  

## Testing Checkpoint
- [ ] View-source meta correct  
- [ ] sitemap.xml reachable  
- [ ] robots.txt correct  
- [ ] Lighthouse SEO ≥ 90 (indicative)  
- [ ] LCP image optimized  

## Completion Criteria
- Metadata complete  
- Noindex on previews if required  
- Performance budget accepted  

---

# PHASE 8 — Security & Testing

## Objective
Verify correctness, access control, resilience, and accessibility before launch.

## Tasks & Subtasks

### 8.1 Authentication testing
- Valid login  
- Invalid login  
- Logout  
- Password reset flow  

### 8.2 Authorization testing
- Role matrix from architecture  
- Direct API call attempts without cookie  

### 8.3 Form validation
- Contact required fields  
- Admin entity validation edge cases  

### 8.4 API testing
- Happy paths + 400/401/403/404/429  

### 8.5 Database testing
- FK integrity  
- Seed idempotency  
- RLS policy tests  

### 8.6 Security testing
- XSS attempts in form fields  
- Admin route bypass attempts  
- Confirm service role absent from client bundle  
- Headers: CSP, X-Frame-Options, etc.  
- Rate limit contact  

### 8.7 Responsive testing
- 360, 768, 1024, 1440 widths  
- iOS Safari / Android Chrome  

### 8.8 Browser testing
- Chrome, Firefox, Edge, Safari  

### 8.9 Accessibility testing
- Keyboard-only journey  
- Screen reader smoke (VoiceOver/NVDA)  
- axe violations triage  

### 8.10 Performance testing
- Lighthouse / WebPageTest  
- Large disease list scroll  

### 8.11 Error testing
- Offline API failure UI  
- Unknown slug 404  
- Broken image fallback  

### 8.12 Admin dashboard testing
- CRUD end-to-end  
- Upload constraints  
- Enquiry workflow  

### 8.13 End-to-end testing
- Playwright script:  
  1) Soil select → crop → disease detail  
  2) Search navigation  
  3) Contact → thank-you  
  4) Admin forbidden for guest  

## Dependencies
- Feature-complete staging  
- Test accounts  

## Expected Output
- Test report  
- Critical bugs fixed  
- Security checklist signed  

## Testing Checkpoint
- [ ] All critical E2E green  
- [ ] No Sev-1 security issues open  
- [ ] A11y blockers resolved  

## Completion Criteria
- QA sign-off  
- Regression suite runnable in CI  

---

# PHASE 9 — Deployment

## Objective
Ship KrishMithr to production securely with correct env, domain, and checks.

## Tasks & Subtasks

### 9.1 Production environment
- Separate Supabase prod project (recommended)  
- Vercel Production environment  

### 9.2 Environment variables
- Set all prod secrets in Vercel  
- Verify no preview secret bleed  

### 9.3 Supabase production setup
- Run migrations  
- Seed baseline content  
- Auth email templates  
- Storage policies  
- Backup configuration  

### 9.4 Vercel deployment
- Connect `main`  
- Production deploy  
- Preview for PRs  

### 9.5 Domain configuration
- `www` / apex  
- DNS records  

### 9.6 SSL / HTTPS
- Enforce HTTPS  
- HSTS optional  

### 9.7 Final SEO check
- robots, sitemap, OG on live domain  
- Canonical host consistency  

### 9.8 Final security check
- Headers  
- Admin lock  
- RLS spot-check on prod with anon key  

### 9.9 Static alternative deploy
- If static-only: upload `index.html`, `style.css`, `script.js`, `images/`  
- Confirm relative paths  

## Dependencies
- Phase 8 sign-off  
- Domain ownership  

## Expected Output
- Live HTTPS site  
- Admin reachable only to staff  

## Testing Checkpoint
- [ ] Smoke test production happy path  
- [ ] Contact form writes to prod DB  
- [ ] Analytics loads if enabled  

## Completion Criteria
- Production URL stable  
- Rollback plan documented  
- Monitoring on  

---

# PHASE 10 — Launch & Post-Launch

## Objective
Launch confidently and operate KrishMithr with monitoring, backups, and iteration.

## Tasks & Subtasks

### 10.1 Final QA
- Checklist from PRD §48  
- Content spot-check all 7 soils  

### 10.2 Content verification
- Disease safety notes present  
- Legal pages linked  
- Brand name KrishMithr everywhere  

### 10.3 Analytics verification
- Funnel events firing  
- No PII in payloads  

### 10.4 Backup
- DB backup verified restorable  
- Media backup  
- Static export of content JSON  

### 10.5 Monitoring
- Uptime alert  
- Error tracker  
- Performance baseline saved  

### 10.6 Launch checklist
- [ ] DNS live  
- [ ] HTTPS  
- [ ] Admin MFA/password policy  
- [ ] Support email monitored  
- [ ] Social OG preview tested  
- [ ] 404 works  
- [ ] Thank-you works  

### 10.7 Post-launch maintenance
- Weekly content review  
- Dependency updates monthly  
- Security patches ASAP  
- User feedback backlog  
- Consider i18n / regional packs  

### 10.8 Retrospective
- What slipped  
- Metrics vs PRD success targets  
- Next milestone planning  

## Dependencies
- Production deploy  
- Owner assigned for ops  

## Expected Output
- Launched product  
- Ops runbook  
- Backlog prioritized  

## Testing Checkpoint
- [ ] 48h soak: error rate acceptable  
- [ ] First real enquiry received/handled  
- [ ] No critical incidents open  

## Completion Criteria
- Launch announced  
- Ownership transferred to maintainers  
- Docs updated with prod URLs  

---

# Cross-Phase Traceability

| PRD area | Primary phases |
|----------|----------------|
| Soil→Crop→Disease flow | 2, 3, 6 |
| Search/Filter/Favorites/Dark mode | 2, 3, 8 |
| Contact/Thank-you/404/Legal | 3, 4, 7, 8 |
| Admin CMS | 4, 5, 6, 8 |
| SEO/Performance | 7, 9 |
| Security | 4, 5, 8, 9 |
| Launch | 9, 10 |

---

# Static-Only Fast Path

If delivering **only** the current HTML/CSS/JS KrishMithr:

| Phase | Apply? |
|-------|--------|
| 1 | Lightweight (git + docs) |
| 2 | Done via `style.css` |
| 3 | Done via `index.html` + `script.js` |
| 4–5 | Optional / future |
| 6 | Content polish in `script.js` |
| 7 | Meta tags, README deploy notes |
| 8 | Manual browser QA checklist |
| 9 | Static host deploy |
| 10 | Share link + gather feedback |

---

# Phase Status Template

```text
Phase #: 
Status: Not started | In progress | Blocked | Done
Owner:
Start:
End:
Notes:
Open risks:
```

---

**Document owner:** Project management / Engineering lead  
**Last updated:** 2026  
**Companion docs:** `PRD.md`, `design.md`, `architecture.md`
