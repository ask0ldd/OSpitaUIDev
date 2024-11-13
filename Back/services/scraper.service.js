const cheerio = require('cheerio')
const fs = require('fs').promises
const TurndownService = require('turndown')

async function fetchPage(url) {
    /*const imgTagRegex = /<img[^>]*\/>/gi
    const imgTagRegex2 = /<img[^>]*\/><\/img>/gi
    const imgTagRegex3 = /<img[^>]*>/gi
    const imgTagRegex4 = /<a[^>]/gi
    const imgTagRegex5 = /<iframe[^>]*>/gi*/
    try {
        const response = await fetch(url)
        if (!response.ok) {
            console.error(`Response status: ${response.status}`)
            return undefined
            // throw new Error(`Response status: ${response.status}`)
        }
        const htmlContent = await response.text()
        const webpage = cheerio.load(htmlContent)
        webpage('script').remove()
        webpage('style').remove()
        webpage('nav').remove()
        webpage('header').remove()
        webpage('footer').remove()
        webpage('img').remove()
        webpage('form').remove()
        webpage('a').remove()

        var turndownService = new TurndownService()
        var markdown = turndownService.turndown(webpage('body').html())
        await fs.writeFile('./scrapeddatas.txt', markdown, 'utf-8') 
        return markdown

       /*const imgTagRegex6 = /<img[^>]*>/gi

        const cleanText = (webpage("body").html())
            .replace(/[\n\t]+/g, '\n')
            .replace(imgTagRegex, '')
            .replace(imgTagRegex2, '')
            .replace(imgTagRegex3, '')
            .replace(imgTagRegex4, '')
            .replace(imgTagRegex5, '')
            .replace("</a>", "")
            .replace("\'", "'")
            .replace('\"', '"')
            .replace('</iframe>', "")
            .replace(/\s+/g, ' ')
        console.log(cleanText)
        return cleanText*/
        // console.log(webpage("body").text().replace(/[\n\t]+/g, '\n').replace(/\t+/g, '')).replace(/[ ]{4,}/g, '   ')
        // await fs.writeFile('./scrapeddatas.txt', webpage("body").text().replace(/[\n\t]+/g, '\n').replace(/[\t\r\v\f]/g, '').replace(/[ ]{4,}/g, '   ').replace(/[\n]{3,}/g, '\n').replace(/[\s\n]+/g, "\n"), 'utf8')
        // await fs.writeFile('./scrapeddatas.txt', webpage("body").text().replace(/\t/g, '').replace(/[\t\r\v\f]/g, '').replace(/[\n]{3,}/g, '\n'), 'utf-8')
        await fs.writeFile('./scrapeddatas.txt', webpage("body").text().replace(/[\t\r\v\f]/g, '').replace(/[ ]{3,}/g, ' ').replace(/[\n]{2,}/g, '\n').replace(/[\s\n]{2,}/g, "\n\n\n"), 'utf-8')
        return webpage("body").text().replace(/[\t\r\v\f]/g, '').replace(/[ ]{3,}/g, ' ').replace(/[\n]{2,}/g, '\n').replace(/[\s\n]{2,}/g, "\n\n\n")
    }catch(error){
        console.error(error)
    }
}

function convertTableToMarkdown(table, webpage) {
    let markdown = ''
    
    // Extract headers
    const headers = []
    webpage(table).find('th').each((i, el) => {
        headers.push(webpage(el).text().trim())
    })
    
    markdown += `| ${headers.join(' | ')} |\n`
    markdown += `| ${headers.map(() => '---').join(' | ')} |\n`
    
    // Extract rows
    webpage(table).find('tr').each((i, row) => {
        const rowData = []
        webpage(row).find('td').each((j, cell) => {
            rowData.push(webpage(cell).text().trim())
        })
        if (rowData.length > 0) {
            markdown += `| ${rowData.join(' | ')} |\n`
        }
    })
    
    return markdown
}

function toTelegraphicText(text) {
    const wordsToRemove = [
      'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should',
      'can', 'could', 'may', 'might', 'must', 'ought', 'to', 'of', 'for', 'with'
    ]
  
    let words = text.split(/\s+/)
  
    words = words.filter(word => {
      return !wordsToRemove.includes(word) && word.length > 0
    })
  
    return words.join(' ')
}

module.exports = {
    fetchPage: fetchPage
}