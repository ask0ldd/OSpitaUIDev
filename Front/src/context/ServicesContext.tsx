import { createContext, ReactNode } from 'react';
import PromptService from '../services/API/PromptService';
import AgentService from '../services/API/AgentService';
import { WebSearchService } from '../services/WebSearchService';
import { TTSService } from '../services/TTSService';
import ImageService from '../services/API/ImageService';
import CharacterService from '../services/API/CharacterService';

export interface ServicesContextType {
  agentService: AgentService
  promptService: PromptService
  webSearchService: WebSearchService
  ttsService : TTSService
  imageService : ImageService
  characterService : CharacterService
}

const defaultContextValue: ServicesContextType = {
  agentService: new AgentService(),
  promptService: new PromptService(),
  webSearchService: new WebSearchService(),
  ttsService : new TTSService(),
  imageService : new ImageService(),
  characterService : new CharacterService(),
};

export const ServicesContext = createContext<ServicesContextType>({
  agentService: new AgentService(),
  promptService: new PromptService(),
  webSearchService: new WebSearchService(),
  ttsService : new TTSService(),
  imageService : new ImageService(),
  characterService : new CharacterService(),
});

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