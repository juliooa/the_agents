import { type Message, type Conversation, MessageRole } from '$lib/types';
import { PrismaClient } from '@prisma/client';
import type { Message as PrismaMessage } from '@prisma/client';
import type { ConversationsRepository } from './conversations_repository';
import type { MessagesRepository } from './messages_repository';

const prisma = new PrismaClient();

export class PrismaDb implements MessagesRepository, ConversationsRepository {
	async archiveConversation(conversationId: number): Promise<Conversation> {
		let archivedConversation = await prisma.conversation.update({
			where: {
				id: conversationId
			},
			data: {
				archived: true
			}
		});
		return archivedConversation;
	}

	async getLastMessagesFromConversation(
		conversationId: number,
		nroMessages: number
	): Promise<Message[]> {
		const prismaMessages = await prisma.message.findMany({
			where: {
				conversationId: conversationId
			},
			take: nroMessages,
			orderBy: { id: 'desc' }
		});

		return convertToModelMessages(prismaMessages);
	}

	async getAllConversations(): Promise<Conversation[]> {
		const conversations = await prisma.conversation.findMany({
			where: {
				archived: false
			}
		});
		return conversations;
	}
	getConversation(conversationId: number): Promise<Conversation> {
		throw new Error('Method not implemented.');
	}
	async updateConversation(conversation: Conversation): Promise<Conversation> {
		return await prisma.conversation.update({
			where: {
				id: conversation.id
			},
			data: {
				name: conversation.name,
				systemMessage: conversation.systemMessage,
				model: conversation.model,
				promptTemplate: conversation.promptTemplate
			}
		});
	}

	removeConversation(conversationId: number): boolean {
		throw new Error('Method not implemented.');
	}
	async newConversation(
		name: string,
		systemMessage: string,
		model: string,
		promptTemplate: string
	): Promise<Conversation> {
		const conversation = await prisma.conversation.create({
			data: {
				name: name,
				systemMessage: systemMessage,
				model: model,
				promptTemplate: promptTemplate
			}
		});
		return conversation;
	}

	async newMessage(message: Message): Promise<Message> {
		let prismaMessage = await prisma.message.create({
			data: {
				text: message.text,
				role: message.role,
				conversationId: message.conversationId,
				type: message.type,
				name: message.name
			}
		});
		return convertToModelMessages([prismaMessage])[0];
	}

	async getAllMessagesFromConversation(conversationId: number): Promise<Message[]> {
		const prismaMessages = await prisma.message.findMany({
			where: {
				conversationId: conversationId
			}
		});
		return convertToModelMessages(prismaMessages);
	}
}

function getMessageRole(role: string): MessageRole {
	switch (role) {
		case 'user':
			return MessageRole.USER;
		case 'assistant':
			return MessageRole.ASSISTANT;
		case 'system':
			return MessageRole.SYSTEM;
		default:
			throw new Error(`Invalid role: ${role}`);
	}
}

function convertToModelMessages(prismaMessages: PrismaMessage[]): Message[] {
	const messageList: Message[] = prismaMessages.map((messageDb: PrismaMessage) => {
		const message: Message = {
			id: messageDb.id,
			text: messageDb.text,
			role: getMessageRole(messageDb.role),
			type: messageDb.type,
			name: messageDb.name || '',
			conversationId: messageDb.conversationId
		};
		return message;
	});
	return messageList;
}
