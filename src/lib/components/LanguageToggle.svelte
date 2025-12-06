<script lang="ts">
	import { langStore } from '$lib/stores/langStore';
	import { cn } from '$lib/utils';

	let currentLang = $state<'en' | 'ar'>('en');

	langStore.subscribe((lang) => {
		currentLang = lang;
	});

	function toggleLanguage() {
		langStore.toggleLanguage();
	}
</script>

<button
	type="button"
	onclick={toggleLanguage}
	class={cn(
		'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
		'h-9 px-3 py-2',
		'bg-background border border-border hover:bg-accent hover:text-accent-foreground',
		'shadow-sm hover:shadow-md'
	)}
	aria-label="Toggle language"
>
	<span class="font-semibold text-xs">
		{currentLang === 'ar' ? 'EN' : 'AR'}
	</span>
</button>

