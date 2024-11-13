import { IListModelResponse } from "../interfaces/responses/IListModelResponse"

const mockModelsList : IListModelResponse = {"models":[
    {"name":"aya-expanse:8b","model":"aya-expanse:8b","modifiedAt":"2024-10-27T10:19:34+01:00","size":6596833975,"digest":"1ac4fd9f8a6eeab49f8390fddaf912f463c0eceab2e9c86034d8609bdabac15a","details":{"parentModel":"","format":"gguf","family":"command-r","families":["command-r"],"parameterSize":"8.0B","quantizationLevel":"Q6_K"}},
    {"name":"llama3.2:1b","model":"llama3.2:1b","modifiedAt":"2024-09-26T03:40:58+02:00","size":1321098329,"digest":"baf6a787fdffd633537aa2eb51cfd54cb93ff08e28040095462bb63daf552878","details":{"parentModel":"","format":"gguf","family":"llama","families":["llama"],"parameterSize":"1.2B","quantizationLevel":"Q8_0"}},
    {"name":"llama3.2:3b","model":"llama3.2:3b","modifiedAt":"2024-09-26T02:41:36+02:00","size":2019393189,"digest":"a80c4f17acd55265feec403c7aef86be0c25983ab279d83f3bcd3abbcb5b8b72","details":{"parentModel":"","format":"gguf","family":"llama","families":["llama"],"parameterSize":"3.2B","quantizationLevel":"Q4_K_M"}},
    {"name":"mistral-nemo:12b","model":"mistral-nemo:12b","modifiedAt":"2024-09-03T09:50:34+02:00","size":7071713232,"digest":"994f3b8b78011aa6d578b0c889cbb89a64b778f80d73b8d991a8db1f1e710ace","details":{"parentModel":"","format":"gguf","family":"llama","families":["llama"],"parameterSize":"12.2B","quantizationLevel":"Q4_0"}},
    {"name":"llama3.1:8b","model":"llama3.1:8b","modifiedAt":"2024-07-28T15:40:48+02:00","size":4661226402,"digest":"62757c860e01d552d4e46b09c6b8d5396ef9015210105427e05a8b27d7727ed2","details":{"parentModel":"","format":"gguf","family":"llama","families":["llama"],"parameterSize":"8.0B","quantizationLevel":"Q4_0"}},
    {"name":"nomic-embed-text:v1.5","model":"nomic-embed-text:v1.5","modifiedAt":"2024-05-19T00:55:36+02:00","size":274302450,"digest":"0a109f422b47e3a30ba2b10eca18548e944e8a23073ee3f3e947efcf3c45e59f","details":{"parentModel":"","format":"gguf","family":"nomic-bert","families":["nomic-bert"],"parameterSize":"137M","quantizationLevel":"F16"}}
]}

export default mockModelsList