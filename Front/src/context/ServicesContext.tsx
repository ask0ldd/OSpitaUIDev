import { createContext, ReactNode } from 'react';
import PromptService from '../services/API/PromptService';
import AgentService from '../services/API/AgentService';
import { WebSearchService } from '../services/WebSearchService';
import { TTSService } from '../services/TTSService';

export interface ServicesContextType {
  agentService: AgentService
  promptService: PromptService
  webSearchService: WebSearchService
  ttsService : TTSService
}

const defaultContextValue: ServicesContextType = {
  agentService: new AgentService(),
  promptService: new PromptService(),
  webSearchService: new WebSearchService(),
  ttsService : new TTSService()
};

export const ServicesContext = createContext<ServicesContextType>({
  agentService: new AgentService(),
  promptService: new PromptService(),
  webSearchService: new WebSearchService(),
  ttsService : new TTSService()
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