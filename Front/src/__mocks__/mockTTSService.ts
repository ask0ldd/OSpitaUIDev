import { vi } from "vitest";

export const mockTTSService = () => ({
    TTSService: vi.fn().mockImplementation(() => ({
        synth: mockSynth,
        voices: mockSynth.getVoices(),
        populateVoiceList: vi.fn(() => mockSynth.getVoices()),
        speak: vi.fn(),
        resume: vi.fn(),
        pause: vi.fn(),
        stop: vi.fn(),
        isPlaying: vi.fn(() => mockSynth.speaking),
    }))
})

const mockSynth = {
    getVoices: vi.fn(() => [
      { name: 'Voice B' },
      { name: 'Voice A' },
      { name: 'Voice C' },
    ]),
    speak: vi.fn(),
    cancel: vi.fn(),
    resume: vi.fn(),
    pause: vi.fn(),
    speaking: false,
};