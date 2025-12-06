# Complete Bilingual System (Arabic ↔ English)

## Overview

This is a complete, production-ready bilingual system for your SvelteKit 5 project. It supports:

- **English (en)** - Left-to-Right (LTR)
- **Arabic (ar)** - Right-to-Left (RTL)

## Features

✅ **Single Toggle Button** - One button switches between languages instantly  
✅ **Full Website Coverage** - All pages, components, and UI elements translated  
✅ **RTL Support** - Automatic direction switching for Arabic  
✅ **LocalStorage Persistence** - Language preference saved and auto-loaded  
✅ **No Refresh Required** - Instant language switching without page reload  
✅ **Reactive Updates** - All translations update automatically when language changes

## File Structure

```
src/lib/
├── i18n/
│   ├── en.json          # English translations
│   ├── ar.json          # Arabic translations
│   ├── t.ts             # Translation helper function
│   └── README.md        # This file
├── stores/
│   └── langStore.ts     # Language store with toggle functionality
└── components/
    └── LanguageToggle.svelte  # Language toggle button
```

## Usage

### Basic Translation

```svelte
<script lang="ts">
	import { t } from '$lib/i18n';
</script>

<h1>{t('navbar.brand')}</h1>
<p>{t('home.title')}</p>
```

### With Parameters

```svelte
<script lang="ts">
	import { t } from '$lib/i18n';
</script>

<p>{t('dashboard.welcomeBack', { name: 'John' })}</p>
<p>{t('upload.subtitleAuthenticated', { remaining: 5 })}</p>
```

### Language Toggle

The `LanguageToggle` component is already integrated in the Navbar. It shows:
- "AR" when current language is English
- "EN" when current language is Arabic

Clicking it toggles between languages instantly.

## How It Works

1. **Language Store** (`langStore.ts`):
   - Manages current language state
   - Persists to localStorage
   - Updates `document.documentElement.dir` and `lang`
   - Adds/removes `rtl` class on `<html>`

2. **Translation Function** (`t()`):
   - Reads current language from store
   - Returns translated string
   - Supports parameter interpolation
   - Falls back to English if translation missing

3. **RTL Support**:
   - Automatically sets `dir="rtl"` for Arabic
   - CSS in `app.css` handles RTL layout
   - Tailwind RTL utilities work automatically

## Translation Keys

All translation keys are organized by section:

- `navbar.*` - Navigation items
- `footer.*` - Footer content
- `home.*` - Landing page
- `auth.*` - Authentication pages
- `pricing.*` - Pricing page
- `dashboard.*` - Dashboard
- `upload.*` - Upload page
- `checkout.*` - Checkout page
- `docs.*` - Documentation
- `ocrResult.*` - OCR result panel
- `uploadArea.*` - Upload area component
- `history.*` - History table
- `apiKeys.*` - API key manager
- `common.*` - Common UI labels

## RTL Styling

The system automatically handles RTL:

- `html.rtl` class is added/removed based on language
- CSS in `app.css` provides RTL support
- Use Tailwind RTL utilities: `rtl:text-right`, `rtl:ml-auto`, etc.

## Initialization

The language store is initialized in `+layout.svelte`:

```svelte
import { langStore } from '$lib/stores';

onMount(() => {
	langStore.init(); // Sets direction and lang attributes
});
```

## Default Language

- Default: **English (en)**
- Saved preference: `localStorage.getItem('nano_language')`
- Auto-loads on page load

## All Translated Pages

✅ Landing page (`+page.svelte`)  
✅ Auth page (`auth/+page.svelte`)  
✅ Pricing page (`pricing/+page.svelte`)  
✅ Dashboard (`dashboard/+page.svelte`)  
✅ Upload page (`upload/+page.svelte`)  
✅ Checkout page (`checkout/+page.svelte`)  
✅ Docs page (`docs/+page.svelte`)  
✅ Navbar component  
✅ Footer component  
✅ All shared components

## Production Ready

All code is:
- ✅ Fully implemented
- ✅ Production-ready
- ✅ Type-safe
- ✅ No external dependencies
- ✅ Follows Svelte 5 best practices

