# i18n Integration Guide

This guide explains how to integrate the multi-language system into your SvelteKit 5 project.

## Overview

The i18n system supports:
- **English (en)** - Left-to-Right (LTR)
- **Arabic (ar)** - Right-to-Left (RTL)

## Files Structure

```
src/lib/
├── i18n/
│   ├── translations/
│   │   ├── en.json          # English translations
│   │   └── ar.json          # Arabic translations
│   ├── index.ts             # Translation helper function
│   ├── USAGE_EXAMPLES.md    # Code examples
│   └── INTEGRATION_GUIDE.md # This file
├── stores/
│   └── langStore.ts         # Language store with persistence
└── components/
    └── LanguageSwitcher.svelte  # Language switcher component
```

## How It Works

1. **Language Store** (`langStore.ts`):
   - Manages current language state
   - Persists selection in localStorage
   - Automatically updates `document.documentElement.dir` and `lang`
   - Adds/removes `rtl` class on `<html>` element

2. **Translation Function** (`t()`):
   - Reads current language from store
   - Returns translated string for given key
   - Supports parameter interpolation (e.g., `{name}`, `{count}`)
   - Falls back to English if translation missing

3. **RTL Support**:
   - Automatically sets `dir="rtl"` on HTML element for Arabic
   - CSS classes in `app.css` handle RTL layout adjustments
   - Tailwind RTL utilities work automatically

## Usage in Components

### Basic Usage

```svelte
<script lang="ts">
	import { t } from '$lib/i18n';
</script>

<h1>{t('navbar.brand')}</h1>
```

### With Parameters

```svelte
<script lang="ts">
	import { t } from '$lib/i18n';
	
	let userName = 'John';
	let remaining = 5;
</script>

<p>{t('dashboard.welcomeBack', { name: userName })}</p>
<p>{t('upload.subtitleAuthenticated', { remaining })}</p>
```

### Reactive Updates

The `t()` function automatically updates when language changes. No special reactive syntax needed - just use it directly:

```svelte
<script lang="ts">
	import { t } from '$lib/i18n';
	// Language changes are automatically reflected
</script>

<h1>{t('pricing.title')}</h1>
```

## Adding Language Switcher

The `LanguageSwitcher` component is already integrated in the Navbar. To add it elsewhere:

```svelte
<script lang="ts">
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
</script>

<LanguageSwitcher />
```

## Adding New Translations

1. **Add to English** (`en.json`):
```json
{
  "mySection": {
    "title": "My Title",
    "description": "My description with {param}"
  }
}
```

2. **Add to Arabic** (`ar.json`):
```json
{
  "mySection": {
    "title": "عنواني",
    "description": "وصفي مع {param}"
  }
}
```

3. **Use in component**:
```svelte
<script lang="ts">
	import { t } from '$lib/i18n';
</script>

<h1>{t('mySection.title')}</h1>
<p>{t('mySection.description', { param: 'value' })}</p>
```

## RTL Considerations

When writing components for RTL support:

1. **Use Tailwind RTL utilities**:
   - `rtl:text-right` - Right align in RTL
   - `rtl:left-0` - Position left in RTL
   - `rtl:flex-row-reverse` - Reverse flex direction

2. **Avoid hardcoded directions**:
   - ❌ `margin-left: 10px`
   - ✅ `ml-2.5` or `rtl:mr-2.5 rtl:ml-0`

3. **Test both directions**:
   - Switch language and verify layout looks correct

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
- User preference is saved in `localStorage` as `nano_language`
- On first visit, defaults to English
- On subsequent visits, loads saved preference

## Translation Keys Structure

All keys follow dot notation:
- `navbar.brand` - Navbar brand name
- `auth.title` - Auth page title
- `pricing.features.freeUploads` - Nested feature key

See `translations/en.json` for complete list of available keys.

## Troubleshooting

### Translations not updating
- Ensure `langStore.init()` is called in `+layout.svelte`
- Check that `t()` function is imported from `$lib/i18n`

### RTL layout broken
- Verify `app.css` includes RTL styles
- Check that `langStore.set()` updates `document.documentElement.dir`
- Use browser dev tools to inspect `dir` attribute on `<html>`

### Missing translations
- Function falls back to English automatically
- Add missing keys to both `en.json` and `ar.json`
- Check console for any errors

## Best Practices

1. **Always provide both languages** - Don't leave Arabic translations empty
2. **Use parameters** - For dynamic content (names, numbers, etc.)
3. **Keep keys organized** - Group by page/section (navbar, auth, pricing, etc.)
4. **Test both languages** - Switch and verify all text updates
5. **Test RTL layout** - Ensure UI looks correct in Arabic mode

