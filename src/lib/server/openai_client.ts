import { SECRET_OPENAI_API_KEY } from '$env/static/private';
import { MessageRole, type Message } from '$lib/types';
import { Configuration, OpenAIApi, type ChatCompletionRequestMessage } from 'openai';

const configuration = new Configuration({
	apiKey: SECRET_OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

export type CompletionProps = {
	prompt: string;
	model: string;
	max_tokens: number;
	temperature: number;
};

export type ChatCompletionProps = {
	systemMessage: string;
	model: string;
	max_tokens: number;
	temperature: number;
	messages: Message[];
};

type ChatCompletionResponse = {
	content: string;
	tokens: number;
};

export async function createChatCompletion(
	props: ChatCompletionProps
): Promise<ChatCompletionResponse | null> {
	let openAiMessages = props.messages.map((message) => {
		return {
			role: message.role,
			content: message.text,
			name: 'User'
		} satisfies ChatCompletionRequestMessage;
	});

	openAiMessages.unshift({
		role: MessageRole.SYSTEM,
		content: props.systemMessage,
		name: 'System'
	} satisfies ChatCompletionRequestMessage);

	try {
		let response = await openai.createChatCompletion({
			model: props.model,
			messages: openAiMessages,
			temperature: props.temperature,
			max_tokens: props.max_tokens
		});

		//FIXME error handling missing
		if (response.data.choices.length > 0) {
			return {
				content: response.data.choices[0].message!.content,
				tokens: response.data.usage!.total_tokens
			} satisfies ChatCompletionResponse;
		} else {
			return null;
		}
	} catch (error: any) {
		if (error.response) {
			console.log(error.response.status);
			console.log(error.response.data);
		} else {
			console.log(error.message);
		}
		return null;
	}
}
