<script lang="ts">
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';

	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import 'highlight.js/styles/github-dark.css';
	import { setInitialClassState } from '@skeletonlabs/skeleton';
	import hljs from 'highlight.js';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	storeHighlightJs.set(hljs);
</script>

<svelte:head>{@html `<script>(${setInitialClassState.toString()})();</script>`}</svelte:head>

<AppShell>
	<svelte:fragment slot="pageHeader">
		<AppBar>
			<svelte:fragment slot="lead"><h2>The Agents</h2></svelte:fragment>
			<svelte:fragment slot="trail">github repo</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
