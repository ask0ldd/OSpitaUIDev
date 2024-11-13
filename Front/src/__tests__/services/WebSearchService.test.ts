/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { AIAgent } from '../../models/AIAgent'
import AgentService from '../../services/API/AgentService'
import { WebSearchService } from '../../services/WebSearchService'
import mockAgentsList from '../../__mocks__/mockAgentsList'
import { ICompletionResponse } from '../../interfaces/responses/ICompletionResponse'
import IScrapedPage from '../../interfaces/IScrapedPage'
import ScrapedPage from '../../models/ScrapedPage'

// Mock dependencies
vi.mock('./API/AgentService')
vi.mock('../models/AIAgent')
vi.mock('../models/ScrapedPage')

// Mock the fetch function
const mockFetch = vi.fn()
global.fetch = mockFetch

const mockScrapedPages : IScrapedPage[] = [
    {datas : "datas1", source : "source1"},
    {datas : "datas2", source : "source2"},
]

const mockCompletionResponse : ICompletionResponse = {
    model: "mockModel",
    created_at: "date",
    response: "query",
    done: true,
    context: [1, 2, 3],
    total_duration: 0,
    load_duration: 0,
    prompt_eval_count: 0,
    prompt_eval_duration: 0,
    eval_count: 0,
    eval_duration: 0,
} 

const mockSummarizationResponse : ICompletionResponse = {
    model: "mockModel",
    created_at: "date",
    response: "summarizedData",
    done: true,
    context: [1, 2, 3],
    total_duration: 0,
    load_duration: 0,
    prompt_eval_count: 0,
    prompt_eval_duration: 0,
    eval_count: 0,
    eval_duration: 0,
} 

const mockOptimizerRequest = {
    "model": mockAgentsList[0].model,
    "stream": false,
    "system": mockAgentsList[0].systemPrompt,
    "prompt": "query",
    "context" : [],
    "options": { 
        "num_ctx": mockAgentsList[0].num_ctx,
        "temperature" : mockAgentsList[0].temperature, 
        "num_predict" : mockAgentsList[0].num_predict 
    }   
}

const mockSummarizerRequest = {
    "model": mockAgentsList[0].model,
    "stream": false,
    "system": mockAgentsList[0].systemPrompt,
    "prompt": `Produce a summary with the following context :\n
                        <SCRAPEDDATAS>datas1</SCRAPEDDATAS>\n
                        <REQUEST>query</REQUEST>\n
                    `,
    "context" : [],
    "options": { 
        "num_ctx": mockAgentsList[0].num_ctx,
        "temperature" : mockAgentsList[0].temperature, 
        "num_predict" : mockAgentsList[0].num_predict 
    }   
}

describe('WebSearchService', () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.resetAllMocks()
        
        // Reset WebSearchService
        WebSearchService.setWebSearchSummarizationStatus(false)
        WebSearchService.generateNewAbortControllerAndSignal()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('scraping', () => {
        it('should scrape data without summarization', async () => {
            vi.spyOn(AgentService, 'getAgentByName').mockResolvedValueOnce(mockAgentsList[0])

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValue(mockCompletionResponse),
            }).mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(mockScrapedPages)
            })

            const result = await WebSearchService.scrapeRelatedDatas({query : "query", maxPages : 5})

            expect(mockFetch).toHaveBeenCalledWith("/ollama/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(mockOptimizerRequest),
                signal: new AbortController().signal,
            })
            expect(mockFetch).toHaveBeenCalledWith('/backend/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ query : "query" }),
                signal : new AbortController().signal,
            })

            expect(result).toEqual(mockScrapedPages.map(page => new ScrapedPage(page.datas, page.source)))
        })

        it('scrape endpoint doesnt send an array back', async () => {
            vi.spyOn(AgentService, 'getAgentByName').mockResolvedValueOnce(mockAgentsList[0])

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValue(mockCompletionResponse),
            }).mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(undefined)
            })

            console.error = vi.fn()

            await expect(WebSearchService.scrapeRelatedDatas({query: "query", maxPages: 5}))
            .rejects.toThrow();

            expect(mockFetch).toHaveBeenCalledWith("/ollama/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(mockOptimizerRequest),
                signal: new AbortController().signal,
            })
            expect(mockFetch).toHaveBeenCalledWith('/backend/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ query : "query" }),
                signal : new AbortController().signal,
            })

            expect(console.error).toHaveBeenCalled()
        })

        it('should handle API error and log it', async () => {
            vi.spyOn(AgentService, 'getAgentByName').mockResolvedValueOnce(mockAgentsList[0])
            mockFetch.mockRejectedValue(new Error('API Error'))
            console.error = vi.fn()

            await expect(WebSearchService.scrapeRelatedDatas({query: "query", maxPages: 5}))
            .rejects.toThrow();
            expect(console.error).toHaveBeenCalled()
        })

        it('should handle queryOptimizer agent missing and log it', async () => {
            vi.spyOn(AgentService, 'getAgentByName').mockResolvedValueOnce(undefined)
            mockFetch.mockRejectedValue(new Error('API Error'))
            console.error = vi.fn()

            await expect(WebSearchService.scrapeRelatedDatas({query: "query", maxPages: 5}))
            .rejects.toThrow();
            expect(console.error).toHaveBeenCalled()
        })

        it('should scrape data with summarization', async () => {
            vi.spyOn(AgentService, 'getAgentByName').mockResolvedValue(mockAgentsList[0])
            WebSearchService.setWebSearchSummarizationStatus(true)

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValue(mockCompletionResponse),
            }).mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValue(mockScrapedPages)
            }).mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(mockSummarizationResponse)
            })

            const result = await WebSearchService.scrapeRelatedDatas({query : "query", maxPages : 5})

            expect(mockFetch).toHaveBeenCalledWith("/ollama/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(mockOptimizerRequest),
                signal: new AbortController().signal,
            })
            expect(mockFetch).toHaveBeenCalledWith('/backend/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ query : "query" }),
                signal : new AbortController().signal,
            })
            expect(mockFetch).toHaveBeenNthCalledWith(3, "/ollama/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(mockSummarizerRequest),
                signal: new AbortController().signal,
            })

            expect(result).toEqual(mockScrapedPages.map(page => new ScrapedPage("summarizedData", page.source)))
        })
    })

    describe('web search status', () => {
        it('should be false by default', async() => {
            expect(WebSearchService.getWebSearchSummarizationStatus()).toBeFalsy()
        })

        it('should be true when set to true', async() => {
            WebSearchService.setWebSearchSummarizationStatus(true)
            expect(WebSearchService.getWebSearchSummarizationStatus()).toBeTruthy()
        })
    })
})
