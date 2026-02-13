# Data Model: Advanced Frontend UI/UX Redesign

**Feature Branch**: `004-frontend-ui-redesign`
**Created**: 2026-02-09
**Status**: Ready for Implementation

## Overview

This feature does not introduce new database entities. Instead, it defines **design tokens** - the foundational visual values that create consistency across the UI.

## Design Tokens

### Color Palette

| Token Name | CSS Variable | Value | Usage |
|------------|--------------|-------|-------|
| Background Primary | `--bg-primary` | `#0a0a0f` | Main app background |
| Background Secondary | `--bg-secondary` | `#12121a` | Card backgrounds, sections |
| Background Glass | `--bg-glass` | `rgba(255, 255, 255, 0.05)` | Glassmorphism fill |
| Background Glass Hover | `--bg-glass-hover` | `rgba(255, 255, 255, 0.08)` | Glass hover state |
| Border Glass | `--border-glass` | `rgba(255, 255, 255, 0.1)` | Glass borders |
| Border Glass Hover | `--border-glass-hover` | `rgba(255, 255, 255, 0.15)` | Glass border hover |
| Text Primary | `--text-primary` | `#ffffff` | Main text, headings |
| Text Secondary | `--text-secondary` | `#a1a1aa` | Muted text, descriptions |
| Text Muted | `--text-muted` | `#71717a` | Disabled, placeholder |
| Accent | `--accent` | `#3b82f6` | Primary accent (blue) |
| Accent Hover | `--accent-hover` | `#2563eb` | Accent hover state |
| Accent Glow | `--accent-glow` | `rgba(59, 130, 246, 0.5)` | Accent glow effects |
| Success | `--success` | `#22c55e` | Success states, completed |
| Error | `--error` | `#ef4444` | Error states, destructive |

### Typography Scale

| Token Name | CSS Variable | Value | Usage |
|------------|--------------|-------|-------|
| Font Size XS | `--font-size-xs` | `0.75rem` (12px) | Badges, captions |
| Font Size SM | `--font-size-sm` | `0.875rem` (14px) | Secondary text |
| Font Size Base | `--font-size-base` | `1rem` (16px) | Body text |
| Font Size LG | `--font-size-lg` | `1.125rem` (18px) | Emphasized text |
| Font Size XL | `--font-size-xl` | `1.25rem` (20px) | Section headings |
| Font Size 2XL | `--font-size-2xl` | `1.5rem` (24px) | Page headings |
| Font Size 3XL | `--font-size-3xl` | `1.875rem` (30px) | Hero text |

### Spacing Scale

| Token Name | CSS Variable | Value | Usage |
|------------|--------------|-------|-------|
| Space XS | `--space-xs` | `0.25rem` (4px) | Tight spacing |
| Space SM | `--space-sm` | `0.5rem` (8px) | Compact spacing |
| Space MD | `--space-md` | `1rem` (16px) | Default spacing |
| Space LG | `--space-lg` | `1.5rem` (24px) | Section spacing |
| Space XL | `--space-xl` | `2rem` (32px) | Large gaps |
| Space 2XL | `--space-2xl` | `3rem` (48px) | Page margins |

### Border Radius

| Token Name | CSS Variable | Value | Usage |
|------------|--------------|-------|-------|
| Radius SM | `--radius-sm` | `0.375rem` (6px) | Small elements |
| Radius MD | `--radius-md` | `0.5rem` (8px) | Buttons, inputs |
| Radius LG | `--radius-lg` | `0.75rem` (12px) | Cards |
| Radius XL | `--radius-xl` | `1rem` (16px) | Large cards, modals |
| Radius 2XL | `--radius-2xl` | `1.5rem` (24px) | Hero sections |
| Radius Full | `--radius-full` | `9999px` | Pills, avatars |

### Glassmorphism Properties

| Token Name | CSS Variable | Value | Usage |
|------------|--------------|-------|-------|
| Blur SM | `--blur-sm` | `8px` | Subtle glass effect |
| Blur MD | `--blur-md` | `12px` | Standard glass effect |
| Blur LG | `--blur-lg` | `20px` | Strong glass effect |
| Glass Shadow | `--glass-shadow` | `0 8px 32px rgba(0, 0, 0, 0.3)` | Card shadow |

### Animation Timing

| Token Name | CSS Variable | Value | Usage |
|------------|--------------|-------|-------|
| Duration Instant | `--duration-instant` | `100ms` | Instant feedback |
| Duration Fast | `--duration-fast` | `150ms` | Micro-interactions |
| Duration Normal | `--duration-normal` | `200ms` | Hover transitions |
| Duration Slow | `--duration-slow` | `300ms` | Component enter |
| Duration Slower | `--duration-slower` | `400ms` | Modal/page enter |
| Duration Slowest | `--duration-slowest` | `500ms` | Complex animations |

### GSAP Easing Functions

| Token Name | GSAP Value | Usage |
|------------|------------|-------|
| Ease Out | `power2.out` | Standard exit |
| Ease In | `power2.in` | Standard entrance |
| Ease InOut | `power2.inOut` | Symmetrical transitions |
| Ease Snap | `power3.out` | Snappy interactions |
| Ease Smooth | `power1.out` | Subtle hovers |

## CSS Implementation

```css
:root {
  /* Colors */
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-glass: rgba(255, 255, 255, 0.05);
  --bg-glass-hover: rgba(255, 255, 255, 0.08);
  --border-glass: rgba(255, 255, 255, 0.1);
  --border-glass-hover: rgba(255, 255, 255, 0.15);
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  --accent: #3b82f6;
  --accent-hover: #2563eb;
  --accent-glow: rgba(59, 130, 246, 0.5);
  --success: #22c55e;
  --error: #ef4444;

  /* Typography */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;

  /* Glassmorphism */
  --blur-sm: 8px;
  --blur-md: 12px;
  --blur-lg: 20px;
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  /* Animation */
  --duration-instant: 100ms;
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 400ms;
  --duration-slowest: 500ms;
}
```

## Tailwind Integration

```javascript
// tailwind.config.js extension
module.exports = {
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-glass': 'var(--bg-glass)',
        'border-glass': 'var(--border-glass)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        accent: 'var(--accent)',
        'accent-glow': 'var(--accent-glow)',
      },
      backdropBlur: {
        glass: 'var(--blur-md)',
      },
      borderRadius: {
        glass: 'var(--radius-xl)',
      },
      boxShadow: {
        glass: 'var(--glass-shadow)',
      },
    },
  },
};
```

## No Database Changes

This feature is purely frontend visual enhancement. No new tables, columns, or database migrations are required.
