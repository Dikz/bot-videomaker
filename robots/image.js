const google = require('googleapis').google
const customSearch = google.customsearch('v1')
const state = require('./state')

const googleSearchCredentials = {
  auth: process.env.GOOGLE_APIKEY,
  cx: process.env.SEARCH_ENGINE_ID
}

async function robot() {
  const content = state.load()

  await fetchImagesOfAllSentences(content)

  state.save(content)

  async function fetchImagesOfAllSentences(content) {
    for (const sentence of content.sentences) {
      const query = `${content.searchTerm} ${sentence.keywords[0]}`
      sentence.images = await fetchGoogleAndReturnImagesLinks(query)

      sentence.googleSearchQuery = query
    }
  }

  async function fetchGoogleAndReturnImagesLinks(query) {
    const response = await customSearch.cse.list({
      ...googleSearchCredentials,
      searchType: 'image',
      q: query,
      num: 2
    })

    const imagesUrl = response.data.items.map(item => item.link)

    return imagesUrl
  }
}

module.exports = robot
