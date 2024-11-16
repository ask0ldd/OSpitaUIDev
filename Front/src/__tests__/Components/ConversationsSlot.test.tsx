/* eslint-disable @typescript-eslint/no-unused-vars */
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/react/dont-cleanup-after-each'
import Chat from '../../pages/Chat';
import { OllamaService } from '../../services/OllamaService';
import AgentService from '../../services/API/AgentService';
import { render, screen, waitFor, act, cleanup } from '@testing-library/react';
import {describe, beforeEach, vi, expect, test, afterEach } from 'vitest';
import '@testing-library/react/dont-cleanup-after-each'
import mockModelsList from '../../__mocks__/mockModelsList';
import mockAgentsList from '../../__mocks__/mockAgentsList';
import DocService from '../../services/API/DocService';
import mockRAGDocumentsList from '../../__mocks__/mockRAGDocumentsList';
import PromptService from '../../services/API/PromptService';
import mockPromptsList from '../../__mocks__/mockPromptsList';
import mockRunningModelsInfos from '../../__mocks__/mockRunningModelsInfos';
import { ConversationsRepository } from '../../repositories/ConversationsRepository';
import mockConversationsList from '../../__mocks__/mockConversationsList';
import { ChatService } from '../../services/ChatService';
import { WebSearchService } from '../../services/WebSearchService';

const MockedRouter = () => (
    <MemoryRouter>
      <Chat />
    </MemoryRouter>
);

const mockVoices = [
    { name: 'Voice 1', lang: 'en-US' },
    { name: 'Voice 2', lang: 'es-ES' },
];

const mockFirstConversation = 
{
    name : "First Conversation",
    history : [],
    lastAgentUsed : "mockAgent",
    lastModelUsed : "mockModel",
    images : []
}

describe('Given I am on the Chat page', () => {
    beforeEach(() => {
        HTMLDialogElement.prototype.show = vi.fn()
        HTMLDialogElement.prototype.showModal = vi.fn()
        HTMLDialogElement.prototype.close = vi.fn()
        vi.spyOn(OllamaService, 'getModelList').mockResolvedValue(mockModelsList)
        vi.spyOn(OllamaService, 'getRunningModelInfos').mockResolvedValue(mockRunningModelsInfos)
        vi.spyOn(AgentService, 'getAll').mockResolvedValue(mockAgentsList)
        vi.spyOn(AgentService, 'getAgentByName').mockResolvedValue(mockAgentsList[0])
        vi.spyOn(DocService, 'getAll').mockResolvedValue(mockRAGDocumentsList)
        vi.spyOn(PromptService, 'getAll').mockResolvedValue(mockPromptsList)
        /*vi.spyOn(ConversationsRepository, 'getConversations').mockReturnValue([mockFirstConversation, ...mockConversationsList])
        vi.spyOn(ConversationsRepository, 'deleteConversation')*/
        ConversationsRepository.setConversations([mockFirstConversation, mockConversationsList[0], mockConversationsList[1], mockConversationsList[2]])
        ChatService.abortAgentLastRequest = vi.fn()
        WebSearchService.abortLastRequest = vi.fn()
        vi.stubGlobal('speechSynthesis', {
            getVoices: vi.fn().mockReturnValue(mockVoices),
        });
        render(<MockedRouter />)
    });

    afterEach(() => {
        vi.resetAllMocks()
        cleanup()
    })

    test('Three conversations displayed', async () => {
        await waitFor(() => expect(screen.getByText(/First Conversation/i)).toBeInTheDocument())
        expect(screen.getByText(mockConversationsList[0].name)).toBeInTheDocument()
        expect(screen.getByText(mockConversationsList[1].name)).toBeInTheDocument()
        expect(screen.queryByText(mockConversationsList[2].name)).not.toBeInTheDocument()
    })

    test('Next page / Previous page buttons are working', async () => {
        await waitFor(() => expect(screen.getByText(/First Conversation/i)).toBeInTheDocument())
        expect(screen.getByText(mockConversationsList[0].name)).toBeInTheDocument()
        expect(screen.getByText(mockConversationsList[1].name)).toBeInTheDocument()
        expect(screen.queryByText(mockConversationsList[2].name)).not.toBeInTheDocument()

        const previousPagesButtons = screen.getAllByTitle("previous page")
        const nextPagesButtons = screen.getAllByTitle("next page")

        act(() => nextPagesButtons[0].click())
        await waitFor(() => expect(screen.getByText(mockConversationsList[2].name)).toBeInTheDocument())

        act(() => previousPagesButtons[0].click())
        await waitFor(() => expect(screen.getByText(/First Conversation/i)).toBeInTheDocument())
    })

    test('New conversation button is working', async () => {
        await waitFor(() => expect(screen.getByText(/First Conversation/i)).toBeInTheDocument())
        const newConversationButton = screen.getAllByTitle("new conversation")[0]
        act(() => newConversationButton.click())
        await waitFor(() => expect(screen.getByText(/New Conversation/i)).toBeInTheDocument())
    })

    test('Delete conversation button is working', async () => {
        await waitFor(() => expect(screen.getByText(/First Conversation/i)).toBeInTheDocument())
        const newConversationButton = screen.getAllByTitle("new conversation")[0]
        act(() => newConversationButton.click())
        await waitFor(() => expect(screen.getByText(/New Conversation/i)).toBeInTheDocument())
        const deleteConversationButton = screen.getAllByTitle("delete conversation")[0]
        act(() => deleteConversationButton.click())
        await waitFor(() => expect(screen.queryByText(/New Conversation/i)).not.toBeInTheDocument())
    })

    test('When all the existing conversations are deleted, a blank conversation is created', async () => {
        await waitFor(() => expect(screen.getByText(/First Conversation/i)).toBeInTheDocument())
        const newConversationButton = screen.getAllByTitle("new conversation")[0]
        act(() => newConversationButton.click())
        await waitFor(() => expect(screen.getByText(/New Conversation/i)).toBeInTheDocument())
        let deleteConversationButton = screen.getAllByTitle("delete conversation")[0]
        act(() => deleteConversationButton.click())
        deleteConversationButton = screen.getAllByTitle("delete conversation")[0]
        act(() => deleteConversationButton.click())
        deleteConversationButton = screen.getAllByTitle("delete conversation")[0]
        act(() => deleteConversationButton.click())
        deleteConversationButton = screen.getAllByTitle("delete conversation")[0]
        act(() => deleteConversationButton.click())
        deleteConversationButton = screen.getAllByTitle("delete conversation")[0]
        act(() => deleteConversationButton.click())
        await waitFor(() => expect(screen.queryByText(/New Conversation/i)).not.toBeInTheDocument())
    })

    test('Switching conversation', async () => {
        await waitFor(() => expect(screen.getByText(/First Conversation/i)).toBeInTheDocument())
        const conversationsList = screen.getByText("CONVERSATIONS").parentElement?.children[1]
        expect(conversationsList?.children[0].className.includes("active")).toBeTruthy()
        expect(conversationsList?.children[1].className.includes("active")).toBeFalsy()
        act(() => (conversationsList?.children[1] as HTMLElement).click())
        await waitFor(() => expect(conversationsList?.children[0].className.includes("active")).toBeFalsy())
        expect(conversationsList?.children[1].className.includes("active")).toBeTruthy()
    })



})