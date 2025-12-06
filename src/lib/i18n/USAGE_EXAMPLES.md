# i18n Usage Examples

This document shows how to use translations in your SvelteKit components.

## Basic Usage

```svelte
<script lang="ts">
	import { t } from '$lib/i18n';
</script>

<h1>{t('pricing.title')}</h1>
<p>{t('pricing.subtitle')}</p>
```

## With Parameters

```svelte
<script lang="ts">
	import { t } from '$lib/i18n';
</script>

<p>{t('pricing.saveAnnually', { percentage: 20 })}</p>
<p>{t('upload.subtitleAuthenticated', { remaining: 5 })}</p>
```

## Reactive Updates

The `t()` function automatically updates when the language changes because it reads from the reactive `langStore`. No need for special reactive syntax - just use `t()` directly in your template.

## Example: Pricing Page

```svelte
<script lang="ts">
	import { t } from '$lib/i18n';
	
	const plans = [
		{
			name: t('pricing.freeTrial'),
			description: t('pricing.freeTrialDesc'),
			features: [
				t('pricing.features.freeUploads', { count: 5 }),
				t('pricing.features.basicOcr'),
				t('pricing.features.limitedHistory', { count: 5 }),
				t('pricing.features.emailSupport')
			]
		}
	];
</script>

<h1>{t('pricing.title')}</h1>
<p>{t('pricing.subtitle')}</p>
```

## Example: Auth Page

```svelte
<script lang="ts">
	import { t } from '$lib/i18n';
	
	let isSignUp = $state(false);
</script>

<h1>{isSignUp ? t('auth.titleSignUp') : t('auth.title')}</h1>
<p>{isSignUp ? t('auth.subtitleSignUp') : t('auth.subtitle')}</p>

<label>{t('auth.email')}</label>
<button>{t('auth.signIn')}</button>
```

## Example: Dashboard Page

```svelte
<script lang="ts">
	import { t } from '$lib/i18n';
	
	let userName = 'John';
</script>

<h1>{t('dashboard.title')}</h1>
<p>{t('dashboard.welcomeBack', { name: userName })}</p>

<MetricCard title={t('dashboard.uploadsThisMonth')} />
```

## Available Translation Keys

See `src/lib/i18n/translations/en.json` for all available keys.

