<script lang="ts">
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';

	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	import 'iconify-icon';
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import 'highlight.js/styles/github-dark.css';

	import hljs from 'highlight.js';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	storeHighlightJs.set(hljs);

	let githubLogo = 'github-mark-white.png';
	let theAgentsImg = 'agents_small.png';

	export let data: LayoutData;

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
</script>

<AppShell>
	<svelte:fragment slot="pageHeader">
		<AppBar>
			<svelte:fragment slot="lead"
				><img class="rounded-full mr-2" width="60" src={theAgentsImg} alt="github logo" />
				<h2>The Agents</h2></svelte:fragment
			>
			<svelte:fragment slot="trail"
				><a href="https://github.com/juliooa/the_agents">
					<img width="32" src={githubLogo} alt="github logo" />
				</a></svelte:fragment
			>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
