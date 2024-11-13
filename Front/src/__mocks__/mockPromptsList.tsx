import IPromptResponse from "../interfaces/responses/IPromptResponse"

const mockPromptsList : IPromptResponse[] = [
    {
        id: 'p0000000001',
        name: "helpfulAssistantPrompt",
        prompts: [
           {
              version: 1,
              text: "You are a helpful assistant.",
              createdAt: new Date().toISOString(),
           },
           {
              version: 2,
              text: "You are a knowledgeable and friendly AI assistant.",
              createdAt: new Date().toISOString(),
           }
        ],
        currentVersion: 2,
        meta : {revision : 0, created : 0, version : 0},
        $loki : 1,
    },
    {
        id: 'p0000000002',
        name: "defaultAssistantPrompt",
        prompts: [
           {
              version: 1,
              text: "You are a helpful assistant.",
              createdAt: new Date().toISOString(),
           },
           {
              version: 2,
              text: "You are a knowledgeable and friendly AI assistant.",
              createdAt: new Date().toISOString(),
           }
        ],
        currentVersion: 2,
        meta : {revision : 0, created : 0, version : 0},
        $loki : 2,
    },
    {
        id: 'p0000000003',
        name: "COTAssistantPrompt",
        prompts: [
           {
              version: 1,
              text: "You are an AI assistant tasked with creating a step-by-step mental reflection plan on how to fulfill a request.",
              createdAt: new Date().toISOString(),
           },
           {
              version: 2,
              text: "You are an AI assistant tasked with creating a step-by-step mental reflection plan on how to fulfill a request.",
              createdAt: new Date().toISOString(),
           }
        ],
        currentVersion: 2,
        meta : {revision : 0, created : 0, version : 0},
        $loki : 3,
    },
    {
      id: 'p0000000004',
      name: "MockPrompt",
      prompts: [
         {
            version: 1,
            text: "You are an AI assistant tasked with creating a step-by-step mental reflection plan on how to fulfill a request.",
            createdAt: new Date().toISOString(),
         },
         {
            version: 2,
            text: "You are an AI assistant tasked with creating a step-by-step mental reflection plan on how to fulfill a request.",
            createdAt: new Date().toISOString(),
         }
      ],
      currentVersion: 2,
      meta : {revision : 0, created : 0, version : 0},
      $loki : 4,
  },
]
export default mockPromptsList