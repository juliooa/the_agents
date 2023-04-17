import { SECRET_OPENAI_API_KEY } from '$env/static/private';
import type { ConversationsRepository } from '$lib/server/database/conversations_repository';
import { PrismaDb } from '$lib/server/database/prisma_db';
import type { Conversation } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

let conversationsRepository: ConversationsRepository = new PrismaDb();

export const load: PageServerLoad = async ({ url, locals }) => {
	let apiKeyPresent = SECRET_OPENAI_API_KEY !== undefined;
	const selectedConversationId = url.searchParams.get('selectedConversationId');
	const showNewAgentTab = Boolean(url.searchParams.get('showNewAgentTab'));

	let session = await locals.getSession();
	if (session == null) {
		throw error(401);
	}
	let conversations = await conversationsRepository.getAllConversations(session?.user.id);
	if (conversations.length === 0) {
		return {
			nroTabs: 1,
			selectedTab: 0,
			newAgentTabSelected: true,
			conversations: [],
			apiKeyPresent: apiKeyPresent
		} satisfies DashboardTabsPageData;
	}

	if (selectedConversationId === null) {
		return {
			nroTabs: conversations.length + 1,
			selectedTab: showNewAgentTab ? conversations.length : 0,
			newAgentTabSelected: showNewAgentTab,
			conversations: conversations,
			apiKeyPresent: apiKeyPresent
		} satisfies DashboardTabsPageData;
	}

	let selectedConversationIndex = conversations.findIndex(
		(c) => c.id === Number(selectedConversationId)
	);
	return {
		nroTabs: conversations.length + 1,
		selectedTab: selectedConversationIndex,
		newAgentTabSelected: false,
		conversations: conversations,
		apiKeyPresent: apiKeyPresent
	} satisfies DashboardTabsPageData;
};

export type DashboardTabsPageData = {
	nroTabs: number;
	selectedTab: number;
	newAgentTabSelected: boolean;
	conversations: Conversation[];
	apiKeyPresent: boolean;
};
