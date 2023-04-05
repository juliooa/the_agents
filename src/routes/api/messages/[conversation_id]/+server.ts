import type { MessagesRepository } from '$lib/server/database/messages_repository';
import { PrismaDb } from '$lib/server/database/prisma_db';
import { createChatCompletion, type ChatCompletionProps } from '$lib/server/openai_client';
import { MessageRole, type Message } from '$lib/types';
import { json, type RequestHandler } from '@sveltejs/kit';

let messagesRepository: MessagesRepository = new PrismaDb();

export const POST = (async ({ request }) => {
	const messagePostRequest: MessagePostRequest = await request.json();

	let userMessage = await messagesRepository.newMessage(messagePostRequest.message);
	let conversationId = userMessage.conversationId;
	let messages = await messagesRepository.getLastMessagesFromConversation(conversationId, 10);

	let completionProps = {
		systemMessage: messagePostRequest.systemMessage,
		model: messagePostRequest.model,
		max_tokens: 1000,
		temperature: 0.5,
		messages: messages.reverse()
	} satisfies ChatCompletionProps;

	let response = await createChatCompletion(completionProps);
	var assistantMessage = {
		text: response,
		role: MessageRole.ASSISTANT,
		type: 'text',
		conversationId: conversationId
	} as Message;

	assistantMessage = await messagesRepository.newMessage(assistantMessage);

	return json(assistantMessage);
}) satisfies RequestHandler;

export const GET = (async ({ params }) => {
	let conversation_id = Number(params.conversation_id);
	let messages = await messagesRepository.getAllMessagesFromConversation(conversation_id);

	return json(messages);
}) satisfies RequestHandler;

export type MessagePostRequest = {
	message: Message;
	systemMessage: string;
	model: string;
};

export type MessagePostResponse = {
	assistantMessage: Message;
};
