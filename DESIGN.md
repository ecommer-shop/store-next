# DESIGN.md — ecommer

> Design system for the **ecommer** storefront (Next.js). Tagline: *"El futuro del comercio colaborativo."*
> Direction: **modern minimal, tech-forward**, multi-category marketplace (fashion, home, electronics, beauty). The brand identity is solid and technological — geometric, precise, reliable — expressed through deep navy + violet + sky blue on calm neutral surfaces.

---

## Product context

**What we're building.** A multi-vendor marketplace. Sellers ("stores") create accounts and upload products inside our **admin** app; those products surface in the **Store** — the customer-facing storefront this document governs. Admin and Store share the brand but not the layout vocabulary; admin is out of scope here.

**Who shops here.** A broad consumer audience across multiple verticals (fashion, home, electronics, beauty). Low patience for friction. Mobile-first, mixed-device.

**Goals for Store.**
- **Easy to use.** A first-time visitor should understand the layout in seconds: search → browse → view → buy.
- **Confidence-first.** Surface seller, ratings, returns, and shipping early — in a multi-vendor catalog, trust signals do more work than on a single-brand site.
- **Discovery without overwhelm.** Curated rails over endless walls.

**Inspirations & what to borrow.**

| Source | What to take | What NOT to take |
|---|---|---|
| **Airbnb** | Distribution & rhythm: generous imagery, large card grids, prominent search, immersive PDP with a sticky right-rail action panel, calm whitespace, photo-led storytelling | Travel-specific patterns (date pickers, map-as-primary-nav) |
| **Mercado Libre** | Faceted filters, seller storefront block inside the PDP, Q&A section under PDP, payment-method clarity (installments visible early) | Visual density, stacked banners, busy palette |
| **Amazon** | Variant pickers (size / color swatches with stock state), review summary above reviews, "frequently bought together", sticky add-to-cart, robust autocomplete | Visual clutter, blue-link-everywhere |
| **AliExpress** | Light social proof (recent buyers, view counts), trust badges, clear price anchoring on sale, shipping ETA per item | Aggressive countdown timers, sticker-shock overlays, cluttered PDP |

**What Store specifically needs.**
- Search-first navigation with strong autocomplete (categories, products, sellers).
- Curated home rails: *New on ecommer · Trending · From sellers you follow · Recommended for you.*
- Product cards that show **image → price → rating → seller name** in that read order.
- PDP composed of: gallery, name, price, variants, quantity, sticky CTA, **seller card**, trust strip (shipping, returns, secure payment), reviews, Q&A, "more from this seller," "you might also like."
- Cart designed for **multi-seller orders** — group items by seller, show per-seller shipping and ETA, single checkout but transparent breakdown.
- Seller profile page with banner, rating, response time, return policy, and product grid.

**Out of scope for this redesign pass.**
Seller admin (product upload, inventory, order management). Payment back-office. Fulfillment dashboards. Customer support tooling.

---

## 1. Brand & voice

**Personality.** Confident, structured, forward-looking. Ecommer is the modern infrastructure for collaborative commerce — we sound like a well-engineered product, not a market stall.

**Voice.**
- **Clear.** "Free returns within 30 days." Not "Hassle-free returns guaranteed!"
- **Direct.** Verbs first. "Add to bag." "Track order." "Find your size."
- **Specific.** Numbers, materials, dimensions before adjectives.
- **Forward-looking, never hyped.** Avoid *amazing, incredible, game-changing, revolutionary, must-have.*
- **Collaborative framing.** When the moment fits, lean on "together," "shared," "for everyone" — it ties back to the brand line.

**Anti-patterns.** Exclamation marks in transactional copy. ALL-CAPS body. Stock-photo lifestyle without product context. Decorative gradients on data. Generic "shop now" CTAs.

---

## 2. Color

The palette is anchored by four brand colors from the ecommer brand book. Violet is the primary action color, deep navy is the brand anchor (dark surfaces, strong headings, dark mode background), sky blue is the supporting accent, and `#F1F1F1` is the neutral surface tone.

### 2.1 Brand colors (from brand book)

| Hex | RGB | CMYK | Name | Role |
|---|---|---|---|---|
| `#12123F` | 18, 18, 63 | 100 / 97 / 43 / 51 | Deep navy | Brand anchor, dark surfaces, dark-mode bg, deep headings |
| `#9969F8` | 153, 105, 248 | 62 / 63 / 0 / 0 | Violet | Primary action, brand accent, focus ring |
| `#6BB8FF` | 107, 184, 255 | 56 / 18 / 0 / 0 | Sky blue | Secondary accent, info, links, hover gradients |
| `#F1F1F1` | 241, 241, 241 | 7 / 5 / 5 / 0 | Off-white | Inset surface, dividers on dark |

### 2.2 Tokens (light mode)

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#FFFFFF` | Page background |
| `--surface` | `#FAFAFB` | Cards, panels, raised areas |
| `--surface-2` | `#F1F1F1` | Inset / hover surfaces (brand off-white) |
| `--border` | `#E5E5EA` | Hairlines, dividers, input borders |
| `--border-strong` | `#D1D1D8` | Focused inputs, selected states |
| `--fg` | `#12123F` | Primary text (brand deep navy) |
| `--fg-muted` | `#4B4B6B` | Secondary text, captions |
| `--fg-subtle` | `#8A8AA3` | Tertiary, placeholder, disabled |
| `--primary` | `#9969F8` | Brand violet — primary CTAs |
| `--primary-hover` | `#8154E8` | ~8% darker for hover/active |
| `--primary-fg` | `#FFFFFF` | Text on primary (AA verified) |
| `--accent` | `#6BB8FF` | Sky blue — links, secondary accents |
| `--accent-hover` | `#4FA3F5` | Sky blue hover |
| `--success` | `#15803D` | In stock, order confirmed |
| `--warning` | `#B45309` | Low stock, shipping delay |
| `--danger` | `#B91C1C` | Out of stock, errors, destructive |
| `--info` | `#6BB8FF` | Informational badges (uses brand sky blue) |
| `--sale` | `#E11D74` | Sale price, discount badges — distinct from brand violet |

### 2.3 Tokens (dark mode)

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#0A0A2E` | Page background (slightly deeper than brand navy) |
| `--surface` | `#12123F` | Cards (brand deep navy) |
| `--surface-2` | `#1C1C56` | Inset / hover |
| `--border` | `#252570` | Dividers |
| `--border-strong` | `#3A3A8A` | Focus |
| `--fg` | `#F1F1F1` | Primary text (brand off-white) |
| `--fg-muted` | `#B8B8D6` | Secondary |
| `--fg-subtle` | `#8A8AA3` | Tertiary |
| `--primary` | `#9969F8` | Brand violet — works on dark unchanged |
| `--primary-hover` | `#B088FA` | ~8% lighter for hover on dark |
| `--primary-fg` | `#FFFFFF` | |
| `--accent` | `#6BB8FF` | Sky blue |
| `--success` | `#4ADE80` | |
| `--warning` | `#FBBF24` | |
| `--danger` | `#F87171` | |
| `--info` | `#6BB8FF` | |
| `--sale` | `#FB6FA8` | |

### 2.4 Signature gradient

The brand book uses a navy → violet → sky-blue gradient on key marketing surfaces (login backgrounds, hero blocks, brand splashes). Reproduce it consistently:

```css
--gradient-brand: linear-gradient(135deg, #12123F 0%, #9969F8 60%, #6BB8FF 100%);
```

**Use sparingly.** Reserved for: the homepage hero, the empty-cart illustration backdrop, the auth screens, and the email header. Never behind body copy. Never as a button background — violet flat is the CTA.

### 2.5 Rules

- **One primary, used sparingly.** Violet primary is for the single most important action per view (Add to bag, Checkout, Place order). Never two primary buttons on screen at once.
- **Sky blue is for links and info, never for CTAs.** If both blue and violet appear in the same module, blue is supporting.
- **Sale color is for price + badge only.** Magenta pink is intentionally outside the brand triad so discounts don't blend into the violet primary.
- **All text/background pairings must meet WCAG AA** (4.5:1 body, 3:1 large). `#9969F8` on white passes for large text and UI elements but **not body copy** — never use violet for paragraph text.
- **No semi-transparent text on photos.** Use a solid scrim (`rgba(18,18,63,0.55)` — navy-tinted) and opaque text.

---

## 3. Typography

### 3.1 Families (from brand book)

- **Primary — `Gilroy`.** Used for all display, headings, and UI copy where licensing permits. Geometric sans, modern, friendly. Weights 400 / 500 / 600 / 700.
- **Secondary — `Poppins`.** Web fallback when Gilroy cannot be served (no web license, restricted environments). Weights 400 / 500 / 600 / 700. Loaded from Google Fonts.
- **System fallback stack.** `Gilroy, Poppins, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- **Mono (SKU, order IDs, tabular prices).** `JetBrains Mono` or `ui-monospace`.

No serif. The brand identity is technological and structured — serifs read as editorial and break the system feel.

### 3.2 Scale (rem, mobile-first; bump one step at `md` for display sizes)

| Token | Size | Line height | Use |
|---|---|---|---|
| `text-xs` | 0.75 | 1.5 | Microcopy, legal |
| `text-sm` | 0.875 | 1.5 | Secondary, captions |
| `text-base` | 1 | 1.6 | Body, descriptions |
| `text-lg` | 1.125 | 1.5 | Lead paragraph |
| `text-xl` | 1.25 | 1.4 | Section labels, card titles |
| `text-2xl` | 1.5 | 1.3 | Subsection headings |
| `text-3xl` | 1.875 | 1.2 | Page titles |
| `text-4xl` | 2.25 | 1.15 | PDP product name (desktop) |
| `text-5xl` | 3 | 1.1 | Hero, campaign |
| `text-6xl` | 3.75 | 1.05 | Editorial only |

### 3.3 Rules

- **Brand-style lowercase** for the wordmark and lockups only — body copy uses sentence case.
- **Body text is never centered.** Centered text belongs to short headings only.
- **No line of body copy longer than ~70 characters.** Use `max-w-prose` on long-form.
- **Prices use tabular numerals** (`font-variant-numeric: tabular-nums`) so they align in lists and tables.
- **All-caps reserved for category labels and badges, not headings.** Track +4% when used.
- **Heading weight.** 600 for `text-xl`–`text-3xl`, 700 for `text-4xl`+. Never 800/900 — they break the geometric feel.

---

## 4. Spacing & layout

### 4.1 Spacing scale (4px base)

`0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128`

Match Tailwind's default scale. **Never invent a one-off value.** If something needs `13px`, the design is wrong upstream.

### 4.2 Grid

- **Container max-width.** `1280px` for storefront, `1440px` for editorial / campaign pages, full-bleed allowed for hero imagery and gradient blocks.
- **Gutter.** `24px` mobile, `32px` tablet, `48px` desktop.
- **Columns.** 4 mobile, 8 tablet, 12 desktop. Product grids: 2 / 3 / 4 columns at the same breakpoints.

### 4.3 Breakpoints

| Name | Min width |
|---|---|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

### 4.4 Density

- **Generous, not cramped.** Card padding `16px` mobile, `24px` desktop. Section vertical rhythm `64px` mobile, `96px` desktop.
- **Breathing room around the primary action.** At least 24px gap between the Add-to-bag button and the next element.

---

## 5. Radius, elevation, borders

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | `4px` | Badges, inline tags |
| `--radius-md` | `8px` | Buttons, inputs, small cards |
| `--radius-lg` | `12px` | Product cards, modals, sheets |
| `--radius-xl` | `20px` | Hero blocks, featured cards, gradient panels |
| `--radius-full` | `9999px` | Pills, avatars |

The brand icon is angular and geometric — radii stay restrained (no `2xl+` blob shapes).

**Elevation.** Prefer borders over shadows. Shadows are reserved for floating overlays (menus, toasts, drawers). Use a navy-tinted shadow so they feel native to the brand.

- `--shadow-sm` — `0 1px 2px rgba(18,18,63,0.06)` — subtle lift on hover
- `--shadow-md` — `0 4px 12px rgba(18,18,63,0.10)` — dropdowns, popovers
- `--shadow-lg` — `0 12px 32px rgba(18,18,63,0.14)` — modals, sheets
- `--shadow-xl` — `0 24px 48px rgba(18,18,63,0.18)` — full-screen overlays

**Borders.** 1px `--border` is the default. 1px `--border-strong` on focus and selection. Never 2px+ except for the focus ring.

---

## 6. Components

### 6.1 Buttons

- **Primary.** `--primary` (violet) bg, white text, `--radius-md`, padding `12px 20px`, weight 500. One per view.
- **Secondary.** `--fg` (deep navy) text on transparent bg, 1px `--border-strong`. Same padding.
- **Tertiary / ghost.** `--fg-muted` text, no border, sky-blue underline on hover.
- **Destructive.** `--danger` bg with white text. Confirmation modal required for irreversible actions.
- **Sizes.** `sm` 32px / `md` 40px (default) / `lg` 48px / `xl` 56px (used on PDP Add-to-bag only).
- **Loading.** Replace label with spinner; keep the button width fixed to prevent layout shift.
- **Disabled.** `--fg-subtle` text, no pointer, no opacity tricks. Always include `aria-disabled`.

### 6.2 Inputs

- **Height.** 44px minimum (touch target). 48px on checkout for finger comfort.
- **Border.** 1px `--border`, 1px `--border-strong` on hover, 2px `--primary` (violet) ring on focus.
- **Label position.** Above input. Floating labels only on the checkout single-column form.
- **Error state.** `--danger` border, message below the input in `text-sm`, with an icon. Never red placeholder text.

### 6.3 Product card

- Square 1:1 image by default (4:5 if catalog is fashion-heavy).
- Image fills card width, `--radius-md`, `object-cover`.
- Title: `text-base`, max 2 lines with ellipsis, color `--fg` (deep navy).
- Price: `text-base` weight 600. Strikethrough original above sale price in `--fg-subtle`.
- One badge max (New = sky blue, Sale -20% = magenta, Low stock = warning). Top-left corner.
- Wishlist heart top-right, violet when active (`--primary`), gray outline otherwise.
- Hover: 4px lift via `--shadow-sm`, image swap to second photo if available, 200ms ease.
- Mobile: no hover, tap target is the entire card.

### 6.4 Navigation

- **Top bar.** 64px tall, sticky on scroll, white bg with 1px bottom border. No shadow on scroll — border is enough.
- **Logo.** Brand wordmark in deep navy on white, white on dark surfaces. Never tinted violet.
- **Mega menu.** Opens on hover (desktop) / tap (mobile). Categories left, featured products right, max 4 columns.
- **Search.** Always visible as an input on `md+`, icon-only below. Returns results inline with image thumbnails.
- **Cart icon.** Bag silhouette with item count in a `--primary` violet pill, top-right.

### 6.5 Filters & sort

- **Sidebar on desktop**, bottom sheet on mobile. Never both at once.
- Use checkboxes for facets (multi-select), radios for sort (single-select). Never a custom dropdown for facets — it hides options.
- Selected filters appear as removable pills above the grid — violet bg, white text.
- "Clear all" link in `--fg-muted`, right-aligned.

### 6.6 PDP (product detail page)

- **Gallery left, info right** on desktop, stacked on mobile.
- Image gallery: thumbnails vertical-left on desktop, swipeable carousel on mobile, with paged dots (violet for active).
- Info column: name → price → variants → quantity → Add to bag → trust strip (free shipping, returns) → description → specs.
- **Sticky Add-to-bag** on mobile once the user scrolls past the inline button.

### 6.7 Cart & checkout

- **Single-column checkout.** No accordions. Each step is a full page or a clearly delimited section.
- **Order summary** sticky on the right at `lg+`, collapsible at the top on mobile.
- **No surprise costs.** Show shipping and tax estimate before email is entered.
- **One CTA per step**, full-width on mobile, auto-width on desktop.

### 6.8 Feedback

- **Toasts.** Bottom-right desktop, bottom mobile. `--shadow-lg`, `--radius-md`, auto-dismiss at 4s, manual dismiss with X. Success uses a green left border, info uses sky blue, warning uses amber, error uses red. Background stays neutral.
- **Inline errors** for form fields. Banner-level only when the entire page fails.
- **Skeletons over spinners.** Skeleton blocks match the final layout. Spinners only for sub-second waits inside a button.

### 6.9 Hero / brand moments

- **Homepage hero** uses `--gradient-brand` as background, white headline, white CTA outline or white-bg + navy text (high contrast).
- **Auth screens** use the gradient at 100% on one half (illustration side) and white on the form side.
- **Category landings** keep the gradient as a thin top accent band only — body of the page stays neutral.

---

## 7. Imagery

- **Product photography is king.** Consistent background (white or `#F1F1F1`) across the catalog. No mixed backgrounds on a grid page — it makes the page feel like a flea market.
- **Lifestyle imagery** for hero blocks and category landings, never for product cards.
- **Aspect ratios.** 1:1 default, 4:5 for fashion, 16:9 for hero, 3:2 for editorial.
- **No text baked into images.** All copy lives in HTML so it can be localized and indexed.
- **Lazy-load below the fold.** Use `loading="lazy"` and Next.js `<Image>` with explicit sizes.
- **Gradient backdrops** are only for hero / marketing surfaces — not behind product imagery.

---

## 8. Iconography

- **Library.** [Lucide](https://lucide.dev) — 1.5px stroke, 24px default size. Consistent silhouette across the system.
- **Geometric, never rounded-cartoon.** The brand icon is angular — match its feel.
- **Stroke only, no fills**, except for the wishlist heart (filled violet when active) and rating stars.
- **Size pairing.** Icons match the text size next to them: 16px with `text-sm`, 20px with `text-base`, 24px with `text-lg+`.
- **Never decorative on data.** Every icon must communicate something or be hidden from screen readers (`aria-hidden`).

---

## 9. Motion

- **Duration.** 150ms for state changes (hover, focus), 250ms for entering / exiting (modals, sheets), 400ms for page-level transitions.
- **Easing.** `cubic-bezier(0.2, 0, 0, 1)` for entering, `cubic-bezier(0.4, 0, 1, 1)` for exiting. Avoid linear, avoid bounces.
- **Respect `prefers-reduced-motion`.** Disable parallax, autoplay, and entrance animations. Keep functional feedback (focus, hover) but instant.
- **No autoplay video** on the homepage. No autoplay carousels — they hurt conversion and accessibility.
- **Gradient shift** on the hero is allowed (slow, 8–12s, low-amplitude), gated by `prefers-reduced-motion`.

---

## 10. Accessibility

- **Focus ring.** 2px `--primary` (violet) outline, 2px offset, never removed. Visible on keyboard, hidden on mouse via `:focus-visible`.
- **Color is never the only signal.** Stock state, error state, and selection state all use icon + label, not just color.
- **Violet on white** passes AA for UI components and large text but **not body copy** — never set paragraph text in `--primary`.
- **Sky blue links** must be underlined in body copy — color alone is not sufficient signal.
- **Touch targets** are 44×44px minimum.
- **Forms.** Every input has a visible label. Placeholders are not labels. Required fields are marked, not optional ones.
- **Image alt text.** Product alt text follows *"[Product name] in [color], [angle]"*. Decorative images use `alt=""`.
- **Skip link** to main content as the first focusable element.
- **Reading order matches visual order.** Test with tab and screen reader before shipping any new template.

---

## 11. Content & microcopy

- **Buttons are verbs.** "Add to bag", "Place order", "Track shipment" — never "Click here".
- **Prices include currency symbol** appropriate to the user's locale, never just digits.
- **Stock language.** "In stock" / "Only 3 left" / "Sold out" — never "Available" or "Unavailable".
- **Errors explain what to do.** "Card number must be 16 digits" beats "Invalid input".
- **Empty states give a next action.** An empty cart shows "Your bag is empty" + a primary button to "Browse new arrivals", not just an illustration.
- **Spanish-first or bilingual.** The brand tagline is Spanish — confirm the locale strategy and keep both versions tonally identical.

---

## 12. What this design is NOT

- **Not a Shopify clone.** Avoid stock Polaris patterns.
- **Not flashy.** No animated gradients on data, no glassmorphism, no neon stacking. The brand gradient is a moment, not a wallpaper.
- **Not crowded.** If a section needs three CTAs, the section is doing too much.
- **Not exclusionary.** No micro-typography, no thin gray-on-white text, no contrast cheats.
- **Not aggressive with violet.** Violet anchors primary actions and brand moments — splashed everywhere it loses its job.

---

## 13. Quick reference — the four brand colors and their jobs

| Color | Use it for | Don't use it for |
|---|---|---|
| `#12123F` Deep navy | Body text, headings, dark surfaces, dark-mode bg, scrims | Buttons (too close to black), large flat areas in light mode |
| `#9969F8` Violet | Primary CTAs, focus ring, brand pills, wishlist active, active dots | Body copy, links in long-form, large flat backgrounds |
| `#6BB8FF` Sky blue | Links, info badges, secondary accents, hover gradients | CTAs, body copy, error/warning states |
| `#F1F1F1` Off-white | Inset surfaces, product photo backdrops, dividers on dark | Primary page background (use pure white), text |

---

## 14. CSS variables — copy-paste starter

```css
:root {
  --bg: #FFFFFF;
  --surface: #FAFAFB;
  --surface-2: #F1F1F1;
  --border: #E5E5EA;
  --border-strong: #D1D1D8;

  --fg: #12123F;
  --fg-muted: #4B4B6B;
  --fg-subtle: #8A8AA3;

  --primary: #9969F8;
  --primary-hover: #8154E8;
  --primary-fg: #FFFFFF;

  --accent: #6BB8FF;
  --accent-hover: #4FA3F5;

  --success: #15803D;
  --warning: #B45309;
  --danger:  #B91C1C;
  --info:    #6BB8FF;
  --sale:    #E11D74;

  --gradient-brand: linear-gradient(135deg, #12123F 0%, #9969F8 60%, #6BB8FF 100%);

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px rgba(18,18,63,0.06);
  --shadow-md: 0 4px 12px rgba(18,18,63,0.10);
  --shadow-lg: 0 12px 32px rgba(18,18,63,0.14);
  --shadow-xl: 0 24px 48px rgba(18,18,63,0.18);

  --font-sans: "Gilroy", "Poppins", ui-sans-serif, system-ui, -apple-system,
               "Segoe UI", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0A0A2E;
    --surface: #12123F;
    --surface-2: #1C1C56;
    --border: #252570;
    --border-strong: #3A3A8A;

    --fg: #F1F1F1;
    --fg-muted: #B8B8D6;
    --fg-subtle: #8A8AA3;

    --primary-hover: #B088FA;
    --sale: #FB6FA8;
  }
}
```