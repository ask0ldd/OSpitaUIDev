import { createContext, ReactNode } from 'react';
import PromptService from '../services/API/PromptService';
import AgentService from '../services/API/AgentService';
import { WebSearchService } from '../services/WebSearchService';
import { TTSService } from '../services/TTSService';
import ImageService from '../services/API/ImageService';
import CharacterService from '../services/API/CharacterService';
import ComfyUIService from '../services/ComfyUIService';
import ImageGenWorkflowService from '../services/API/imageGen/imageGenWorkflowService';
import ImageGenPromptService from '../services/API/imageGen/ImageGenPromptService';
import { ChatService } from '../services/ChatService';
import AnswerFormatingService from '../services/AnswerFormatingService';
import InferenceStatsFormatingService from '../services/InferenceStatsFormatingService';

export interface ServicesContextType {
  agentService: AgentService
  promptService: PromptService
  webSearchService: WebSearchService
  ttsService : TTSService
  imageService : ImageService
  characterService : CharacterService
  comfyUIService : ComfyUIService
  workflowService : ImageGenWorkflowService
  imagePromptService : ImageGenPromptService
  chatService : ChatService
  answerFormatingService : AnswerFormatingService
  inferenceStatsFormatingService : InferenceStatsFormatingService
}

const defaultContextValue: ServicesContextType = {
  agentService: new AgentService(),
  promptService: new PromptService(),
  webSearchService: new WebSearchService(),
  ttsService : new TTSService(),
  imageService : new ImageService(),
  characterService : new CharacterService(),
  comfyUIService : new ComfyUIService(),
  workflowService : new ImageGenWorkflowService(),
  imagePromptService : new ImageGenPromptService(),
  chatService : new ChatService(new AnswerFormatingService(), new InferenceStatsFormatingService()),
  answerFormatingService : new AnswerFormatingService(),
  inferenceStatsFormatingService : new InferenceStatsFormatingService()
};

export const ServicesContext = createContext<ServicesContextType>(defaultContextValue);

interface ServicesProviderProps {
  children: ReactNode;
  customServices?: Partial<ServicesContextType>;
}

export function ServicesProvider({ children, customServices }: ServicesProviderProps) {
  const contextValue: ServicesContextType = {
    ...defaultContextValue,
    ...customServices,
  };

  return (
    <ServicesContext.Provider value={contextValue}>
      {children}
    </ServicesContext.Provider>
  );
}