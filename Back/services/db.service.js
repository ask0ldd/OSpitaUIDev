const fs = require('fs')
const prompts = require('../constants/prompts.js')
const agents = require('../constants/agents.js')
const { SETTINGS_FILE } = require('../controllers/character.controller.js')
const { getAllYamlAsJson } = require('../services/yaml.service.js')

function databaseInit(db) {
    // removeCollections(db)
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
    if (db.getCollection("generatedImages") === null) {
        db.addCollection("generatedImages")
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

function removeCollections(db){
    const collectionNames = db.listCollections().map(col => col.name)
    collectionNames.forEach(name => {
      db.removeCollection(name)
    })
}

module.exports = {
    databaseInit
};