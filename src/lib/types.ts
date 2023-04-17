export enum MessageRole {
	USER = 'user',
	ASSISTANT = 'assistant',
	SYSTEM = 'system'
}

export type Message = {
	id: number;
	remoteId?: number;
	text: string;
	role: MessageRole;
	imageUrl?: string;
	type: string;
	name?: string;
	conversationId: number;
	user_id: string;
};

export type Conversation = {
	id: number;
	name: string;
	systemMessage: string;
	model: string;
	promptTemplate: string;
	user_id: string;
};

export type Agent = {
	id: number;
	name: string;
	model: string;
	imageUrl?: string;
	systemMessage: string;
	promptTemplate: string;
};
