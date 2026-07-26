# Sterling & Black Attorneys — Website

A premium, full-service law firm website built with semantic HTML5, modern CSS
(custom properties, 12-column grid), and vanilla ES6+ JavaScript. No build step
required — open index.html directly or serve the folder with any static server.

## Structure
- /css — tokens.css (design tokens), base.css (reset/typography/layout),
  components.css (nav, buttons, cards, forms, footer, etc.), animations.css
- /js — main.js (nav, reveal-on-scroll, accordion, tabs, search, counters),
  forms.js (multi-step consultation form + contact form validation)
- Pages are flat HTML files at the root, matching the sitemap in sitemap.xml

## Notes
- All imagery is rendered as abstract CSS/SVG art panels rather than stock
  photography — swap `.art-panel` divs for real photography when available.
- Fonts load from Google Fonts (Cormorant Garamond + Inter); self-host for
  production if strict performance budgets require it.
- Forms are front-end only; wire `js/forms.js` submit handlers to a backend
  or form service before going live.
