# Simpliflex Systems Limited — Websites

Static marketing sites for **Simpliflex Systems Limited** (RC-9336897), a Nigerian
technology company. Hosted on **Netlify** (drag-and-drop deploys).

## Structure

| Folder | Live URL | Netlify project | Deploy = drag this folder |
|---|---|---|---|
| `simpliflex-umbrella/` | https://simpliflex.com.ng | `simpliflex.com.ng` | `simpliflex-umbrella` |
| `simpliflex-voice-site/` | https://voice.simpliflex.com.ng | `voice.simpliflex.com.ng` | `simpliflex-voice-site` |
| `brand-assets/` | — | — | logo masters (svg + png) |

### Main site (`simpliflex-umbrella/`)
Company/portfolio homepage + product pages:
- `index.html` — homepage (products: AdRunna, AI Voice, Simpliflex Learn)
- `learn.html` — **Simpliflex Learn** EdTech product page
- `learn-demo/` — live, data-stripped demo of the Curious Kids Encyclopedia
- SEO: `robots.txt`, `sitemap.xml`, Open Graph + JSON-LD in pages, `og-image.png` / `learn-og.png`

### Voice site (`simpliflex-voice-site/`)
AI Voice & WhatsApp Agents product page + its own `robots.txt` / `sitemap.xml` / `voice-og.png`.

## Deploying
1. Open the Netlify project (above) → **Deploys** tab.
2. Drag the corresponding folder into the **Production deploys** drop zone.
3. Wait for green **Published**. Hard-refresh (Ctrl+F5) to clear cached logo/favicon.

## Brand
Logo = green rounded-square **"S"** mark + **Simpliflex** wordmark (Simpli `#0A1628`, flex `#00D47E`).
Fonts: Instrument Serif (headings) + DM Sans (body). Masters in `brand-assets/`.

## Setup notes
- Analytics: **Plausible** (`data-domain="simpliflex.com.ng"`; voice traffic aggregates here).
- DNS: **Qservers**. Email: **Zoho** (`info@simpliflex.com.ng`).
- Google Search Console: Domain property verified (DNS TXT).
