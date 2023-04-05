<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Agent, Conversation } from '$lib/types';
	import type { ConversationPostRequest } from '../../routes/api/conversations/+server';

	let agents: Agent[] = [
		{
			id: 1,
			name: 'Default Agent',
			systemMessage: 'You are a helpful AI assistant',
			model: 'gpt-3.5-turbo',
			promptTemplate: ''
		},
		{
			id: 2,
			name: 'ChatGPT',
			systemMessage:
				'You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible.',
			model: 'gpt-3.5-turbo',
			promptTemplate: ''
		},
		{
			id: 3,
			name: 'Expert Typescript programmer',
			systemMessage:
				'You are an expert Typescript programmer. Answer as concisely as possible. The user will ask you questions about Typescript. Always include the programming language in your code snippets so is easier to format. Explain your logic behind your code snippets.',
			model: 'gpt-3.5-turbo',
			promptTemplate: ''
		},
		{
			id: 4,
			name: 'English-Spanish translator',
			systemMessage:
				'You are an English-Spanish translator. The user will write in English and you will translate to Spanish. ',
			model: 'gpt-3.5-turbo',
			promptTemplate: 'Translate to Spanish the following message: [[message]]'
		},
		{
			id: 5,
			name: 'English Grammar Checker',
			systemMessage:
				'You are an English expert, the user will ask you to fix the English grammar of text. Show the corrected text and explain why the correction is needed.',
			model: 'gpt-3.5-turbo',
			promptTemplate: 'Fix the grammar of this: [[message]]'
		}
	];
	async function addNewAgent(agent: Agent) {
		try {
			let request = {
				name: agent.name,
				systemMessage: agent.systemMessage,
				model: agent.model,
				promptTemplate: agent.promptTemplate
			} satisfies ConversationPostRequest;

			const response = await fetch('/api/conversations', {
				method: 'POST',
				body: JSON.stringify(request)
			});
			const newConversation = (await response.json()) satisfies Conversation;
			routeToPage(`?selectedConversationId=${newConversation.id}`);
		} catch (error) {
			console.log(error);
		}
	}

	function routeToPage(route: string) {
		goto(`/${route}`, { replaceState: true });
	}
</script>

<div class="p-8">
	<div class="flex flex-row grid-flow-row	flex-wrap">
		{#each agents as agent}
			<div class="card w-80 m-3 flex flex-col">
				<header class="card-header text-2xl">{agent.name}</header>
				<section class="p-4 grow">{agent.systemMessage}</section>
				<footer class="card-footer flex justify-end">
					<button
						class="btn btn-sm variant-filled-primary text-l"
						on:click={() => {
							addNewAgent(agent);
						}}
					>
						<span>Start new agent</span>
					</button>
				</footer>
			</div>
		{/each}
	</div>
</div>
