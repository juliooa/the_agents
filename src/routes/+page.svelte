<script lang="ts">
	import Chatbox from '$lib/components/Chatbox.svelte';
	import 'iconify-icon';
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
	import type { Conversation } from '$lib/types';
	import { goto } from '$app/navigation';
	import type { DashboardTabsPageData } from './+page.server';
	import type { ConversationArchivePostRequest } from './api/conversations/archive/+server';
	import AgentSelectionDashboard from '$lib/components/AgentSelectionDashboard.svelte';
	import type { PageData } from './$types';

	export let data: DashboardTabsPageData;
	export let pageData: PageData;

	$: conversations = data.conversations;
	$: tabSet = data.selectedTab;
	$: selectedConversation = conversations[data.selectedTab];

	function routeToPage(route: string) {
		goto(`/${route}`, { replaceState: true });
	}

	async function closeConversation(index: number) {
		try {
			let conversation = conversations[index];
			let request = {
				conversationId: conversation.id
			} satisfies ConversationArchivePostRequest;

			const response = await fetch('/api/conversations/archive', {
				method: 'PUT',
				body: JSON.stringify(request)
			});
			let archivedConversation = (await response.json()) satisfies Conversation;
			if (archivedConversation.archived) {
				let moveToConversation = conversations[index - 1];
				let routeToMove = moveToConversation
					? `?selectedConversationId=${moveToConversation.id}`
					: '?showNewAgentTab=true';
				routeToPage(routeToMove);
			}
		} catch (error) {
			console.log(error);
		}
	}
</script>

{#if !data.apiKeyPresent}
	<div class="alert px-8 py-6 bg-red-400 text-white flex justify-between rounded">
		<div class="flex items-center">
			<p>
				Missing Api Key. There is no OpenAI API KEY set in environment variables. Please set it in
				.env as: SECRET_OPENAI_API_KEY='sk-XXXXXXXX'
			</p>
		</div>
	</div>
{/if}
<div class="m-3 rounded-xl bg-surface-700">
	<TabGroup
		class="!space-y-0"
		active="variant-filled-primary"
		hover="hover:variant-soft-primary"
		flex="flex-1 lg:flex-none"
		rounded="rounded-tl-xl rounded-tr-xl"
		border="border-b border-surface-400-500-token"
	>
		{#each Array(conversations.length + 1) as _, i}
			{#if i === conversations.length}
				<Tab
					bind:group={tabSet}
					name="newAgentTab"
					bind:value={conversations.length}
					on:click={() => {
						routeToPage(`?showNewAgentTab=true`);
					}}>New agent</Tab
				>
			{:else}
				<Tab
					bind:group={tabSet}
					name={conversations[i].name}
					value={i}
					on:click={() => {
						routeToPage(`?selectedConversationId=${conversations[i].id}`);
					}}
				>
					<div class="flex">
						<div>
							{#if i == tabSet}
								{selectedConversation.name}
							{:else}
								{conversations[i].name}
							{/if}
						</div>
						<div class="pl-2">
							{#if tabSet == i}
								<span
									class="badge-icon variant-filled hover:variant-filled-warning"
									on:click|preventDefault={() => {
										closeConversation(i);
									}}
									on:keypress={() => {
										closeConversation(i);
									}}><iconify-icon icon="ic:baseline-close" /></span
								>
							{/if}
						</div>
					</div>
				</Tab>
			{/if}
		{/each}
	</TabGroup>
	{#if data.newAgentTabSelected}
		<AgentSelectionDashboard />
	{:else}
		{#key selectedConversation.id}
			<Chatbox bind:conversation={selectedConversation} />
		{/key}
	{/if}
</div>
