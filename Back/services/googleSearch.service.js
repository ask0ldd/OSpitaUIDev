const puppeteer = require('puppeteer')

async function search(query){
  // Launch the browser
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')

  // Navigate to the Google search page
  await page.goto(`https://www.google.com/search?q=${query}`)

  // Wait for the page to load
  await page.waitForSelector('.g')

  // Extract the search results
  const results = await page.$$('.g')
  const output = []

  for (let i = 0; i < results.length && i < 10; i++) {
    const result = results[i]
    const title = await result.$eval('h3', (element) => element.textContent)
    const url = await result.$eval('a', (element) => element.href)
    // const snippet = await result.$eval('.IsZvec', (element) => element.textContent);

    output.push({
      title,
      url,
      // snippet,
    });
  }

  // Close the browser
  await browser.close()

  return output
}

module.exports = {
    search
}