<script lang="ts">
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';

	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	import 'iconify-icon';
	import { AppBar, AppShell, Modal } from '@skeletonlabs/skeleton';
	import 'highlight.js/styles/github-dark.css';

	import hljs from 'highlight.js';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	storeHighlightJs.set(hljs);

	let githubLogo = 'github-mark-white.png';
	let theAgentsImg = 'agents_small.png';

	export let data: LayoutData;
	let loading = false;

	$: ({ supabase, session } = data);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});

	const handleLogout: SubmitFunction = () => {
		loading = true;
		return async ({ result }) => {
			if (result.type === 'redirect') {
				await invalidate('supabase:auth');
				goto(result.location);
			} else {
				await applyAction(result);
			}
			loading = false;
		};
	};
</script>

<Modal />
<AppShell>
	<svelte:fragment slot="pageHeader">
		<AppBar>
			<svelte:fragment slot="lead"
				><img class="rounded-full mr-2" width="60" src={theAgentsImg} alt="github logo" />
				<h2>The Agents</h2></svelte:fragment
			>
			<svelte:fragment slot="trail">
				{#if data.session}
					<form action="/logout" method="post" use:enhance={handleLogout}>
						<button class="btn variant-filled-surface" disabled={loading} type="submit">
							<iconify-icon icon="icons8:shutdown" />
						</button>
					</form>
				{/if}</svelte:fragment
			>
		</AppBar>
	</svelte:fragment>
	<slot />
	<svelte:fragment slot="pageFooter"
		><div class="flex flex-row ml-4 mb-4">
			<a class="" href="https://github.com/juliooa/the_agents">
				<img width="32" src={githubLogo} alt="github logo" />
			</a>
		</div></svelte:fragment
	>
</AppShell>
