import type { Message } from '../../types';

export interface MessagesRepository {
	getLastMessagesFromConversation(conversationId: number, nroMessages: number): Promise<Message[]>;
	newMessage(message: Message, tokens: number): Promise<Message>;
	getAllMessagesFromConversation(conversationId: number): Promise<Message[]>;
	getMessagesLimit(userId: string): Promise<MessageLimitResponse>;
}

export type MessageLimitResponse = {
	messagesSent: number;
	messagesLimit: number;
};
