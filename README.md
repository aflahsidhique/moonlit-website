# Moonlit Foundation — Static Site + Elementor Conversion Guide

## What's inside

```
moonlit/
├── index.html          Home (hero, impact strip, programs, stories, CTA band)
├── about.html          Story, mission/vision, values, timeline, team
├── programs.html       Overview grid + 5 program detail sections (#blood #welfare #relief #environment #youth)
├── events.html         All/Upcoming/Past filter, event cards with date badges
├── gallery.html        Filterable photo grid + lightbox
├── get-involved.html   Volunteer form, blood request form, partner form (#volunteer #blood #partner)
├── contact.html        Info cards, contact form, embedded map
└── assets/
    ├── custom.css      ★ Paste into WordPress Customizer → Additional CSS
    └── main.js         Interactions (see "JS in WordPress" below)
```

Open `index.html` in a browser to preview. Tailwind (CDN) is used **only for layout** in the static preview; every brand style — colors, buttons, cards, blobs, dots, underline strokes — lives in `custom.css` as `mf-*` classes, so the design survives the move to Elementor.

---

## Elementor conversion — the workflow

1. **Fonts & colors (Site Settings):** Global fonts → Poppins (400/500/600/700). Global colors: Primary `#14338C`, Secondary `#F5B921`, Text `#4B5563`, Accent `#0A1F44`. Body background `#F7F9FC`.
2. **Customizer:** Appearance → Customize → Additional CSS → paste the whole of `assets/custom.css`.
3. **Header & Footer:** build once as Theme Builder templates (or with your theme's header/footer builder) copying the markup in any page's `<header>` / `<footer>`. Menu: Home, About Us, Programs, Events, Gallery, Get Involved, Contact + a Button widget styled with class `mf-btn mf-btn-donate`.
4. **Pages:** every section in the HTML files carries a comment telling you which native widget(s) to use. Rebuild top-to-bottom; attach the noted CSS class via **Advanced → CSS Classes** on the element.
5. **Export:** once a page is built, right-click the page in Elementor → Save as Template → export as JSON if you need the .json files.

## Widget mapping (HTML → native Elementor)

| In the HTML | Native Elementor element | CSS class to attach |
|---|---|---|
| `<section>` wrappers | Container (boxed, 1140–1280px) | — |
| Eyebrow labels ("WHAT WE DO") | Text Editor | `mf-eyebrow` |
| Headings with yellow word | Heading — wrap the word in `<span class="mf-hl mf-stroke">` via the heading's HTML | — |
| Paragraphs | Text Editor | — |
| Pill buttons | Button | `mf-btn mf-btn-primary` / `mf-btn-outline` / `mf-btn-red` / `mf-btn-donate` |
| Blob images | Image | wrap container: `mf-blob-frame`, image container: `mf-blob` |
| Dotted pattern / circular badge / avatars | HTML widget (copy the snippet) | `mf-dots` / `mf-badge-circle` / `mf-avatar` |
| Impact stats | Counter (×6) inside a Container | Container: `mf-band`; icons via Icon widget |
| Program cards | Image Box (or Container of Image+Heading+Text+Button) | `mf-card` + `bg-acc-red/green/blue/yellow/purple` on the icon bubble |
| Mission/Vision/Values/pathway cards | Icon Box | `mf-card` |
| Testimonials | Testimonial Carousel (native) or 3 Containers | `mf-card` |
| CTA band columns | Icon Box ×3 in a `mf-band` Container | — |
| Timeline (About) | Text Editor / HTML widget with the `mf-timeline` markup | `mf-timeline`, items `mf-tl-item` |
| Team members | Image Box grid | `mf-card` |
| Event date badge | HTML widget over the Image (Container position: relative) | `mf-date-badge` |
| Filter pills (Events/Gallery) | HTML widget (needs main.js) — or skip filtering and use Elementor Gallery's built-in filter | `mf-pill` |
| Gallery grid + lightbox | **Gallery widget** (native) — lightbox included, no JS needed | — |
| All forms | **Form widget** (Elementor Pro) or a form plugin; fields mirror the HTML | form: `mf-form-card`, inputs: `mf-input` |
| Map | **Google Maps widget**, address "Kozhikode, Kerala" | wrap in rounded Container |
| Newsletter | Form widget (email field + submit) | — |

## JS in WordPress

`main.js` powers: sticky-header shadow, mobile drawer, scroll reveals (`mf-fade`), stat count-up (`data-count`), testimonial carousel, filter pills, gallery lightbox, form validation + toast.

In Elementor, several of these are replaced by native features — Gallery lightbox, Testimonial Carousel, Form validation, and Motion Effects (use Motion Effects → Fade In Up instead of `mf-fade`). Keep `main.js` only if you use the HTML-widget versions of the counters/filters; load it via a code-snippets plugin or your child theme's `functions.php` (`wp_enqueue_script`).

## Content notes

- All photos are Unsplash placeholders with automatic branded fallbacks (`data-fb`) — replace with your real photos in the Media Library.
- Phone, email, addresses, event dates, team names and stats are sample content from the brief — edit freely.
- Per the brief: no Blog/News page and no donation payment page; "Donate Now" / "Support Us Financially" point to the Contact page.
