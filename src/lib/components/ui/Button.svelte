<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Variant = 'default' | 'secondary' | 'ghost' | 'destructive' | 'subscribe' | 'outline';
	type Size = 'default' | 'sm' | 'lg' | 'icon';

	interface Props {
		variant?: Variant;
		size?: Size;
		class?: string;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		children?: Snippet;
		onclick?: (e: MouseEvent) => void;
		loading?: boolean;
	}

	let {
		variant = 'default',
		size = 'default',
		class: className = '',
		disabled = false,
		type = 'button',
		children,
		loading = false,
		...restProps
	}: Props = $props();

	const variantClasses = {
		default: 'bg-primary text-primary-foreground hover:bg-primary/90',
		secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
		ghost: 'hover:bg-accent hover:text-accent-foreground',
		destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
		subscribe:
			'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700',
		outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
	};

	const sizeClasses = {
		default: 'h-10 px-4 py-2',
		sm: 'h-9 rounded-md px-3',
		lg: 'h-11 rounded-md px-8',
		icon: 'h-10 w-10'
	};
</script>

<button
	type={type}
	class={cn(
		'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
		variantClasses[variant],
		sizeClasses[size],
		className
	)}
	disabled={disabled || loading}
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</button>

