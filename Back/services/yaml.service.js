const yaml = require('js-yaml');
const fs   = require('fs');

const path = './constants/characters/'

function getYamlFiles(directory) {
    const files = fs.readdirSync(directory);
    return files.filter(file => file.includes('.yml'));
}

function getAllYamlAsJson(){
    try {
        const files = getYamlFiles(path)
        return files.map(file => yaml.load(fs.readFileSync(path + file), 'utf8'))
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    getAllYamlAsJson
}