const saveAgent = (db) => async (req, res) => {
    try {
      validateAgentInputs(req.body) // !!! should validate all parameters
  
      const { name, model, temperature, systemPrompt, num_ctx, num_predict } = req.body
  
      const agentsCollection = db.getCollection('agents')
      const promptsCollection = db.getCollection('prompts')
      if (!agentsCollection) {
        throw new Error('The agents collection does not exist in the database.')
      }
  
      const existingAgent = await agentsCollection.findOne({ name }/*, [], promptsCollection*/)
      if (existingAgent) {
        return res.status(409).send('Agent name is not available.')
      }

      const highestLokiId = await agentsCollection.chain()
        .simplesort('$loki', { desc: true })
        .limit(1)
        .data()[0].$loki
      
      const nZerosNeeded = 10 - (highestLokiId + 1).toString().length
  
      const newAgent = { ...req.body, id: "a" + '0'.repeat(nZerosNeeded) + (highestLokiId + 1) }
      await agentsCollection.insertOne(newAgent)
  
      // applying the previous actions to the database
      db.saveDatabase((err) => {
        if (err) {
            console.error("Error saving database:", err)
            return res.status(500).json({ error: 'Cant save the database' })
        } else {
            console.log("Database saved successfully")
        }
      })

      console.log('Saved agent:', JSON.stringify(newAgent))  
      res.status(201).json({ message: 'Agent saved successfully', agent: newAgent })
    } catch (error) {
      console.error(error)
      if (error.status) {
        res.status(error.status).send(error.message)
      } else {
        res.status(500).send('An error occurred while attempting to save the agent')
      }
    }
}
  
const getAgentById = (db) => async (req, res) => {
    const agentId = req.params.id
    if (!agentId) return res.status(400).json({ error: 'Agent ID is required' })

    try {
        const agent = await db.getCollection('agents').findOne({ _id: agentId })
        if(!agent) return res.status(404).json({ error: 'The requested agent was not found' })
        /*let prompt = await db.getCollection('prompts').findOne({ id: agent.systemPromptId })
        if(!prompt) prompt = ""*/
        return res.status(200).json({...agent})
    } catch (error) {
        console.error('Error fetching agent:', error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const getAgentByName = (db) => async (req, res) => {
  const agentName = req.params.name
  if (!agentName) return res.status(400).json({ error: 'Agent ID is required' })

  try {
      const agent = await db.getCollection('agents').findOne({ name: agentName })
      if(!agent) return res.status(404).json({ error: 'The requested agent was not found' })
      /*let prompt = await db.getCollection('prompts').findOne({ id: agent.systemPromptId })
      if(!prompt) prompt = ""*/
      return res.status(200).json({...agent})
  } catch (error) {
      console.error('Error fetching agent:', error)
      return res.status(500).json({ error: 'Internal server error' })
  }
}

const updateAgentByName = (db) => async (req, res) => {
    try {
      console.log("Attempting to update/create agent")
  
      // Validate request body
      validateAgentInputs(req.body)
  
      const agentsCollection = db.getCollection('agents')
      if (!agentsCollection) {
        return res.status(500).json({ error: 'Agents collection does not exist in database.' })
      }
  
      const agentToUpdate = await agentsCollection.findOne({ name: req.params.name })
      const originalName = agentToUpdate.name
      const agentType = agentToUpdate.type
  
      if (agentToUpdate) {
        // Update existing agent
        Object.assign(agentToUpdate, req.body)

        // if the agent to update is a system agent, then its name can't be changed
        if(agentType == "system") agentToUpdate.name = originalName

        await agentsCollection.update(agentToUpdate)

        // applying the previous actions to the database
        db.saveDatabase((err) => {
          if (err) {
              console.error("Error saving database:", err)
              return res.status(500).json({ error: 'Cant save the database' })
          } else {
              console.log("Database saved successfully")
          }
        })

        console.log(`Updated agent: ${JSON.stringify(agentToUpdate)}`)
        return res.json({ message: 'Agent updated successfully', agent: agentToUpdate })
      } else {
        // Create new agent
        const newAgent = { ...req.body }
        await agentsCollection.insertOne(newAgent)
        console.log(`Created new agent: ${JSON.stringify(newAgent)}`)
        return res.status(201).json({ message: 'Agent created successfully', agent: newAgent })
      }
    } catch (error) {
      console.error(error)
      if (error.status) {
        res.status(error.status).send(error.message)
      } else {
        res.status(500).send('An error occurred while attempting to update the agent')
      }
    }
}

const updateAgentById = (db) => async (req, res) => {
  try {
    console.log("Attempting to update/create agent")

    // Validate request body
    validateAgentInputs(req.body)

    const agentsCollection = db.getCollection('agents')
    if (!agentsCollection) {
      return res.status(500).json({ error: 'Agents collection does not exist in database.' })
    }

    const agentToUpdate = await agentsCollection.findOne({ id: req.params.id })
    const originalName = agentToUpdate.name
    const agentType = agentToUpdate.type

    if (agentToUpdate) {
      // Update existing agent
      Object.assign(agentToUpdate, req.body)

      // if the agent to update is a systeme agent, then its name can't be changed
      if(agentType == "system") agentToUpdate.name = originalName

      await agentsCollection.update(agentToUpdate)

      // applying the previous actions to the database
      db.saveDatabase((err) => {
        if (err) {
            console.error("Error saving database:", err)
            return res.status(500).json({ error: 'Cant save the database' })
        } else {
            console.log("Database saved successfully")
        }
      })

      console.log(`Updated agent: ${JSON.stringify(agentToUpdate)}`)
      return res.json({ message: 'Agent updated successfully', agent: agentToUpdate })
    } else {
      // Create new agent
      const newAgent = { ...req.body }
      await agentsCollection.insertOne(newAgent)
      console.log(`Created new agent: ${JSON.stringify(newAgent)}`)
      return res.status(201).json({ message: 'Agent created successfully', agent: newAgent })
    }
  } catch (error) {
    console.error(error)
    if (error.status) {
      res.status(error.status).send(error.message)
    } else {
      res.status(500).send('An error occurred while attempting to update the agent')
    }
  }
}

const getAllAgents = (db) => async (req, res) => {
    try {
      return res.setHeader("Access-Control-Allow-Origin", "*").status(200).json(db.getCollection("agents").find())
    } catch (error) {
      console.error("Error retrieving agents:", error)
      res.status(500).json({ message: 'An error occurred while retrieving agents.' })
    }
}

const deleteAgentByName = (db) => async (req, res) => {
  const agentName = req.params.name
  if (!agentName) {
      return res.status(400).json({ error: 'Agent name is required' })
  }

  try {
      const collection = db.getCollection('agents')
      const agent = await collection.findOne({ name: agentName })

      if (!agent) {
          return res.status(404).json({ error: 'The requested agent was not found' })
      }

      await collection.findAndRemove({ name: agentName })

      db.saveDatabase((err) => {
          if (err) {
              console.error("Error saving database:", err)
              return res.status(500).json({ error: 'Cannot save the database' })
          }
          console.log("Database saved successfully")
          return res.status(204).send()
      })
  } catch (error) {
      console.error('Error deleting the agent :', error)
      return res.status(500).json({ error: 'Internal server error' })
  }
}

const updateAgentsConfig = (db) => async (req, res) => {
  const {advancedModel, basicModel, embeddingModel} = { ...req.body }
  try{
    const collection = db.getCollection('agents')
    if (!collection) {
      return res.status(500).json({ error: 'Agents collection does not exist in database' })
    }

    const baseAssistant = await collection.findOne({ name: "baseAssistant" })
    if(!baseAssistant) return res.status(404).json({ error: 'Agent does not exist in database' })
    await collection.update({...baseAssistant, model : advancedModel})

    const helpfulAssistant = await collection.findOne({ name: "helpfulAssistant" })
    if(!helpfulAssistant) return res.status(404).json({ error: 'Agent does not exist in database' })
    await collection.update({...helpfulAssistant, model : advancedModel})

    const COTReflexionAgent = await collection.findOne({ name: "COTReflexionAgent" })
    if(!COTReflexionAgent) return res.status(404).json({ error: 'Agent does not exist in database' })
    await collection.update({...COTReflexionAgent, model : advancedModel})

    const COTTableGenerator = await collection.findOne({ name: "COTTableGenerator" })
    if(!COTTableGenerator) return res.status(404).json({ error: 'Agent does not exist in database' })
    await collection.update({...COTTableGenerator, model : advancedModel})

    const searchQueryOptimizer = await collection.findOne({ name: "searchQueryOptimizer" })
    if(!searchQueryOptimizer) return res.status(404).json({ error: 'Agent does not exist in database' })
    await collection.update({...searchQueryOptimizer, model : basicModel})

    const scrapedDatasSummarizer = await collection.findOne({ name: "scrapedDatasSummarizer" })
    if(!scrapedDatasSummarizer) return res.status(404).json({ error: 'Agent does not exist in database' })
    await collection.update({...scrapedDatasSummarizer, model : basicModel})

    const completionAgent = await collection.findOne({ name: "completionAgent" })
    if(!scrapedDatasSummarizer) return res.status(404).json({ error: 'Agent does not exist in database' })
    await collection.update({...completionAgent, model : basicModel})

    // applying the previous actions to the database
    db.saveDatabase((err) => {
      if (err) {
          console.error("Error saving database:", err)
          return res.status(500).json({ error: 'Cant save the database' })
      } else {
          console.log("Database saved successfully")
      }
    })

    return res.json({ message: 'Agents updated successfully' })

  }catch(error){
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

function validateAgentInputs(body) {
    if (!body || typeof body !== 'object') {
      throw createError(400, 'The request body doesn\'t contain the expected agent data.')
    }
    const { name, model, temperature, systemPrompt, num_ctx, num_predict } = body
  
    if (!name || !model || !temperature || !systemPrompt || !num_ctx || !num_predict) {
      throw createError(400, 'The request body doesn\'t contain the expected agent data.')
    }
    if (typeof name !== 'string' || name.length < 4 || name.length > 128) {
      throw createError(400, 'Name must be a string between 4 and 128 characters.')
    }
    if (typeof model !== 'string') {
      throw createError(400, 'Model must be a non-empty string.')
    }
    if (typeof temperature !== 'number' || temperature < 0 || temperature > 2) {
      throw createError(400, 'Temperature must be a number between 0 and 2.')
    }
    if (typeof systemPrompt !== 'string') {
      throw createError(400, 'System prompt must be a non-empty string with max 4096 characters.')
    }
    if (!Number.isInteger(num_ctx) || num_ctx <= 0) {
      throw createError(400, 'Context size must be a positive integer.')
    }
    if (!Number.isInteger(num_predict) || num_predict <= 0) {
      throw createError(400, 'Number of predictions must be a positive integer.')
    }
}
  
function createError(status, message) {
    const error = new Error(message)
    error.status = status
    return error
}

module.exports = { saveAgent, getAgentById, getAgentByName, updateAgentByName, updateAgentById, getAllAgents, deleteAgentByName, updateAgentsConfig }