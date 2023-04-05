import type { ConversationsRepository } from '$lib/server/database/conversations_repository';
import { PrismaDb } from '$lib/server/database/prisma_db';
import type { Conversation } from '$lib/types';
import { json, type RequestHandler } from '@sveltejs/kit';

let conversationsRepository: ConversationsRepository = new PrismaDb();

export const POST = (async ({ request }) => {
	const conversationPostRequest: ConversationPostRequest = await request.json();

	const newConversation = await conversationsRepository.newConversation(
		conversationPostRequest.name,
		conversationPostRequest.systemMessage,
		conversationPostRequest.model,
		conversationPostRequest.promptTemplate
	);

	return json(newConversation);
}) satisfies RequestHandler;

export const PUT = (async ({ request }) => {
	const conversationPutRequest: ConversationPutRequest = await request.json();

	const updatedConversation = await conversationsRepository.updateConversation(
		conversationPutRequest.conversation
	);
	return json(updatedConversation);
}) satisfies RequestHandler;

export type ConversationPostRequest = {
	name: string;
	systemMessage: string;
	model: string;
	promptTemplate: string;
};

export type ConversationPutRequest = {
	conversation: Conversation;
};
