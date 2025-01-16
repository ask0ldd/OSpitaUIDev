const uploadGeneratedImage = (db) => async (req, res) => {
    try{
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        // generated images & vision images don't go into the same collection
        const imagesCollection = db.getCollection('generatedImages')
        if (!imagesCollection) {
            throw new Error('The images collection does not exist in the database.')
        }

        const image = await imagesCollection.insert({ filename : req.file.filename, prompt : req.prompt })

        db.saveDatabase((err) => {
            if (err) {
                console.error("Error saving database:", err)
                return res.status(500).json({ error: 'Cant save the database' })
            } else {
                console.log("Database saved successfully")
            }
        })

        res.json(image)
        // res.send('File uploaded successfully');
    }catch(error){
        console.error("The image can't be save into database :", error)
        res.status(500).json({ message: 'An error occurred while saving images.' })
    }
}

const getAllGeneratedImages = (db) => async (req, res) => {
    try {
        return res.setHeader("Access-Control-Allow-Origin", "*").status(200).json(db.getCollection("generatedImages").find())
    } catch (error) {
        console.error("Error retrieving images:", error)
        res.status(500).json({ message: 'An error occurred while retrieving images.' })
    }
}