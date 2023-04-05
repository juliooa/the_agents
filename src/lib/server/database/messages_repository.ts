import type { Message } from '../../types';

export interface MessagesRepository {
	getLastMessagesFromConversation(conversationId: number, nroMessages: number): Promise<Message[]>;
	newMessage(message: Message): Promise<Message>;
	getAllMessagesFromConversation(conversationId: number): Promise<Message[]>;
}
