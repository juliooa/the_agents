<script lang="ts">
	import { MessageRole, type Message } from '../types';
	export let message: Message;

	import { CodeBlock } from '@skeletonlabs/skeleton';

	interface TextBlock {
		isCodeBlock: boolean;
		text: string;
		language?: string;
	}

	function parseText(text: string): TextBlock[] {
		const regex = /```([\w-]+)?\s*([\s\S]+?)\s*```/g;
		const blocks: TextBlock[] = [];
		let lastIndex = 0;
		let match;

		while ((match = regex.exec(text))) {
			const [fullMatch, language, code] = match;
			const preMatch = text.slice(lastIndex, match.index);
			if (preMatch) {
				blocks.push({ isCodeBlock: false, text: preMatch });
			}
			blocks.push({ isCodeBlock: true, text: code, language });
			lastIndex = match.index + fullMatch.length;
		}

		const lastBlock = text.slice(lastIndex);
		if (lastBlock) {
			blocks.push({ isCodeBlock: false, text: lastBlock });
		}

		return blocks;
	}

	let parsedTextBlocks = parseText(message.text);
</script>

<div class="container {message.role == MessageRole.USER ? 'own-container' : ''} pt-2 pb-2">
	<section
		class={message.role == MessageRole.USER
			? 'bg-secondary-800 text-white py-2 px-4 shadow rounded-xl'
			: 'bg-tertiary-200 text-black py-2 px-4 shadow rounded-xl'}
	>
		<div class="rounded-xl text-lg">
			{#each parsedTextBlocks as textBlock}
				{#if textBlock.isCodeBlock}
					<CodeBlock language={textBlock.language} code={textBlock.text} />
				{:else}
					<p style="white-space: pre-line;">{textBlock.text}</p>
				{/if}
			{/each}
		</div>
	</section>
</div>

<style>
	.container {
		display: flex;
	}
	.container.own-container {
		flex-direction: row-reverse;
	}
</style>
