<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore, usageStore } from '$lib/stores';
	import { apiClient } from '$lib/api';
	import { t } from '$lib/i18n';
	import MetricCard from '$lib/components/dashboard/MetricCard.svelte';
	import HistoryTable from '$lib/components/dashboard/HistoryTable.svelte';
	import ApiKeyManager from '$lib/components/dashboard/ApiKeyManager.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let loading = $state(true);
	let history = $state<any[]>([]);
	let overview = $state<any>(null);

	onMount(async () => {
		// Route guard
		let unsubscribe: any;
		authStore.subscribe((state) => {
			if (!state.isAuthenticated) {
				if (unsubscribe) unsubscribe();
				goto('/auth');
			}
		});

		await loadData();
	});

	async function loadData() {
		loading = true;
		try {
			const [overviewData, historyData] = await Promise.all([
				apiClient.getDashboardOverview(),
				apiClient.getDashboardHistory()
			]);

			overview = overviewData;
			history = historyData.data || historyData || [];

			usageStore.setUsage({
				uploads_this_month: overviewData.uploads_this_month || 0,
				remaining_uploads: overviewData.remaining_uploads || 0,
				monthly_limit: overviewData.monthly_limit || 5,
				average_confidence: overviewData.average_confidence || null,
				last_upload_at: overviewData.last_upload_at || null
			});
		} catch (err) {
			console.error('Failed to load dashboard data:', err);
		} finally {
			loading = false;
		}
	}

	let authState = $state<{ user: any }>({ user: null });
	authStore.subscribe((state) => {
		authState = state;
	});
	let user = $derived(authState.user);

	let usageState = $state<{
		uploads_this_month: number;
		remaining_uploads: number | typeof Infinity;
		monthly_limit: number | typeof Infinity;
		average_confidence: number | null;
		last_upload_at: string | null;
	}>({
		uploads_this_month: 0,
		remaining_uploads: 0,
		monthly_limit: 5,
		average_confidence: null,
		last_upload_at: null
	});

	usageStore.subscribe((state) => {
		usageState = state;
	});
</script>

<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<div class="mb-8">
		<h1 class="text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
		<p class="text-muted-foreground">{t('dashboard.welcomeBack', { name: user?.name || '' })}</p>
	</div>

	{#if loading}
		<div class="text-center py-12">
			<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			<p class="mt-2 text-muted-foreground">{t('dashboard.loading')}</p>
		</div>
	{:else if overview}
		<!-- Metrics Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<MetricCard
				title={t('dashboard.uploadsThisMonth')}
				value={overview?.uploads_this_month || usageState.uploads_this_month || 0}
				subtitle={usageState.monthly_limit === Infinity ? t('dashboard.unlimited') : t('dashboard.ofAllowed', { limit: overview?.monthly_limit || usageState.monthly_limit || 5 })}
			>
				{#snippet icon()}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
						/>
					</svg>
				{/snippet}
			</MetricCard>
			<MetricCard
				title={t('dashboard.remainingUploads')}
				value={usageState.remaining_uploads === Infinity ? '∞' : (overview?.remaining_uploads || usageState.remaining_uploads || 0)}
				subtitle={usageState.remaining_uploads === Infinity ? t('dashboard.unlimited') : t('dashboard.availableThisMonth')}
			>
				{#snippet icon()}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				{/snippet}
			</MetricCard>
			<MetricCard
				title={t('dashboard.averageConfidence')}
				value={overview.average_confidence ? `${Math.round(overview.average_confidence * 100)}%` : 'N/A'}
				subtitle={t('dashboard.acrossAllUploads')}
			>
				{#snippet icon()}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
						/>
					</svg>
				{/snippet}
			</MetricCard>
			<MetricCard
				title={t('dashboard.currentPlan')}
				value={user?.plan || user?.plan_type || 'FREE'}
				subtitle={user?.isSubscribed ? t('dashboard.activeSubscription') : user?.plan_type === 'FREE' ? t('dashboard.upgradeForMore') : t('dashboard.activeSubscription')}
			>
				{#snippet icon()}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
						/>
					</svg>
				{/snippet}
			</MetricCard>
		</div>

		<!-- Quick Actions -->
		<div class="mb-8">
			<Card class="p-6">
				<h2 class="text-xl font-semibold mb-4">{t('dashboard.quickActions')}</h2>
				<div class="flex flex-wrap gap-4">
					<Button variant="default" onclick={() => goto('/upload')}>{t('dashboard.uploadImage')}</Button>
					{#if user?.isSubscribed || user?.plan_type !== 'FREE'}
						<Button variant="outline" onclick={() => goto('/docs')}>{t('dashboard.viewApiDocs')}</Button>
					{/if}
					{#if !user?.isSubscribed && user?.plan_type === 'FREE'}
						<Button variant="subscribe" onclick={() => goto('/pricing')}>{t('dashboard.upgradePlan')}</Button>
					{/if}
				</div>
			</Card>
		</div>

		<!-- History -->
		<HistoryTable jobs={history} />

		<!-- API Access (Pro only) -->
		{#if user?.isSubscribed || user?.plan_type !== 'FREE'}
			<div class="mt-8">
				<ApiKeyManager />
			</div>
		{/if}
	{/if}
</div>

