import type { MessagesRepository } from '$lib/server/database/messages_repository';
import { PrismaDb } from '$lib/server/database/prisma_db';
import { createChatCompletion, type ChatCompletionProps } from '$lib/server/openai_client';
import { MessageRole, type Message } from '$lib/types';
import { error, json, type RequestHandler } from '@sveltejs/kit';

let messagesRepository: MessagesRepository = new PrismaDb();

export const POST = (async ({ request }) => {
	const messagePostRequest: MessagePostRequest = await request.json();

	let messagesLimit = await messagesRepository.getMessagesLimit(messagePostRequest.message.user_id);
	if (messagesLimit.messagesSent >= messagesLimit.messagesLimit) {
		throw error(400, "You've reached your limit of messages");
	}

	let userMessage = await messagesRepository.newMessage(messagePostRequest.message, 0);
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
	if (response != null) {
		var assistantMessage = {
			id: -1, // this is overwritten by the database
			text: response.content,
			role: MessageRole.ASSISTANT,
			type: 'text',
			conversationId: conversationId,
			user_id: userMessage.user_id
		} as Message;

		assistantMessage = await messagesRepository.newMessage(assistantMessage, response.tokens);

		return json(assistantMessage);
	}
	throw new Error('Error creating the chat completion request');
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
