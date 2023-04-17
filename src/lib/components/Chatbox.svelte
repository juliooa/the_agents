<script lang="ts">
	import MessageBlock from './MessageBlock.svelte';
	import { MessageRole, type Conversation, type Message } from '../types';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import 'iconify-icon';
	import { onMount } from 'svelte';
	import type {
		MessagePostRequest,
		MessagePostResponse
	} from '../../routes/api/messages/[conversation_id]/+server';
	import type { ConversationPutRequest } from '../../routes/api/conversations/+server';
	import { generateRandomId } from '$lib/utils';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';

	export let conversation: Conversation;
	let inputTextMessage: string = '';
	let systemMessage = conversation.systemMessage;
	let promptTemplate = conversation.promptTemplate;
	let messages: Message[] = [];
	let inputAgentName: string = conversation.name;
	let promptTemplateParameters: string[] = [];
	let promptTemplateMessageNotPresentAlert: boolean = false;

	onMount(async () => {
		try {
			const response = await fetch(`/api/messages/${conversation.id}`, {
				method: 'GET'
			});
			messages = (await response.json()) satisfies Message[];
			triggerScrollDown(0, false);
		} catch (error) {
			console.log(error);
		}
		searchPromptParameters();
	});

	async function sendMessage() {
		let messageToSend = buildMessageToSend(inputTextMessage, promptTemplate);

		inputTextMessage = '';
		let newMessage: Message = {
			id: generateRandomId(),
			role: MessageRole.USER,
			text: messageToSend,
			type: 'text',
			user_id: conversation.user_id,
			conversationId: conversation.id
		};

		messages.push(newMessage);
		messages = messages;

		let index = addTypingMessageToConversation();
		triggerScrollDown();
		getCompletion(newMessage, index);
	}

	function buildMessageToSend(message: string, promptTemplate: string): string {
		if (promptTemplate.length == 0) return message;

		for (let i = 0; i < promptTemplateParameters.length; i++) {
			let parameter = promptTemplateParameters[i];
			let value = getPromptParameterInputValue(parameter);
			promptTemplate = promptTemplate.replace(`[[${parameter}]]`, value);
		}

		return promptTemplate.replace('[[message]]', message);
	}

	function getPromptParameterInputValue(id: string): string {
		const promptParameterInputs = document.getElementById('promptParameterInputs');
		if (!promptParameterInputs) {
			throw new Error(`Element with ID "promptParameterInputs" not found`);
		}

		const inputElement = promptParameterInputs.querySelector(`#${id}`) as HTMLInputElement;
		if (inputElement) {
			return inputElement.value;
		} else {
			throw new Error(`Input element with ID "${id}" not found within #promptParameterInputs`);
		}
	}

	async function getCompletion(newMessage: Message, index: number) {
		try {
			let request = {
				message: newMessage,
				systemMessage: conversation.systemMessage,
				model: conversation.model
			} satisfies MessagePostRequest;

			const response = await fetch(`/api/messages/${conversation.id}`, {
				method: 'POST',
				body: JSON.stringify(request)
			});
			if (response.status == 400) {
				deleteLastTwoMessages();
				const alert: ModalSettings = {
					type: 'alert',
					title: 'Messages limit reached',
					body: 'Oh no! You have reached your limit of messages in your free plan. Please, upgrade. (Soon you will be able to upgrade)',
					modalClasses: '!bg-primary-800'
				};
				modalStore.trigger(alert);
			} else {
				const messagePostResponse = (await response.json()) satisfies MessagePostResponse;
				messages[index - 1] = messagePostResponse;
				messages = messages;
				triggerScrollDown();
			}
		} catch (error) {
			console.log(error);
		}
	}

	function addTypingMessageToConversation(): number {
		let answerMessage: Message = {
			id: generateRandomId(),
			role: MessageRole.ASSISTANT,
			text: 'typing...',
			type: 'typing',
			conversationId: conversation.id,
			user_id: conversation.user_id
		};
		let index = messages.push(answerMessage);
		messages = messages;
		return index;
	}

	function triggerScrollDown(timeout = 200, smooth = true) {
		setTimeout(() => {
			const messagesContainer = document.getElementById('messagesContainer');
			const height = messagesContainer?.scrollHeight;
			messagesContainer?.scrollTo({
				top: height,
				behavior: smooth ? 'smooth' : 'auto'
			});
		}, timeout);
	}

	let systemMessageHelpPopupSettings: PopupSettings = {
		event: 'hover',
		target: 'systemMessageHelp'
	};

	let promptTemplatePopupSettings: PopupSettings = {
		event: 'hover',
		target: 'promptTemplateHelp'
	};

	let timer: ReturnType<typeof setTimeout>;
	function startSearchPromptParameters() {
		clearTimeout(timer);
		timer = setTimeout(() => {
			searchPromptParameters();
		}, 1000);
	}

	function searchPromptParameters() {
		if (promptTemplate.length == 0) {
			promptTemplateMessageNotPresentAlert = false;
			promptTemplateParameters = [];
			return;
		}
		let promptParameters = promptTemplate.match(/\[\[([^[\]]+?)\]\]/g);
		let newParameters: string[] = [];
		if (promptParameters) {
			promptParameters
				.filter((parameter) => parameter !== '[[message]]')
				.map((parameter) => {
					const parameterName = parameter.substring(2, parameter.length - 2);
					newParameters.push(parameterName);
				});
		}
		promptTemplateParameters = newParameters;
		if (!promptTemplate.includes('[[message]]')) {
			promptTemplateMessageNotPresentAlert = true;
		} else {
			promptTemplateMessageNotPresentAlert = false;
		}
	}

	async function saveConversationParams() {
		try {
			let request = {
				conversation: {
					id: conversation.id,
					name: inputAgentName,
					systemMessage: systemMessage,
					model: conversation.model,
					promptTemplate: promptTemplate,
					user_id: conversation.user_id
				}
			} satisfies ConversationPutRequest;

			const response = await fetch(`/api/conversations`, {
				method: 'PUT',
				body: JSON.stringify(request)
			});
			const updatedConversation = (await response.json()) satisfies Conversation;
			conversation = updatedConversation;
		} catch (error) {
			console.log("Couldn't create new conversation");
			console.log(error);
		}
	}

	function deleteLastTwoMessages() {
		messages.splice(-2);
		messages = messages;
	}
</script>

<div class="flex flex-row rounded-b-2xl">
	<div class="flex flex-col">
		<div class="pt-3 pl-2 pr-2">
			<span class="ml-3">Agent name</span>

			<input type="text" bind:value={inputAgentName} class="input block w-full py-3" />
		</div>
		<div class="pt-3 pl-2 pr-2">
			<span class="ml-3">System message</span>
			<iconify-icon icon="ic:baseline-help-outline" use:popup={systemMessageHelpPopupSettings} />
			<textarea
				bind:value={systemMessage}
				class="textarea"
				rows="5"
				placeholder="You are a funny and helpful assistant. Answer as concisely as possible..."
				name="systemMessage"
			/>
		</div>
		<div class="pt-3 pl-2 pr-2">
			<span class="ml-3">Prompt template</span>
			<iconify-icon icon="ic:baseline-help-outline" use:popup={promptTemplatePopupSettings} />
			<textarea
				bind:value={promptTemplate}
				class="textarea"
				rows="3"
				name="promptTemplate"
				on:keyup={() => {
					startSearchPromptParameters();
				}}
				placeholder="Translate to [[language]] the following: [[message]]"
			/>
		</div>
		{#if promptTemplateMessageNotPresentAlert}
			<div class="alert bg-red-700 text-white rounded text-sm mb-2">
				You are using a prompt template but didn't<br />include the [[message]] parameter to add the
				actual message.
			</div>
		{/if}
		{#if promptTemplateParameters.length > 0}
			<div id="promptParameterInputs" class="pt-1 pl-4 pr-6 pb-2">
				{#each promptTemplateParameters as parameter}
					<div class="input-group input-group-divider grid grid-flow-col auto-cols-max mb-1">
						<div class="input-group-shim text-sm">{parameter}</div>
						<input type="text" id={parameter} />
					</div>
				{/each}
			</div>
		{/if}
		<button on:click={saveConversationParams} class="btn variant-filled-secondary mx-3">Save</button
		>
	</div>
	<div class="grow flex flex-col h-[72vh] antialiased pr-4 pl-2 pt-3 bg-surface-800">
		<div
			class="flex flex-col flex-auto overflow-x-auto flex-shrink-0 rounded-t-2xl h-full p-4 bg-surface-600"
			id="messagesContainer"
		>
			{#each messages as message (message.id)}
				<MessageBlock {message} />
			{/each}
		</div>
		<form
			class="flex flex-row items-center h-18 rounded-b-xl px-6 py-3 w-full bg-surface-500"
			action="?/sendMessage"
			on:submit|preventDefault={sendMessage}
		>
			<div class="flex-grow ml-4">
				<div class="relative w-full">
					<textarea
						bind:value={inputTextMessage}
						placeholder="write your message"
						class="textarea"
						name="message"
						rows="2"
						on:keydown={(event) => {
							if (event.key == 'Enter' && !event.shiftKey) {
								event.preventDefault();
								sendMessage();
							}
						}}
					/>
				</div>
			</div>
			<div class="ml-4">
				<button type="submit" class="btn variant-filled-primary">
					<span>Send</span>
					<iconify-icon icon="ion:paper-plane-outline" />
				</button>
			</div>
		</form>
	</div>
</div>

<div
	class="text-s text-center card variant-filled p-2 whitespace-nowrap shadow-xl"
	data-popup="systemMessageHelp"
>
	The system message helps set the behavior of the assistant.
	<div class="arrow variant-filled" />
</div>
<div
	class="text-s text-center card variant-filled p-2 whitespace-nowrap shadow-xl"
	data-popup="promptTemplateHelp"
>
	You can modify the message that you send with a prompt template.<br />Use [[message]] to insert
	the message into the template.<br />Use [[name_of_parameter]] to create an input to fill in the
	parameter.
	<div class="arrow variant-filled" />
</div>
