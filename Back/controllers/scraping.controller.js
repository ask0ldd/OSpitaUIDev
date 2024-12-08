// const dds = require('duck-duck-scrape');
const scraper = require('../services/scraper.service.js');
// const DDF = require('../deprecated/duckduckfix.service.js');
const { search } = require('../services/googleSearch.service.js');

// Scrape 3 web pages related to a provided search query
const getScrapedDatas = (db) => async (req, res) => {

    try {
      if(!req.body || !req.body.query) throw new Error('No query provided')
      const searchRequest = req.body.query
      console.log("searchQuery : " + searchRequest)

      // do the search
      /*const searchResults = (await DDF.search(searchRequest, {
          safeSearch: dds.SafeSearchType.STRICT
      })).results*/
      const searchResults = await search(searchRequest)

      // exclude results coming out of youtube
      const filteredSearchResults = searchResults.filter((result) => !(result.url).includes('youtube'))
      if(filteredSearchResults.length == 0) return res.status(500).send(`Couldn't find any related page`)
      const pagesMarkdownNPubDate = []
      let resultIndex = 0

      // should always have 3 sources excluding the pages rejecting scraping
      while(pagesMarkdownNPubDate.length < 3 || resultIndex > searchResults.length){
        console.log("resultIndex : " + resultIndex)
        const pages = await scraper.fetchPage(filteredSearchResults[resultIndex].url)
        if(pages != null & pages?.markdown != null) pagesMarkdownNPubDate.push(pages)
          resultIndex += 1
      }

      // reorder the scraped pages by the most recent date within their body
      const pageDatasNSources = pagesMarkdownNPubDate.map((page, index) => {
          if(page?.markdown == null || filteredSearchResults[index].url == null) return undefined
          // console.log('page date : ' + page.date)
          // priority : publication / modification meta tags date > most recent body date > default date
          let mostRecentDate = page.date ?? findMostRecentDate(page.markdown) ?? "2020-01-01T23:00:00.000Z"
          return { datas : page.markdown, source : filteredSearchResults[index].url, mostRecentDate}
      }).filter((page) => page != undefined).sort((a, b) => new Date(a.mostRecentDate) - new Date(b.mostRecentDate)).reverse()
      console.log('sorted dates : ' + pageDatasNSources.map(page => page.mostRecentDate))

      return res.status(200).setHeader("Access-Control-Allow-Origin", "*").json(pageDatasNSources)

    } catch (error) {
      console.error(error)
      res.status(500).send('An error occurred while scraping')
    }
}

module.exports = { getScrapedDatas };

function findMostRecentDate(inputString) {
  const dateRegex = /\b(?:(?:(?:0?[1-9]|1[0-2])[-\/](?:0?[1-9]|[12][0-9]|3[01])[-\/](?:19|20)?\d{2}|(?:19|20)?\d{2}[-\/](?:0?[1-9]|1[0-2])[-\/](?:0?[1-9]|[12][0-9]|3[01]))|(?:0?[1-9]|[12][0-9]|3[01])[-\/](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*[-\/](?:19|20)?\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+(?:0?[1-9]|[12][0-9]|3[01]),?\s+(?:19|20)?\d{2}|(?:0?[1-9]|[12][0-9]|3[01])\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+(?:19|20)?\d{2})\b/gi

  const dateMatches = inputString.match(dateRegex);
  if (!dateMatches) return null;

  const parsedDates = dateMatches
    .map(dateString => {
      if(dateString.length == 6) return null
      const date = new Date(dateString);
      return isNaN(date) ? null : date;
    })
    .filter(Boolean);

  if (parsedDates.length === 0) return null;

  const mostRecentDate = new Date(Math.max(...parsedDates));
  return mostRecentDate.toISOString().split('T')[0];
}

/*function findMostRecentDate(inputString) {
  // Regular expression to match various date formats
  const dateRegex = /\b(?:(?:(?:0?[1-9]|1[0-2])[-\/](?:0?[1-9]|[12][0-9]|3[01])[-\/](?:19|20)?\d{2}|(?:19|20)?\d{2}[-\/](?:0?[1-9]|1[0-2])[-\/](?:0?[1-9]|[12][0-9]|3[01]))|(?:0?[1-9]|[12][0-9]|3[01])[-\/](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*[-\/](?:19|20)?\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+(?:0?[1-9]|[12][0-9]|3[01]),?\s+(?:19|20)?\d{2}|(?:0?[1-9]|[12][0-9]|3[01])\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+(?:19|20)?\d{2})\b/gi
  
  // Find all date matches in the input string
  const dateMatches = inputString.match(dateRegex);

  console.log(dateMatches)
  
  if (!dateMatches) {
    return null; // No dates found
  }
  
  // Convert matches to Date objects
  const dates = dateMatches.map(dateString => {
    if(dateString.length == 6) return null
    // Try parsing with Date.parse
    const parsedDate = Date.parse(dateString);
    if (!isNaN(parsedDate)) {
      return new Date(parsedDate);
    }
    
    // If Date.parse fails, try manual parsing
    const parts = dateString.split(/[-/\s,]+/);
    if (parts.length === 3) {
      const [part1, part2, part3] = parts;
      
      // Check if part1 is a month name
      const monthIndex = getMonthIndex(part1);
      if (monthIndex !== -1) {
        return new Date(part3, monthIndex, part2);
      }
      
      // Check if part2 is a month name
      const monthIndex2 = getMonthIndex(part2);
      if (monthIndex2 !== -1) {
        return new Date(part3, monthIndex2, part1);
      }
      
      // Assume format is MM/DD/YYYY or YYYY/MM/DD
      if (part1.length === 4) {
        return new Date(part1, part2 - 1, part3);
      } else {
        return new Date(part3, part1 - 1, part2);
      }
    }
    
    return null; // Unable to parse
  }).filter(d => d!= null)
  
  if (dates.length === 0) {
    return null; // No valid dates found
  }
  
  // Find the most recent date
  const mostRecentDate = new Date(Math.max.apply(null, dates));

  console.log(mostRecentDate)
  
  // Format the result as a string (YYYY-MM-DD)
  return mostRecentDate.toISOString().split('T')[0];
}

// Helper function to get month index from name
function getMonthIndex(month) {
  const months = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];
  return months.findIndex(m => m.toLowerCase().startsWith(month.toLowerCase()));
}*/