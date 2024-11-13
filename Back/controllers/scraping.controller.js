const dds = require('duck-duck-scrape');
const scraper = require('../services/scraper.service.js');
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autocomplete = exports.search = void 0;
const html_entities_1 = require("html-entities");
const needle_1 = __importDefault(require("needle"));
const util_1 = require("duck-duck-scrape/lib/util.js");
const defaultOptions = {
  safeSearch: util_1.SafeSearchType.OFF,
  time: util_1.SearchTimeType.ALL,
  locale: 'en-us',
  region: 'wt-wt',
  offset: 0,
  marketRegion: 'us'
};
const SEARCH_REGEX = /DDG\.pageLayout\.load\('d',(\[.+\])\);DDG\.duckbar\.load\('images'/;
const IMAGES_REGEX = /;DDG\.duckbar\.load\('images', ({"ads":.+"vqd":{".+":"\d-\d+-\d+"}})\);DDG\.duckbar\.load\('news/;
const NEWS_REGEX = /;DDG\.duckbar\.load\('news', ({"ads":.+"vqd":{".+":"\d-\d+-\d+"}})\);DDG\.duckbar\.load\('videos/;
const VIDEOS_REGEX = /;DDG\.duckbar\.load\('videos', ({"ads":.+"vqd":{".+":"\d-\d+-\d+"}})\);DDG\.duckbar\.loadModule\('related_searches/;
const RELATED_SEARCHES_REGEX = /DDG\.duckbar\.loadModule\('related_searches', ({"ads":.+"vqd":{".+":"\d-\d+-\d+"}})\);DDG\.duckbar\.load\('products/;

// Scrape 3 web pages related to a provided search query
const getScrapedDatas = (db) => async (req, res) => {

    try {
      if(!req.body || !req.body.query) throw new Error('No query provided')
      const searchRequest = req.body.query
      console.log("searchQuery : " + searchRequest)
      const searchResults = (await search(searchRequest, {
          safeSearch: dds.SafeSearchType.STRICT
      })).results
      const filteredSearchResults = searchResults.filter((result) => !(result.url).includes('youtube'))
      if(filteredSearchResults.length == 0) return res.status(500).send(`Couldn't find any related page`)
      const pageDatas = []
      let resultIndex = 0
      // should have 3 sources excluding the pages rejecting scraping
      while(pageDatas.length < 3 || resultIndex > searchResults.length){
        console.log("resultIndex : " + resultIndex)
        const datas = await scraper.fetchPage(filteredSearchResults[resultIndex].url)
        if(datas != null) pageDatas.push(datas)
          resultIndex += 1
      }
      const pageDatasNSources = pageDatas.map((datas, index) => {
          if(datas == null || filteredSearchResults[index].url == null) return undefined
          return {datas : datas, source : filteredSearchResults[index].url}
      }).filter((pageData) => pageData!= undefined)
      return res.status(200).setHeader("Access-Control-Allow-Origin", "*").json(pageDatasNSources)
    } catch (error) {
      console.error(error)
      res.status(500).send('An error occurred while scraping')
    }
}

module.exports = { getScrapedDatas };

async function search(query, options, needleOptions) {
  if (!query)
      throw new Error('Query cannot be empty!');
  if (!options)
      options = defaultOptions;
  else
      options = sanityCheck(options);
  let vqd = options.vqd;
  if (!vqd)
      vqd = await (0, util_1.getVQD)(query, 'web', needleOptions);
  /* istanbul ignore next */
  const queryObject = {
      q: query,
      ...(options.safeSearch !== util_1.SafeSearchType.STRICT ? { t: 'D' } : {}),
      l: options.locale,
      ...(options.safeSearch === util_1.SafeSearchType.STRICT ? { p: '1' } : {}),
      kl: options.region || 'wt-wt',
      s: String(options.offset),
      dl: 'en',
      ct: 'US',
      // ss_mkt: options.marketRegion,
      df: options.time,
      vqd,
      ...(options.safeSearch !== util_1.SafeSearchType.STRICT ? { ex: String(options.safeSearch) } : {}),
      sp: '1',
      bpa: '1',
      biaexp: 'b',
      msvrtexp: 'b',
      ...(options.safeSearch === util_1.SafeSearchType.STRICT
          ? {
              videxp: 'a',
              nadse: 'b',
              eclsexp: 'a',
              stiaexp: 'a',
              tjsexp: 'b',
              related: 'b',
              msnexp: 'a'
          }
          : {
              nadse: 'b',
              eclsexp: 'b',
              tjsexp: 'b'
              // cdrexp: 'b'
          })
  };
  console.log(`https://links.duckduckgo.com/d.js?${(0, util_1.queryString)(queryObject)}`)
  const response = await (0, needle_1.default)('get', `https://links.duckduckgo.com/d.js?${(0, util_1.queryString)(queryObject)}`, needleOptions);
  if (response.body.includes('DDG.deep.is506'))
      throw new Error('A server error occurred!');
  if (response.body.toString().includes('DDG.deep.anomalyDetectionBlock'))
      throw new Error('DDG detected an anomaly in the request, you are likely making requests too quickly.');
  const searchResults = JSON.parse(SEARCH_REGEX.exec(response.body)[1].replace(/\t/g, '    '));
  // check for no results
  if (searchResults.length === 1 && !('n' in searchResults[0])) {
      const onlyResult = searchResults[0];
      /* istanbul ignore next */
      if ((!onlyResult.da && onlyResult.t === 'EOF') || !onlyResult.a || onlyResult.d === 'google.com search')
          return {
              noResults: true,
              vqd,
              results: []
          };
  }
  const results = {
      noResults: false,
      vqd,
      results: []
  };
  // Populate search results
  for (const search of searchResults) {
      if ('n' in search)
          continue;
      let bang;
      if (search.b) {
          const [prefix, title, domain] = search.b.split('\t');
          bang = { prefix, title, domain };
      }
      results.results.push({
          title: search.t,
          description: (0, html_entities_1.decode)(search.a),
          rawDescription: search.a,
          hostname: search.i,
          icon: `https://external-content.duckduckgo.com/ip3/${search.i}.ico`,
          url: search.u,
          bang
      });
  }
  // Images
  const imagesMatch = IMAGES_REGEX.exec(response.body);
  if (imagesMatch) {
      const imagesResult = JSON.parse(imagesMatch[1].replace(/\t/g, '    '));
      results.images = imagesResult.results.map((i) => {
          i.title = (0, html_entities_1.decode)(i.title);
          return i;
      });
  }
  // News
  const newsMatch = NEWS_REGEX.exec(response.body);
  if (newsMatch) {
      const newsResult = JSON.parse(newsMatch[1].replace(/\t/g, '    '));
      results.news = newsResult.results.map((article) => ({
          date: article.date,
          excerpt: (0, html_entities_1.decode)(article.excerpt),
          image: article.image,
          relativeTime: article.relative_time,
          syndicate: article.syndicate,
          title: (0, html_entities_1.decode)(article.title),
          url: article.url,
          isOld: !!article.is_old
      }));
  }
  // Videos
  const videosMatch = VIDEOS_REGEX.exec(response.body);
  if (videosMatch) {
      const videoResult = JSON.parse(videosMatch[1].replace(/\t/g, '    '));
      results.videos = [];
      /* istanbul ignore next */
      for (const video of videoResult.results) {
          results.videos.push({
              url: video.content,
              title: (0, html_entities_1.decode)(video.title),
              description: (0, html_entities_1.decode)(video.description),
              image: video.images.large || video.images.medium || video.images.small || video.images.motion,
              duration: video.duration,
              publishedOn: video.publisher,
              published: video.published,
              publisher: video.uploader,
              viewCount: video.statistics.viewCount || undefined
          });
      }
  }
  // Related Searches
  const relatedMatch = RELATED_SEARCHES_REGEX.exec(response.body);
  if (relatedMatch) {
      const relatedResult = JSON.parse(relatedMatch[1].replace(/\t/g, '    '));
      results.related = [];
      for (const related of relatedResult.results) {
          results.related.push({
              text: related.text,
              raw: related.display_text
          });
      }
  }
  // TODO: Products
  return results;
}

function sanityCheck(options) {
  options = Object.assign({}, {
    safeSearch: util_1.SafeSearchType.OFF,
    time: util_1.SearchTimeType.ALL,
    locale: 'en-us',
    region: 'wt-wt',
    offset: 0,
    marketRegion: 'us'
  }, options);
  if (!(options.safeSearch in util_1.SafeSearchType))
      throw new TypeError(`${options.safeSearch} is an invalid safe search type!`);
  /* istanbul ignore next */
  if (typeof options.safeSearch === 'string')
      options.safeSearch = util_1.SafeSearchType[options.safeSearch];
  if (typeof options.offset !== 'number')
      throw new TypeError(`Search offset is not a number!`);
  if (options.offset < 0)
      throw new RangeError('Search offset cannot be below zero!');
  if (options.time &&
      !Object.values(util_1.SearchTimeType).includes(options.time) &&
      !/\d{4}-\d{2}-\d{2}..\d{4}-\d{2}-\d{2}/.test(options.time))
      throw new TypeError(`${options.time} is an invalid search time!`);
  if (!options.locale || typeof options.locale !== 'string')
      throw new TypeError('Search locale must be a string!');
  if (!options.region || typeof options.region !== 'string')
      throw new TypeError('Search region must be a string!');
  if (!options.marketRegion || typeof options.marketRegion !== 'string')
      throw new TypeError('Search market region must be a string!');
  if (options.vqd && !/\d-\d+-\d+/.test(options.vqd))
      throw new Error(`${options.vqd} is an invalid VQD!`);
  return options;
}