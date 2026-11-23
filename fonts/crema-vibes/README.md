# Crema Vibes Icon Font

**Version 1.0 | 14 Icons**

A custom icon font designed for James Mwaura's digital presence. Clean, modern, and optimized for web, desktop, and mobile applications.

---

## Quick Start

### CSS Integration

```css
@font-face {
  font-family: 'Crema Vibes';
  src: url('crema-vibes.woff2') format('woff2'),
       url('crema-vibes.woff') format('woff'),
       url('crema-vibes.ttf') format('truetype'),
       url('crema-vibes.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

.crema-icon {
  font-family: 'Crema Vibes' !important;
  speak: never;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## Icon Reference

| Icon | Unicode | CSS Class | HTML Entity |
|------|---------|-----------|-------------|
| Arrow Up | E001 | `.cr-arrow-up` | `&#xe001;` |
| Menu (Hamburger) | E002 | `.cr-menu` | `&#xe002;` |
| Search | E003 | `.cr-search` | `&#xe003;` |
| Trending Up | E004 | `.cr-trending-up` | `&#xe004;` |
| Chip (Data/AI) | E005 | `.cr-chip` | `&#xe005;` |
| Document | E006 | `.cr-document` | `&#xe006;` |
| Target | E007 | `.cr-target` | `&#xe007;` |
| Bar Chart | E008 | `.cr-bar-chart` | `&#xe008;` |
| Layers | E009 | `.cr-layers` | `&#xe009;` |
| Chat Bubble | E010 | `.cr-chat-bubble` | `&#xe010;` |
| Megaphone | E011 | `.cr-megaphone` | `&#xe011;` |
| LinkedIn | E012 | `.cr-linkedin` | `&#xe012;` |
| WhatsApp | E013 | `.cr-whatsapp` | `&#xe013;` |
| Email | E014 | `.cr-email` | `&#xe014;` |

---

## CSS Helper Classes

```css
/* Individual icon classes */
.cr-arrow-up::before { content: '\e001'; }
.cr-menu::before { content: '\e002'; }
.cr-search::before { content: '\e003'; }
.cr-trending-up::before { content: '\e004'; }
.cr-chip::before { content: '\e005'; }
.cr-document::before { content: '\e006'; }
.cr-target::before { content: '\e007'; }
.cr-bar-chart::before { content: '\e008'; }
.cr-layers::before { content: '\e009'; }
.cr-chat-bubble::before { content: '\e010'; }
.cr-megaphone::before { content: '\e011'; }
.cr-linkedin::before { content: '\e012'; }
.cr-whatsapp::before { content: '\e013'; }
.cr-email::before { content: '\e014'; }
```

---

## Usage Examples

### HTML with CSS Classes
```html
<button class="to-top">
  <span class="crema-icon cr-arrow-up" aria-hidden="true"></span>
  <span class="sr-only">Back to top</span>
</button>
```

### HTML with Direct Unicode
```html
<button class="to-top">
  <span class="crema-icon" aria-hidden="true">&#xe001;</span>
</button>
```

### In CSS (Pseudo-element)
```css
.to-top::before {
  font-family: 'Crema Vibes';
  content: '\e001';
}
```

---

## File Formats Included

| Format | Use Case |
|--------|----------|
| `.ttf` | Desktop installation, legacy browser support |
| `.otf` | Desktop installation, macOS/Adobe products |
| `.woff` | Web embedding (legacy) |
| `.woff2` | Web embedding (modern, recommended) |
| `.svg` | Legacy iOS, editing source |

---

## Accessibility

When using icons, always provide accessible alternatives:

```html
<!-- Recommended: Visually hidden text -->
<button class="to-top" aria-label="Back to top">
  <span class="crema-icon cr-arrow-up" aria-hidden="true"></span>
</button>

<!-- Or with screen reader text -->
<button class="to-top">
  <span class="crema-icon cr-arrow-up" aria-hidden="true"></span>
  <span class="sr-only">Back to top</span>
</button>
```

---

## Support

- **Email**: Jasemwaura@gmail.com
- **Website**: https://jasemwaura.com

---

© 2026 James Mwaura. All rights reserved.
