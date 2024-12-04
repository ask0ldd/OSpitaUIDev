/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TTSService } from '../../services/TTSService';

global.SpeechSynthesisUtterance = vi.fn().mockImplementation(() => {
  return {
      text: '',
      lang: '',
      pitch: 1,
      rate: 1,
      volume: 1,
      onend: null,
      onerror: null,
      speak: vi.fn(),
  };
});

describe('TTSService', () => {
  let ttsService: TTSService;
  let mockSynth: any;

  beforeEach(() => {
    // Mock the window.speechSynthesis
    mockSynth = {
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

    global.window.speechSynthesis = mockSynth

    ttsService = new TTSService();
  });

  it('should populate and sort voices on construction', () => {
    expect(ttsService.voices).toEqual([
      { name: 'Voice A' },
      { name: 'Voice B' },
      { name: 'Voice C' },
    ]);
  });

  /*it('should speak the given text', () => {
    const text = 'Hello, world!';
    ttsService.speak(text);

    expect(mockSynth.speak).toHaveBeenCalledTimes(1);
    // expect(mockSynth.speak.mock.calls[0][0]).toBeInstanceOf(global.SpeechSynthesisUtterance);
    expect(mockSynth.speak.mock.calls[0][0].text).toBe(text);
  });*/

  it('should cancel speaking if already speaking', () => {
    mockSynth.speaking = true;
    ttsService.speak('Test');

    expect(mockSynth.cancel).toHaveBeenCalledTimes(1);
  });

  it('should not speak if text is empty', () => {
    ttsService.speak('');
    expect(mockSynth.speak).not.toHaveBeenCalled();
  });

  it('should resume speech synthesis', () => {
    ttsService.resume();
    expect(mockSynth.resume).toHaveBeenCalledTimes(1);
  });

  it('should pause speech synthesis', () => {
    ttsService.pause();
    expect(mockSynth.pause).toHaveBeenCalledTimes(1);
  });

  it('should stop speech synthesis', () => {
    ttsService.stop();
    expect(mockSynth.cancel).toHaveBeenCalledTimes(1);
  });

  it('should check if speech synthesis is playing', () => {
    mockSynth.speaking = true;
    expect(ttsService.isPlaying()).toBe(true);

    mockSynth.speaking = false;
    expect(ttsService.isPlaying()).toBe(false);
  });
});
