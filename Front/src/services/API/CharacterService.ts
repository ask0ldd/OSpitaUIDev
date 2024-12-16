import ICharacterSettings from "../../interfaces/ICharacterSettings"

class CharacterService{
    async getAll(){
        try {
            const response = await fetch("/backend/characters", {
                method: "GET",
                headers: { "Content-Type": "application/json", }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
            
        } catch (error) {
            console.error("Error fetching characters list : ", error)
            return undefined
        }
    }

    async getSettings() : Promise<ICharacterSettings | undefined>{
        try {
            const response = await fetch("/backend/character/settings", {
                method: "GET",
                headers: { "Content-Type": "application/json", }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
            
        } catch (error) {
            console.error("Error fetching character settings : ", error)
            return undefined
        }
    }

    async saveSettings({model, temperature, num_ctx, num_predict} : ICharacterSettings){
        try {
            const response = await fetch("/backend/character/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json", },
                body : JSON.stringify({model, temperature, num_ctx, num_predict})
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
            
        } catch (error) {
            console.error("Error saving character settings : ", error)
            return undefined
        }
    }

    async updateModel(model : string){
        try {
            const response = await fetch("/backend/character/model", {
                method: "PUT",
                headers: { "Content-Type": "application/json", },
                body : JSON.stringify({model})
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
            
        } catch (error) {
            console.error("Error saving character settings : ", error)
            return undefined
        }
    }
}

export default CharacterService