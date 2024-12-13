const getAllCharacters = (db) => async (req, res) => {
    try {
        return res.setHeader("Access-Control-Allow-Origin", "*").status(200).json(db.getCollection("characters").find())
    } catch (error) {
        console.error("Error retrieving characters:", error)
        res.status(500).json({ message: 'An error occurred while retrieving characters.' })
    }
}

module.exports = {getAllCharacters}