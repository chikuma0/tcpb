# Development Log

## 2026-03-17 — SEO meta tags, social sharing, and structured data

### What was done
Added all "invisible but important" text to `index.html` — the metadata that search engines, social platforms, and screen readers rely on.

### Changes

| Element | Before | After |
|---------|--------|-------|
| `<html lang>` | `en` | `ja` |
| `<title>` | Tokyo Community Power Bank — Citizen Finance Archive | 東京コミュニティパワーバンク — 市民金融20年の実践アーカイブ |
| Meta description | Missing | わたしのお金がわたしの地域でまわる。東京コミュニティパワーバンクの20年間の市民金融の実践を、114件・5.8億円の融資実績データとともに記録したデジタルアーカイブ。 |
| Open Graph tags | Missing | Full set (title, description, image, locale, site_name, type, url) |
| Twitter Card tags | Missing | summary_large_image with title, description, image |
| Canonical URL | Missing | https://tcpb-site.vercel.app/ |
| JSON-LD structured data | Missing | WebSite schema with Organization publisher |
| robots.txt | Missing | Allow all, sitemap reference |
| sitemap.xml | Missing | Single-page sitemap |
| OG share image | Missing | 1200×630 PNG with tagline, stats, concentric circle motif |

### Copywriting principles
1. **Lead with poetry, ground with data** — tagline "わたしのお金がわたしの地域でまわる" opens every surface, anchored by "114件・5.8億円"
2. **Japanese-first** — primary audience is Japanese civic sector and NPO community
3. **Platform-tailored copy** — meta description, OG, and Twitter card each have different wording optimized for their display constraints
4. **Specificity over generality** — concrete numbers (20年, 114件, 5.8億円) instead of vague claims

### Files changed
- `index.html` — all meta tags, lang attribute, structured data
- `public/robots.txt` — new
- `public/sitemap.xml` — new
- `public/tcpb-og.png` — new (1200×630 social share image)
- `public/favicon-*.png`, `public/apple-touch-icon.png`, `public/android-chrome-*.png`, `public/site.webmanifest` — favicon variants

### Commit
`ed6fcb0` — Add SEO meta tags, OG/Twitter cards, structured data, and social share image

## 2026-03-17 — Logo integration, icon refresh, and branding cleanup

### What was done
Replaced the recreated TCPB wordmark with the actual uploaded logo asset for visible on-page branding, then tuned the logo presence to be quieter and more in line with the site. The oversized hero logo and floating framed badge were removed, and the logo was kept as a small mark in the hero plus a restrained footer treatment.

### Branding decisions
1. **Exact logo on-page** — the uploaded `tcpb-logo.png` is now the source of truth for visible branding
2. **Tone-matched rendering** — the on-page logo is tinted to the site palette using the PNG as a mask, so it sits with the page instead of reading as pure black
3. **Simplified icon mark** — favicon/app icons use a compact `CPB` monogram in the same palette, because the full stacked lockup does not survive at favicon sizes
4. **Share image updated** — the social preview image now includes the TCPB logo, not just the headline and motif

### Files changed
- `src/components/Brand/TcpbLogo.tsx` — switched from recreated text logo to the uploaded PNG, then to theme-tinted mask rendering
- `src/sections/Hero.tsx` — removed the oversized hero logo, kept a small top-left logo
- `src/App.tsx` — reduced footer logo emphasis and removed the floating framed badge
- `public/tcpb-logo.png` — uploaded brand asset
- `public/favicon.svg` — simplified branded monogram for tab/app icon use
- `public/favicon-16x16.png`, `public/favicon-32x32.png`, `public/apple-touch-icon.png`, `public/android-chrome-192x192.png`, `public/android-chrome-512x512.png` — generated icon variants
- `public/tcpb-og.svg`, `public/tcpb-og.png` — refreshed share-card artwork with logo
- `index.html` — icon links and metadata continued to point at the branded asset set

### Production
Deployed to `https://tcpb-site.vercel.app` after each branding pass so visual feedback could be reviewed on the live site, not just locally.

### Notes
- `public/icons.svg` was left alone because it is an unrelated social icon sprite and is not part of TCPB brand presentation.
- No git commit was made for this branding session yet.

## 2026-03-17 — Model diagram readability fix and isolated production deploy

### What was done
Adjusted the Venn-diagram text colors in the model section so the right-hand label, bullet markers, and supporting copy remain readable against the current light page background. The right circle outline and fill were also strengthened slightly so the structure still reads clearly after the text contrast fix.

### Changes

| Area | Before | After |
|------|--------|-------|
| Right-side heading color | Very light beige inherited from earlier dark-background styling | Darker brown with stronger contrast on `#faf7f2` |
| Supporting small text | Low-contrast muted text inside the SVG | Darker supporting text matched to the current light theme |
| Right circle outline | Soft outline that blended into the page | More visible stroke and slightly stronger fill |
| Color management | Hardcoded per-element values scattered in the SVG | Centralized `modelPalette` constants in the component |

### Files changed
- `src/sections/TheModel.tsx` — updated SVG palette, supporting text color, and right-circle stroke/fill balance

### Verification
- Local production build passed with `npm run build`
- Deployed from an isolated worktree so only `src/sections/TheModel.tsx` was pushed, avoiding unrelated local changes on `main`

### Production
Pushed commit `06a35b5` (`Improve model diagram readability`) to `origin/main`.
Vercel production deployment reached `Ready` on 2026-03-17 at 13:37 JST.
