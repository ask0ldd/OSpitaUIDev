const fs = require('fs')
const prompts = require('./constants/prompts.js')
const agents = require('./constants/agents.js')
const { savePrompt, getPromptById, getPromptByName, getAllPrompts, updatePromptById, updatePromptByName, deletePromptById } = require('./controllers/prompt.controller.js')
const { saveAgent, updateAgentByName, updateAgentById, getAgentById, getAgentByName, getAllAgents, deleteAgentByName, updateAgentsConfig } = require('./controllers/agent.controller.js')
const { getAllDocs, getDocsChunksBySimilarity, saveEmbeddings, deleteDocumentEmbeddings } = require('./controllers/doc.controller.js')
const { saveConversation, getAllConversations, getConversationById, deleteConversationById, updateConversationById } = require('./controllers/conversation.controller.js')
const { getScrapedDatas } = require('./controllers/scraping.controller.js')
const { getAllCharacters, saveCharacterSettings, getCharacterSettings, SETTINGS_FILE, initCharacterSettings, updateCharacterModel } = require('./controllers/character.controller.js')
const { uploadImage, getAllImages, deleteImageById } = require('./controllers/image.controller.js')
const { getAllYamlAsJson } = require('./services/yaml.service.js')
// const { getTTSaudio } = require('./controllers/tts.controller.js')
const express = require('express')
const multer = require('multer')
const path = require('path')
const cors = require('cors')
const loki = require("lokijs")
const LokiFSAdapter = require("lokijs/src/loki-fs-structured-adapter")
const VectorDatabase = require('./models/VectorDatabase.js')


const app = express()
const PORT = process.env.PORT || 5174

function databaseInit() {
    // removeCollections()
    if (db.getCollection("prompts") === null) {
      db.addCollection("prompts")
    }
    if (db.getCollection("agents") === null) {
        db.addCollection("agents")
    }
    if (db.getCollection("docs") === null) {
        db.addCollection("docs")
    }
    if (db.getCollection("images") === null) {
      db.addCollection("images")
    }
    // db.removeCollection("conversations")
    if (db.getCollection("conversations") === null) {
      db.addCollection("conversations")
    }
    db.removeCollection("characters")
    if (db.getCollection("characters") === null) {
      db.addCollection("characters")
    }
    if(!fs.existsSync(SETTINGS_FILE)) initCharacterSettings({model : "llama3.2:3b", temperature : 0.8, num_ctx : 5000, num_predict : 2048})
    if(db.getCollection("prompts").find().length == 0) prompts.forEach(prompt => db.getCollection("prompts").insert(prompt))
    if(db.getCollection("agents").find().length == 0) agents.forEach(agent => db.getCollection("agents").insert(agent))
    if(db.getCollection("characters").find().length == 0) getAllYamlAsJson().forEach(character => db.getCollection("characters").insert(character))
    // myCollection.on('insert', function(input) { input.id = input.$loki; })
}

const adapter = new LokiFSAdapter()
const db = new loki('sandbox.db', { 
  adapter : adapter,
  autoload: true,
  autoloadCallback : databaseInit,
  autosave: true, 
  autosaveInterval: 4000
})

const vdb = new VectorDatabase("./embeddings.db")
vdb.start()
vdb.clearDB()

console.log(db.listCollections())

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

app.get('/ping', (req, res) => {
  console.log("ping")
  res.status(200).json({message: "pong"})
})

app.post('/scrape', getScrapedDatas())

// defining the AIAgents related routes
app.post('/agent', saveAgent(db))
app.put('/agents/config', updateAgentsConfig(db))
app.put('/agent/byName/:name', updateAgentByName(db))
app.put('/agent/byId/:id', updateAgentById(db))
app.get('/agent/byName/:name', getAgentByName(db))
app.get('/agents', getAllAgents(db))
app.delete('/agent/byName/:name', deleteAgentByName(db))

// defining the Prompts related routes
app.post('/prompt', savePrompt(db))
app.get('/prompt/byId/:id', getPromptById(db))
app.put('/prompt/byId/:id', updatePromptById(db))
app.put('/prompt/byName/:name', updatePromptByName(db))
app.get('/prompt/byName/:name', getPromptByName(db))
app.get('/prompts', getAllPrompts(db))
app.delete('/prompt/byId/:id', deletePromptById(db))

// defining Documents related routes
app.post('/embeddings', saveEmbeddings(vdb))
app.get('/docs', getAllDocs(vdb))
app.post('/docs/bySimilarity', getDocsChunksBySimilarity(vdb))
app.delete('/doc/byName/:name', deleteDocumentEmbeddings(vdb))

// conversations
app.post('/conversation', saveConversation(db))
app.get('/conversations', getAllConversations(db))
app.get('/conversation/byId/:id', getConversationById(db))
app.put('/conversation/byId/:id', updateConversationById(db))
app.delete('/conversation/byId/:id', deleteConversationById(db))
// app.post('/tts/generate', getTTSaudio)

// characters
app.get('/characters', getAllCharacters(db))
app.get('/character/settings', getCharacterSettings(db))
app.put('/character/settings', saveCharacterSettings(db))
app.put('/character/model', updateCharacterModel(db))

// images
const upload = initImageStorage()
app.post('/upload', upload.single('image'), uploadImage(db))
app.get('/images', getAllImages(db))
// app.get('/image/byFilename/:filename', getImageByFilename(db))
app.use('/images', express.static('images'))
app.delete('/image/byId/:id', deleteImageById(db))

function removeCollections(){
  const collectionNames = db.listCollections().map(col => col.name)
  collectionNames.forEach(name => {
    db.removeCollection(name)
  })
}

function initImageStorage(){
  // images
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  })
  // Create upload middleware
  return multer({ storage: storage })
}