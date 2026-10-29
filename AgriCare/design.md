# KrishMithr — UI/UX & Design Specification

**Product name:** KrishMithr  
**Tagline:** Smart Farming. Better Decisions. Healthier Crops.  
**Document version:** 1.0  
**Related:** `PRD.md`, `architecture.md`, `phases.md`, existing `style.css`  

---

## 1. Design Philosophy

KrishMithr’s interface should feel like a **modern AgriTech product**, not a basic academic template.

**Principles:**
1. **Clarity over clutter** — one primary action per step  
2. **Guided confidence** — progress, summaries, and clear next steps  
3. **Nature-rooted modernity** — organic palette + crisp digital UI  
4. **Mobile-first farming reality** — large tap targets, readable outdoors  
5. **Trust & responsibility** — calm visuals; safety notes never buried  
6. **Motion with purpose** — subtle feedback, never distraction  
7. **Inclusive by default** — contrast, focus, semantics  

**Design mantra:** *Simple enough for the field. Polished enough for a demo stage.*

---

## 2. Brand Direction

| Attribute | Direction |
|-----------|-----------|
| **Name** | KrishMithr |
| **Personality** | Reliable, green, smart, approachable, educational |
| **Voice** | Clear, respectful, practical, non-alarmist |
| **Avoid** | Neon cyber-agri, cluttered dashboards, aggressive red alerts for normal UI |
| **Logo lockup** | 🌱 + wordmark **KrishMithr** (Outfit/Inter bold) |
| **Tagline** | Smart Farming. Better Decisions. Healthier Crops. |

**Brand metaphor:** A knowledgeable field companion—leaf, soil, and light.

---

## 3. Visual Style

- Soft cream canvases with deep green accents  
- Rounded cards (16px) and pill buttons  
- Subtle elevation shadows (green-tinted, not pure black)  
- Gradient primary buttons (mid green → leaf green)  
- Photography: real farmland, soil textures, crops, leaf close-ups  
- Generous whitespace; section padding ~72px desktop / 56px mobile  
- Progress stepper as a “dashboard-lite” orientation strip  
- Dark mode: blue-slate backgrounds with restrained sage accents, preserved hierarchy  

**Reference implementation:** the root `index.html` tokens and components. `AgriCare/style.css` is retained with the archived standalone page.

---

## 4. Color System

### 4.1 Light theme (primary brand)

| Token | Hex | Role |
|-------|-----|------|
| `--green-deep` | `#1A4D2E` | Headings, logo, strong text accents |
| `--green-leaf` | `#2D6A4F` | Primary interactive, links |
| `--green-mid` | `#40916C` | Gradients, progress active |
| `--green-bright` | `#52B788` | Highlights, completed steps |
| `--green-soft` | `#95D5B2` | Soft fills, hover washes |
| `--green-pale` | `#D8F3DC` | Chips, icon button bg, selected wash |
| `--earth` | `#8B5E3C` | Earth meta tags, secondary accent |
| `--earth-light` | `#C4A484` | Soft earth backgrounds |
| `--cream` | `#FAF6F0` | Page background |
| `--cream-dark` | `#F0E6D8` | Alt chips / subtle surfaces |
| `--soft-yellow` | `#F4E8C1` | Notes, badges, warmth |
| `--white` | `#FFFFFF` | Cards |
| `--text` | `#1B2B22` | Body text |
| `--text-muted` | `#5A6B60` | Secondary text |
| `--border` | `rgba(45,106,79,0.15)` | Dividers |
| `--danger` | `#C0392B` | Errors only |
| `--warning` | `#D4A017` | Warnings / favorite active |

### 4.2 Dark theme

| Token | Approx | Role |
|-------|--------|------|
| Page bg | `#1C282E` | Blue-slate canvas |
| Card | `#25343B` | Surfaces |
| Text | `#E9EFED` | Primary text |
| Muted | `#9EAFAD` | Secondary |
| Accent | `#A9C9B3` / `#86B89B` | Restrained sage interactions |
| Border | `#405259` | Dividers |

**Rule:** Keep green for selected actions and agriculture cues. Use the slate canvas to avoid a saturated full-screen dark-green treatment.

### 4.3 Semantic colors

- **Success:** green-mid / green-bright  
- **Info:** green-leaf  
- **Warning:** soft-yellow bg + warning text  
- **Error:** danger  
- **Focus ring:** green-bright at 3px  

---

## 5. Typography

### Font families

| Role | Family | Fallback |
|------|--------|----------|
| **Display / headings** | Outfit | Inter, system-ui, sans-serif |
| **Body / UI** | Inter | system-ui, sans-serif |

**Source:** Google Fonts  
**Loading:** `preconnect` + display swap  

### Tone
- Headings: confident, slightly tight letter-spacing (−0.02em)  
- Body: 1.6 line-height for outdoor readability  

---

## 6. Font Sizes

| Token | Size | Usage |
|-------|------|--------|
| Display / Hero H1 | `clamp(2.2rem, 5vw, 3.4rem)` | Hero title |
| Section H2 | `clamp(1.7rem, 3.5vw, 2.3rem)` | Section titles |
| Card H3 | `1.15rem` – `1.2rem` | Card titles |
| Body | `1rem` (16px base) | Paragraphs |
| Body large | `1.05rem` – `1.15rem` | Hero subtitle, section sub |
| Small / meta | `0.8rem` – `0.88rem` | Tags, captions |
| Micro | `0.72rem` – `0.75rem` | Badges, search type labels |
| Button | `0.85rem` – `1rem` | sm / default / lg |
| Logo | `1.35rem` | Header wordmark |

---

## 7. Font Weights

| Weight | Use |
|--------|-----|
| 400 | Body |
| 500 | Nav links, taglines |
| 600 | Buttons, labels, meta tags, steps |
| 700 | Card titles, strong UI |
| 750–800 | Section H2, logo, hero |

---

## 8. Spacing System

Base unit: **4px**

| Token | Value | Use |
|-------|-------|-----|
| space-1 | 4px | Hair gaps |
| space-2 | 8px | Icon gaps, chip internal |
| space-3 | 12px | Compact stacking |
| space-4 | 16px | Default component padding step |
| space-5 | 20–24px | Card gaps, grid gap |
| space-6 | 32px | Detail body sections |
| space-7 | 40px | Section header bottom |
| space-8 | 56–72px | Section vertical padding |
| container | `min(1180px, 92%)` | Page width |

**Card body padding:** 18px  
**Detail body padding:** 32px (22px mobile)  
**Header height:** 72px  

---

## 9. Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `--radius-sm` | 10px | Search results, small panels, detail blocks |
| `--radius` | 16px | Cards, feature cards, filter bar |
| Pill | 999px | Buttons, chips, search input, nav pills, progress steps |

---

## 10. Shadows

| Token | Value | Use |
|-------|-------|-----|
| `--shadow` | `0 8px 30px rgba(26, 77, 46, 0.10)` | Cards rest |
| `--shadow-hover` | `0 16px 40px rgba(26, 77, 46, 0.18)` | Card hover, menus |
| Header scrolled | soft bottom shadow | Sticky depth |
| Dark mode | deeper black-based shadows | Same elevations |

Avoid harsh pure-black shadows in light mode.

---

## 11. Buttons

### Variants
| Variant | Style | Use |
|---------|-------|-----|
| **Primary** | Gradient green-mid → green-leaf, white text, soft green shadow | Select Soil, View Diseases, View Details, Explore Soils |
| **Outline** | Transparent, 2px green-leaf border | Back buttons |
| **Ghost** | Text muted, pale hover | Start Again |
| **Icon** | 42×42 circle, pale green bg | Theme, menu |

### Sizes
- **sm:** 8px 16px, 0.85rem  
- **md:** 12px 22px, 0.92rem  
- **lg:** 16px 28px, 1rem  
- **block:** width 100% on cards  

### Rules
- Border-radius pill  
- Hover: translateY(−2px) + stronger shadow (primary)  
- Active: scale(0.97)  
- Disabled: opacity 0.5, `pointer-events: none`  
- Icon + label gap 8px  
- Min height ~40–44px for touch  

---

## 12. Cards

### Structure
```text
┌─────────────────────────┐
│  IMAGE (160px / 140px)  │  ← optional favorite star overlay
├─────────────────────────┤
│  Title                  │
│  Description (3 lines)  │
│  Meta tags              │
│  [ Primary CTA ]        │
└─────────────────────────┘
```

### Types
- **Soil card** — image, name, description, suitable crops line, Select Soil  
- **Crop card** — favorite, image, name, description, season/water/duration tags, View Diseases  
- **Disease card** — image, cause badge, name, description, View Details  
- **Feature card** — icon, title, text (About)  
- **Disease detail card** — hero image + stacked info blocks  

### Specs
- Background: card surface  
- Border: 1px border token  
- Radius: 16px  
- Hover: lift −6px, stronger shadow, soft green border  
- Selected soil: 3px green ring  

---

## 13. Forms

- Single-column preferred on mobile  
- Max width ~560–640px for contact  
- Label above field (always visible, not placeholder-only)  
- Helper text in muted color  
- Error text below field in danger color  
- Group related fields with 16–20px vertical gap  
- Primary submit full-width on mobile, auto on desktop  
- Consent checkbox + link to Privacy  

---

## 14. Inputs

| Property | Value |
|----------|--------|
| Height | ~42–44px |
| Padding | 10px 14px (search with left icon: 36px left) |
| Radius | Pill for search; 10–12px for standard fields |
| Border | 1.5px border token |
| Background | `--input-bg` |
| Focus | border green-mid + 3–4px soft green glow |
| Placeholder | muted |

**Textarea:** min-height 120px, same border/focus language.  
**Search:** expands slightly on focus (desktop).  

---

## 15. Dropdowns

- Native select styled to match inputs **or** custom listbox  
- Radius 10–12px  
- Max height 280px scroll  
- Option hover: green-pale  
- Keyboard: arrows + Enter + Escape  
- Search results panel is a dropdown pattern: absolute, shadowed, z-index 1100  

---

## 16. Navigation

### Desktop
- Horizontal links as soft pills  
- Active: green-pale bg + deep green text  
- Hover: same language  

### Mobile
- Hamburger → full-width panel under header  
- Stacked links, 12px vertical padding  
- Closes on navigate  
- Separate mobile search bar under header  

### In-flow secondary nav
- Centered Back + Start Again row under grids  

---

## 17. Header

| Element | Spec |
|---------|------|
| Position | Sticky top, z-index 1000 |
| Height | 72px |
| Background | Semi-transparent cream/dark + backdrop blur 14px |
| Border | Bottom 1px border token |
| Left | Logo 🌱 KrishMithr |
| Center/Right | Nav links |
| Right utilities | Search, dark toggle, menu |
| Scrolled | Elevate shadow |

Logo is always home anchor.

---

## 18. Footer

- Background: deep green gradient (`#1A4D2E` → `#0F2A1C`)  
- Text: white / off-white  
- Grid: Brand | Quick links | Disclaimer (3 col → 1 col mobile)  
- Bottom bar: © 2026 KrishMithr  
- Links: muted white → green-soft on hover  
- Disclaimer must remain readable (0.8–0.88rem)  

---

## 19. Hero Section

| Element | Content / Spec |
|---------|----------------|
| Min height | `min(88vh, 720px)` |
| Background | Full-bleed farm photography |
| Overlay | Dark green gradient left-heavy for text contrast |
| Tagline pill | Glass-style translucent chip |
| H1 | Discover the Right Crop for Your Soil |
| Subtitle | Select your soil type and explore… |
| CTA | Explore Soils ↓ (primary lg) |
| Motion | Slow optional Ken Burns on bg; content fade-up |

Ensure WCAG contrast for white text on overlay.

---

## 20. CTA Sections

- Hero primary CTA  
- Card CTAs (one primary each)  
- Section action row (outline + ghost)  
- About → optional Contact CTA band (platform): cream/green pale strip with button  
- 404 / Thank-you centered CTAs  

**Hierarchy:** only one dominant primary CTA in viewport when possible.

---

## 21. Page Layouts

### Shell
```text
Header (sticky)
Optional Progress (sticky under header)
Main
  Hero (home)
  Sections (flow + about + favorites)
Footer
Toast (fixed)
```

### Container
Centered `min(1180px, 92%)`.

### Single-column pages
Contact, legal, thank-you, 404: narrow readable measure (~640–720px).

### Admin (platform)
Sidebar + top bar + main content canvas (see §45–48).

---

## 22. Section Layouts

```text
[ Step badge ]
[ H2 ]
[ Subtitle ]
[ Optional filters ]
[ Responsive card grid ]
[ Action buttons ]
```

- Section padding 72px / 56px  
- Alternating bg: cream / cream-dark (bg-alt)  
- Section header centered  

---

## 23. Mobile Layout

- 1 card per row  
- Hamburger nav  
- Search in under-header bar  
- Progress: show numbers; labels for active/completed only if space tight  
- Filters stack vertically  
- Hero min-height ~70vh  
- Footer stacks  
- Sticky header + progress carefully manage vertical space  

---

## 24. Tablet Layout

- 2 cards per row  
- Nav may still collapse depending on 768px breakpoint  
- Filters wrap in one bar  
- Feature cards single column centered max 400px or 2-col if space  

---

## 25. Desktop Layout

- 3–4 cards per row (≥1100px: 4; mid: 3)  
- Full horizontal nav + search  
- Feature grid 3 columns  
- Footer 3 columns  
- Disease detail hero ~260px  

---

## 26. Responsive Breakpoints

| Name | Width | Notes |
|------|-------|-------|
| sm | ≤560px | 1-col cards |
| md | ≤768px | Mobile nav, mobile search |
| lg | ≤900px | 2-col cards; footer 2-col |
| xl | ≤1100px | 3-col cards |
| 2xl | &gt;1100px | 4-col cards |

Implement with mobile-first or desktop-first consistently; current CSS is mostly desktop-first max-width queries—preserve consistency when extending.

---

## 27. Components

| Component | Description |
|-----------|-------------|
| Logo | Icon + wordmark |
| NavLink | Pill link |
| IconButton | Circular control |
| SearchField + Results | Combobox-like |
| Button | Primary/outline/ghost |
| StepBadge | Small uppercase pill |
| ProgressStep | Number + label |
| SoilCard / CropCard / DiseaseCard | Entity cards |
| MetaTag | Season/water/duration chips |
| SeasonChip | Filter chip |
| FavoriteButton | Star overlay |
| DiseaseDetail | Hero + blocks + note |
| FeatureCard | About pillars |
| Toast | Ephemeral feedback |
| EmptyState | Dashed panel |
| Footer | Multi-column |
| Modal (admin) | Confirm delete |
| DataTable (admin) | CRUD lists |
| Sidebar (admin) | Module nav |
| Skeleton | Loading placeholder |
| Badge | Cause / status |

---

## 28. Component States

Every interactive component must define:

- Default  
- Hover  
- Focus-visible  
- Active / pressed  
- Disabled  
- Loading (if async)  
- Error (if validates)  
- Empty (if data-bound)  

---

## 29. Hover States

- **Cards:** lift + shadow + border tint  
- **Card images:** scale 1.08  
- **Primary button:** darker gradient + lift  
- **Outline button:** pale green fill  
- **Ghost:** pale fill  
- **Nav link:** pale pill  
- **Favorite:** scale 1.1, gold tint  
- **Footer links:** green-soft  

Cursor pointer on all clickable elements.

---

## 30. Focus States

```css
:focus-visible {
  outline: 3px solid var(--green-bright);
  outline-offset: 3px;
}
```

- Never remove focus outlines without replacement  
- Search input uses glow ring instead of harsh outline  
- Skip link becomes visible on focus  

---

## 31. Active States

- Buttons: scale 0.97  
- Nav link active: pale bg + deep text  
- Season chip active: solid green fill, white text  
- Progress step active: pale bg + filled number  
- Soil card selected: green focus ring  
- Favorite active: gold star + warm bg  

---

## 32. Disabled States

- Opacity 0.5  
- `cursor: not-allowed`  
- No hover lift  
- Announce disabled on buttons via `aria-disabled` or `disabled`  
- Admin: disable Save until dirty + valid  

---

## 33. Loading States

| Context | UI |
|---------|-----|
| Grid fetch | 3–8 skeleton cards (image bar + lines) |
| Button submit | Spinner icon + label change; disabled |
| Page transition (platform) | Top thin green progress bar optional |
| Image | Pale green placeholder until loaded |

Prefer skeletons over spinners for content-heavy areas.

---

## 34. Empty States

- Centered icon (muted green)  
- Short explanation  
- Optional CTA  
- Dashed border panel for favorites empty  
- Never show empty white main with no message  

---

## 35. Error States

- **Inline field errors:** text under input, danger color, `aria-invalid`  
- **Toast errors:** brief, non-blocking  
- **Page errors:** illustration/icon + retry  
- **Image fail:** emoji fallback in image well  
- Avoid blamey copy; prefer “Something went wrong—try again.”  

---

## 36. Animations

| Name | Spec |
|------|------|
| fadeIn | opacity 0→1, 0.5s |
| fadeUp | 24px up + fade, 0.45–0.8s |
| cardIn | slight scale + up, staggered delays |
| heroZoom | bg scale 1.02→1.08 over 20s |
| toast | fade + slide up |
| hover transforms | 0.28s cubic-bezier(0.4,0,0.2,1) |

**Do not:** bounce endlessly, parallax heavy, or animate large layout shifts.

Respect `prefers-reduced-motion: reduce` by disabling non-essential motion.

---

## 37. Page Transitions

- Static SPA sections: show/hide with fade; smooth scroll into view  
- Platform MPA/Next routes: soft fade or none; preserve header  
- After Select Soil / Crop: smooth scroll to next section  
- Avoid full white flash  

---

## 38. Image Guidelines

| Type | Guidance |
|------|----------|
| Hero | Landscape farm, high quality, overlay-friendly dark areas |
| Soil | Texture / field close-ups matching soil character |
| Crop | Recognizable field or harvest context |
| Disease | Leaf/stem symptom imagery (educational, not graphic gore) |
| OG | 1200×630 brand+farm composite |

**Rules:**
- Real photography preferred (Pexels or owned)  
- Consistent aspect in cards (~3:2 crop via cover)  
- Alt text describes content  
- No watermarks  
- Optimize file size  
- Fallback emoji/gradient if load fails  

---

## 39. Icon Guidelines

- **Primary set:** Font Awesome 6 (solid) for UI actions  
- **Brand/feature:** emoji or simple SVG (🌱 🌾 🦠)  
- **Sizes:** 0.85rem inline; ~1rem buttons; feature ~2.5rem  
- **Color:** inherit text or muted; warnings in gold  
- Icon-only controls need `aria-label`  
- Keep style consistent (solid FA vs mixed outlines)  

---

## 40. Accessibility (Design)

- Contrast: body text on cream ≥ 4.5:1; large text ≥ 3:1  
- Dark mode re-checked for mint on forest  
- Focus visible always  
- Don’t rely on color alone (cause badge + text)  
- Motion reduction  
- Hit areas ≥ 40px  
- Logical heading order  
- Form errors linked via `aria-describedby`  
- Progress as ordered list / steps with text  

---

## 41. Visual Hierarchy

1. Hero / section title  
2. Primary CTA  
3. Card titles  
4. Meta tags  
5. Supporting body  
6. Ghost actions / legal  

Use size, weight, and color—not only size—to establish order.

---

## 42. Content Hierarchy

**Flow pages:**
- Step badge → Title → Subtitle → Context line (selected soil/crop) → Content → Actions  

**Disease detail:**
- Name → Context tags → Summary → Symptoms → Cause → Conditions → Prevention → Management → Important Note  

**About:**
- Title → Mission paragraph → 3 feature pillars  

---

## 43. CTA Placement

| Location | CTA |
|----------|-----|
| Hero left/content block | Primary Explore |
| End of each card | Primary step action |
| Below grids | Back (outline) leftish / Start Again (ghost) |
| Favorites card | Open Crop |
| Sticky progress | Not a CTA—orientation only |
| Footer | Text links only (low emphasis) |

Primary CTAs above the fold on hero; repeated naturally in cards.

---

## 44. Form UX

- Labels always visible  
- Validate on blur + on submit  
- Preserve user input on failed submit  
- Disable double-submit  
- Success leaves the form (thank-you)  
- Phone optional; email required  
- Show required indicators (*)  
- Mobile: `inputmode` appropriate  
- Autocomplete attributes set  

---

## 45. Admin Dashboard UI

### Layout
```text
┌──────────────────────────────────────┐
│ Top bar: logo, user, logout          │
├────────┬─────────────────────────────┤
│ Side   │ Page title + primary action │
│ nav    │ Stats cards (optional)      │
│        │ Table / form canvas         │
└────────┴─────────────────────────────┘
```

### Visual
- Sidebar: deep green or dark forest  
- Active nav: pale green pill  
- Canvas: cream/gray-soft  
- Stats: small cards with icon + metric  
- Dense but breathable; 16–24px gaps  

### Tone
Professional utility; same brand tokens; less marketing flourish.

---

## 46. Admin Tables

| Column patterns | Actions |
|-----------------|---------|
| Name, status, updated | Edit, Delete |
| Search + filter row above | |
| Pagination footer | |
| Row hover pale | |
| Sticky header optional | |

- Empty state with Create CTA  
- Confirm modal on delete  
- Status badges: Published / Draft  

---

## 47. Admin Forms

- Two-column on desktop for short fields; one-column long text  
- Image upload dropzone with preview  
- Sticky save bar on long forms (optional)  
- Markdown/plain textarea for long disease fields  
- Association pickers: soil multi-select, crop multi-select  
- Validation summary at top on failed save  

---

## 48. Admin Navigation

**Sidebar items (example):**
- Dashboard  
- Soils  
- Crops  
- Diseases  
- Media  
- Enquiries  
- Settings  
- Users (Admin only)  

**Mobile admin:** collapsible sidebar / drawer  
**Active state:** clearly marked  
**Logout** always available  

---

## Appendix — Design Tokens Quick Reference

```css
--green-deep: #1a4d2e;
--green-leaf: #2d6a4f;
--green-mid: #40916c;
--green-bright: #52b788;
--green-soft: #95d5b2;
--green-pale: #d8f3dc;
--earth: #8b5e3c;
--cream: #faf6f0;
--text: #1b2b22;
--radius: 16px;
--radius-sm: 10px;
--header-h: 72px;
--font: "Inter", system-ui, sans-serif;
--font-display: "Outfit", "Inter", system-ui, sans-serif;
--transition: 0.28s cubic-bezier(0.4, 0, 0.2, 1);
```

---

## Appendix — Do / Don’t

| Do | Don’t |
|----|-------|
| Use cream + deep green system | Introduce random blues/purples as brand |
| Keep one primary CTA per card | Stack multiple primaries |
| Use real farm imagery | Use generic clipart |
| Show safety note prominently | Hide pesticide disclaimer |
| Design empty states | Leave blank grids |
| Maintain dark mode contrast | Pure black + pure white only |

---

**Document owner:** Design / Frontend  
**Last updated:** 2026  
**Source of truth for live static UI:** `style.css` + `index.html`
