import type { ConversationsRepository } from '$lib/server/database/conversations_repository';
import { PrismaDb } from '$lib/server/database/prisma_db';
import { json, type RequestHandler } from '@sveltejs/kit';

let conversationsRepository: ConversationsRepository = new PrismaDb();

export const PUT = (async ({ request }) => {
	const conversationPostRequest: ConversationArchivePostRequest = await request.json();
	const archivedConversation = await conversationsRepository.archiveConversation(
		conversationPostRequest.conversationId
	);

	return json(archivedConversation);
}) satisfies RequestHandler;

export type ConversationArchivePostRequest = {
	conversationId: number;
};
