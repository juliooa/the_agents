import type { Conversation } from '../../types';

export interface ConversationsRepository {
	getAllConversations(userId: string): Promise<Conversation[]>;
	getConversation(conversationId: number): Promise<Conversation>;
	updateConversation(conversation: Conversation): Promise<Conversation>;
	removeConversation(conversationId: number): boolean;
	newConversation(
		name: string,
		systemMessage: string,
		promptTemplate: string,
		model: string,
		userId: string
	): Promise<Conversation>;
	archiveConversation(conversationId: number): Promise<Conversation>;
}
