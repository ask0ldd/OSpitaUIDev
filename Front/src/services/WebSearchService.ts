/* eslint-disable no-unused-private-class-members */
/* eslint-disable @typescript-eslint/no-unused-vars */
import IScrapedPage from "../interfaces/IScrapedPage";
import { AIAgent } from "../models/AIAgent";
import ScrapedPage from "../models/ScrapedPage";
import AgentService from "./API/AgentService";

export class WebSearchService{

    static #abortController : AbortController = new AbortController()
    static #signal = this.#abortController.signal
    static #queryOptimizer : AIAgent
    static #scrapedDatasSummarizer : AIAgent

    static #isWebSearchSummarizationActivated = false

    static async scrapeRelatedDatas({query , maxPages = 3} : {query : string, maxPages? : number, summarize? : boolean}) : Promise<ScrapedPage[] | undefined>{
        try{
            const optimizedQuery = await this.#optimizeQuery(query)
            const trimedQuery = this.#trimQuotes(optimizedQuery)
            const scrapedPages = await this.#callExternalScraper(trimedQuery, maxPages)
            if(!this.#isWebSearchSummarizationActivated) return scrapedPages
            const summarizedScrapedPages = await this.#summarizeScrapedPages(scrapedPages, query)
            return summarizedScrapedPages
        }catch(error){
            console.error('Error while trying to scrape the needed datas :', error)
            throw error
        }
    }

    // !!! should be able to abort
    static async #callExternalScraper(query : string, maxPages : number = 3) : Promise<ScrapedPage[]>{ // !!! make use of maxPages
        try {
            const response = await fetch('/backend/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ query : query }),
                signal : this.#signal,
            })
    
            // Check if the response is OK (status in the range 200-299)
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status} : ${response.text()}`)
            }
    
            const scrapedPages : IScrapedPage[] | unknown = await response.json()
    
            // Validate the data structure
            if (!Array.isArray(scrapedPages)) {
                throw new Error('Invalid response format: Expected an array')
            }
    
            // object mapping
            return scrapedPages.map(page => new ScrapedPage(page.datas, page.source))

        } catch (error) {
            console.error('Error calling the scraper API :', error)
            throw error
        }
    }

    // convert the user request into an optimized search query
    static async #optimizeQuery(query : string) : Promise<string> {
        try{
            console.log("**Optimizing your query**")
            const dbAgent = await AgentService.getAgentByName('searchQueryOptimizer')
            if(dbAgent == null) throw new Error('No searchQueryOptimizer agent found')
            this.#queryOptimizer = new AIAgent({...dbAgent, modelName : dbAgent.model})
            return (await this.#queryOptimizer.ask(query)).response
        } catch (error) {
            console.error("Error calling the query optimizer : " + error)
            throw error
        }
    }

    // summarizing the scraped datas so it will take less context
    static async #summarizeScrapedPages(scrapedPages : ScrapedPage[], query : string) : Promise<ScrapedPage[]> {
        try{
            console.log("**Summarizing**")
            const dbAgent = await AgentService.getAgentByName('scrapedDatasSummarizer')
            if(dbAgent == null) return scrapedPages
            const summarizedPages = [...scrapedPages]
            this.#scrapedDatasSummarizer = new AIAgent({...dbAgent, modelName : dbAgent.model})
            // console.log(this.#scrapedDatasSummarizer.getSystemPrompt())
            for (const page of summarizedPages) {
                // console.log('INITIAL DATA : ' + page.datas)
                page.setDatas(
                    (await this.#scrapedDatasSummarizer.ask(`Produce a summary with the following context :\n
                        <SCRAPEDDATAS>${page.datas}</SCRAPEDDATAS>\n
                        <REQUEST>${query}</REQUEST>\n
                    `)).response
                )
                // console.log('SUMMARY : ' + page.datas)
            }

            return summarizedPages
        } catch (error) {
            console.error("Error calling the summarizer : " + error)
            throw error
        }
    }

    static #trimQuotes(str : string) : string {
        return str.replace(/^['"]|['"]$/g, '').replace('"', " ").replace("'", " ")
    }

    static abortLastRequest() : void{
        if(this.#abortController) this.#abortController.abort("Signal aborted.")
        if(this.#scrapedDatasSummarizer) this.#scrapedDatasSummarizer.abortLastRequest()
        if(this.#queryOptimizer) this.#queryOptimizer.abortLastRequest()
        // need to create a new abort controller and a new signal
        // or subsequent request will be aborted from the get go
        this.generateNewAbortControllerAndSignal()
    }

    static generateNewAbortControllerAndSignal() : void{
        this.#abortController = new AbortController()
        this.#signal = this.#abortController.signal
    }

    static getWebSearchSummarizationStatus() : boolean{
        return this.#isWebSearchSummarizationActivated
    }

    static setWebSearchSummarizationStatus(status : boolean) : void{
        this.#isWebSearchSummarizationActivated = status
    }
}