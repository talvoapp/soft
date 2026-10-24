# Changelog

All notable changes to **Talvo Shop** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **Smart Start Button** — Landing CTA now detects if Talvo Desktop is installed
  - Attempts to open `talvo://settings/shop` protocol handler
  - Falls back to GitHub Releases download page if not installed
  - Caches successful detection in `localStorage` to speed up future attempts
  - Shows loading state (`Opening...`) during detection

### Changed
- **Landing.tsx** — All CTA buttons (`Hero`, `Pricing`, `Final CTA`, `Header`, `Mobile menu`) now use unified `onStart()` handler
- **package.json** — Renamed from `soft` to `talvo-shop`, version bumped to `0.1.0`, added repository metadata

### Fixed
- **TypeScript build errors** — `ShopConfig` interface now has all fields optional to match real API responses
- **Footer.tsx** — Safe optional chaining on `config?.basic` / `config?.contact` / `social` properties
- **useShopBootstrap.ts** — Type narrowing for `identifier: string | undefined` before passing to `resolveShop()`
- **tsconfig.json** — Removed deprecated `baseUrl` (TypeScript 6.0 warning)

---

## [0.1.0] - 2026-10-21

### Added

#### Core Infrastructure
- Initial project setup: **Vite + React 19 + TypeScript 6**
- Tailwind CSS v3 with custom `Cairo` font family
- Path alias `@/*` → `./src/*`
- `.env` protection via `.gitignore` + `.env.example` template
- Deployment configuration for Vercel (`vercel.json` with SPA rewrites)

#### Landing Page
- **Hero section** — Headline, subheadline, dual CTAs, trust badges
- **Stats bar** — 4 key metrics (1000+ shops, 50K+ orders, 99.9% uptime, 4.9/5 rating)
- **Features grid** — 6 feature cards with gradient icons
- **How It Works** — 3-step onboarding flow
- **Pricing** — 3 plans (Starter 200 EGP, Pro 500 EGP, Enterprise 1000 EGP)
- **Testimonials** — 3 customer reviews with ratings
- **FAQ** — 6 expandable questions
- **Final CTA** — Conversion-focused section with gradient background
- **Footer** — 4-column layout with links and brand info
- **Sticky header** — Logo, navigation, login/signup buttons
- **Mobile menu** — Responsive navigation for small screens

#### Shop System
- **Multi-tenant routing** — `/elmasa` (slug) or `/3` (tenant_id) support
- **Shop bootstrap** — `resolveShop()` fetches shop URL from Cloud API
- **Master API client** — Connects to tenant's Cloudflare Tunnel backend
- **Dynamic theme** — Header, footer, colors, custom CSS from `theme_config`
- **Dynamic homepage** — Renders 35+ block types from `homepage_layout`
  - Hero, Hero Split, Heading, Text, Rich Text, Image, Button, Divider, Spacer
  - List, Quote, Alert, Product Grid, Featured Product, Categories
  - Banner, Promo Strip, Countdown, Newsletter, Testimonial
  - Testimonials Grid, FAQ, Social Links, Contact Form, CTA Section
  - Stats, Icon, Icon Box, Video, Custom HTML, Columns, Container
- **Content pages** — `/p/:slug` renders `custom_pages` from settings
- **Product grid** — Responsive 2/3/4/5 column layouts
- **Product detail** — Image, price, discount, quantity selector
- **Categories** — Browse products by category
- **Search** — Full-text search with query highlighting

#### Cart & Checkout
- **Cart sidebar** — Slide-in from left with item management
- **Per-tenant cart isolation** — Each shop has separate localStorage key
- **Quantity controls** — Increment/decrement inline
- **Checkout flow** — Order form + summary + order creation
- **Shipping calculation** — Free shipping threshold support
- **Order creation** — POST to `/api/shop/orders` with items + customer data

#### Authentication
- **Customer registration** — Pending approval by admin
- **Customer login** — JWT token stored in `localStorage`
- **Token interceptor** — Auto-attach `Authorization: Bearer` header
- **Profile page** — Edit name, email, address
- **Password change** — Current + new password validation
- **Saved addresses** — Add, delete, manage multiple addresses
- **Wishlist** — Save products for later

#### Orders
- **Orders list** — All customer orders with status badges
- **Order tracking** — Detailed view with items, shipping, timeline
- **Order status labels** — Arabic labels (قيد الانتظار، مؤكد، إلخ)
- **Order cancellation** — Customer can cancel pending/confirmed orders

#### State Management
- **`shopStore`** — Current shop, config, loading, error state
- **`cartStore`** — Cart items, per-tenant isolation, totals
- **`authStore`** — Token, customer, login/logout
- **Zustand** with localStorage persistence

#### UI Components
- **`ErrorBoundary`** — Graceful error handling with retry
- **`Loading`** — Branded loading screen with spinner
- **`ErrorMessage`** — Friendly error page with reload button
- **`Layout`** — Wrapper with Header + Footer + CartSidebar
- **`Header`** — Dynamic links, search, cart count, user menu
- **`Footer`** — Brand, quick links, contact, social icons
- **`ProductCard`** — Image, name, price, add-to-cart button
- **`ProductGrid`** — Responsive product layout
- **`CartSidebar`** — Full cart UI with totals
- **`BlockRenderer`** — Renders all 35+ block types dynamically

#### Utilities
- **`formatPrice()`** — Arabic number formatting with currency
- **`formatDate()`** — Arabic date formatting
- **`getOrderStatusLabel()`** — Map status to Arabic label
- **`getOrderStatusColor()`** — Status badge colors

#### SEO & Meta
- **`react-helmet-async`** integration
- Dynamic `<title>` per shop
- Meta description, keywords, OG tags
- Favicon from `public/favicon.png`
- Theme color meta tag

#### Developer Experience
- **TypeScript strict mode** — `noUnusedLocals: false` for flexibility
- **Oxlint** — Fast Rust-based linter (zero config)
- **Environment variables** — `.env` + `.env.example` pattern
- **Git workflow** — Conventional Commits (`feat:`, `fix:`, `chore:`)
- **Auto-deploy** — Vercel on push to `main`

---

## [0.0.0] - 2026-10-20

### Initial
- Project skeleton created with `npm create vite@latest`
- Initial `README.md` from GitHub template

---

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| `0.1.0` | 2026-10-21 | First functional release — landing + shop system |
| `0.0.0` | 2026-10-20 | Initial project scaffold |

---

## Upcoming (Roadmap)

### [0.2.0] — Planned
- Desktop protocol handler registration in Talvo Desktop installer
- Shop reviews and ratings
- Product comparison
- Related products carousel
- Advanced filters (price range, brand, category)
- Wishlist UI integration
- Newsletter subscription flow
- Contact form submission handling
- Multi-currency support

### [0.3.0] — Planned
- PWA support (offline mode)
- Push notifications
- Order tracking with real-time updates
- Payment gateway integration (Paymob, Stripe)
- Multiple addresses per order
- Coupon codes system
- Abandoned cart recovery

### [1.0.0] — Stable Release
- Full test coverage
- Performance audit
- Accessibility audit (WCAG 2.1 AA)
- Full documentation site
- Admin dashboard (separate app)

---

## Change Types Reference

### Categories

- **`Added`** — New features
- **`Changed`** — Changes to existing functionality
- **`Deprecated`** — Features soon to be removed
- **`Removed`** — Features now removed
- **`Fixed`** — Bug fixes
- **`Security`** — Security vulnerability patches

### Semantic Versioning (SemVer)

Given a version number `MAJOR.MINOR.PATCH`:

- **`MAJOR`** — Incompatible API changes (breaking)
- **`MINOR`** — Backward-compatible new features
- **`PATCH`** — Backward-compatible bug fixes

Example: `1.4.2` means:
- Major version: `1`
- Minor version: `4`
- Patch version: `2`

---

## Contributing

When submitting a pull request:

1. **Add an entry** under `[Unreleased]` in the appropriate category
2. **Reference the issue** if applicable (e.g., `Fixes #123`)
3. **Keep entries concise** — 1 line per change
4. **Use past tense** — "Fixed", "Added", "Changed"

**Example commit:**

```
feat: add product comparison feature

- New ProductComparison component
- Compare up to 4 products side-by-side
- Persists selected products in localStorage

Closes #42
```

**And corresponding CHANGELOG entry:**

```markdown
## [Unreleased]

### Added
- Product comparison — compare up to 4 products side-by-side (#42)
```

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**[Talvo Shop](https://github.com/talvoapp/soft)**

</div>