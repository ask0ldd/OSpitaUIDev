import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import PromptService from '../../services/API/PromptService';
import IPromptResponse from '../../interfaces/responses/IPromptResponse';
import mockPromptsList from '../../__mocks__/mockPromptsList';

// Mock fetch globally
// Mock the fetch function
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('PromptService', () => {
  beforeEach(() => {
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('save', () => {
    it('should save a prompt successfully', async () => {
      const mockResponse = { ok: true };
      mockFetch.mockResolvedValue(mockResponse)

      await new PromptService().save(mockPromptsList[0].name, mockPromptsList[0].prompts[0].text)

      expect(mockFetch).toHaveBeenCalledWith('/backend/prompt', {
        method: 'POST',
        body: JSON.stringify({name : mockPromptsList[0].name, prompt : mockPromptsList[0].prompts[0].text, version : 1}),
        headers: { 'Content-Type': 'application/json' }
      })
    })

    it('should handle errors when saving fails', async () => {
      const mockResponse = { ok: false };
      mockFetch.mockResolvedValue(mockResponse)
      console.error = vi.fn()

      await new PromptService().save('Test Prompt', 'This is a test prompt')

      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('updateByName', () => {
    it('should update a prompt by name successfully', async () => {
      const mockResponse = { ok: true };
      mockFetch.mockResolvedValue(mockResponse)

      await new PromptService().updateByName(mockPromptsList[0].name, { newName: 'New Name', prompt: 'Updated prompt', version: 2 })

      expect(mockFetch).toHaveBeenCalledWith('/backend/prompt/byName/' + mockPromptsList[0].name, {
        method: 'PUT',
        body: JSON.stringify({ name: 'New Name', prompt: 'Updated prompt', version: 2 }),
        headers: { 'Content-Type': 'application/json' }
      })
    })

    it('should handle errors when updating by name fails', async () => {
      const mockResponse = { ok: false };
      mockFetch.mockResolvedValue(mockResponse)
      console.error = vi.fn()

      await new PromptService().updateByName('Old Name', { newName: 'New Name', prompt: 'Updated prompt', version: 2 })

      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('updateById', () => {
    it('should update a prompt by ID successfully', async () => {
      const mockResponse = { ok: true };
      mockFetch.mockResolvedValue(mockResponse)

      await new PromptService().updateById('123', { name: 'Updated Name', prompt: 'Updated prompt', version: 2 })

      expect(mockFetch).toHaveBeenCalledWith('/backend/prompt/byId/123', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated Name', prompt: 'Updated prompt', version: 2 }),
        headers: { 'Content-Type': 'application/json' }
      })
    })

    it('should handle errors when updating by ID fails', async () => {
      const mockResponse = { ok: false };
      mockFetch.mockResolvedValue(mockResponse)
      console.error = vi.fn()

      await new PromptService().updateById('123', { name: 'Updated Name', prompt: 'Updated prompt', version: 2 })

      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('getByName', () => {
    it('should get a prompt by name successfully', async () => {
      const mockPrompt: IPromptResponse = mockPromptsList[0];
      const mockResponse = { ok: true, json: () => Promise.resolve(mockPrompt) };
      mockFetch.mockResolvedValue(mockResponse)

      const result = await new PromptService().getByName(mockPromptsList[0].name)

      expect(result).toEqual(mockPrompt)
      expect(mockFetch).toHaveBeenCalledWith('/backend/prompt/byName/' + mockPromptsList[0].name, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
    })

    it('should handle errors when getting by name fails', async () => {
      const mockResponse = { ok: false, status: 404 };
      mockFetch.mockResolvedValue(mockResponse)
      console.error = vi.fn()

      const result = await new PromptService().getByName('Non-existent Prompt')

      expect(result).toBeUndefined()
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('getAll', () => {
    it('should get all prompts successfully', async () => {
      const mockPrompts: IPromptResponse[] = [
        mockPromptsList[0], mockPromptsList[1]
      ];
      const mockResponse = { ok: true, json: () => Promise.resolve(mockPrompts) };
      mockFetch.mockResolvedValue(mockResponse)

      const result = await new PromptService().getAll()

      expect(result).toEqual(mockPrompts)
      expect(mockFetch).toHaveBeenCalledWith('/backend/prompts', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
    })

    it('should handle errors when getting all prompts fails', async () => {
      const mockResponse = { ok: false, status: 500 };
      mockFetch.mockResolvedValue(mockResponse)
      console.error = vi.fn()

      const result = await new PromptService().getAll()

      expect(result).toBeUndefined()
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('deleteById', () => {
    it('should delete a prompt by ID successfully', async () => {
      const mockResponse = { ok: true };
      mockFetch.mockResolvedValue(mockResponse)

      await new PromptService().deleteById('123')

      expect(mockFetch).toHaveBeenCalledWith('/backend/prompt/byId/123', {
        method: 'DELETE'
      })
    })

    it('should handle errors when deleting by ID fails', async () => {
      const mockResponse = { ok: false, status: 404 };
      mockFetch.mockResolvedValue(mockResponse)
      console.error = vi.fn()

      await new PromptService().deleteById('non-existent-id')

      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('deleteByName', () => {
    it('should delete a prompt by name successfully', async () => {
      const mockResponse = { ok: true };
      mockFetch.mockResolvedValue(mockResponse)

      await new PromptService().deleteByName('Test Prompt')

      expect(mockFetch).toHaveBeenCalledWith('/backend/prompt/byName/Test Prompt', {
        method: 'DELETE'
      })
    })

    it('should handle errors when deleting by name fails', async () => {
      const mockResponse = { ok: false, status: 404 };
      mockFetch.mockResolvedValue(mockResponse)
      console.error = vi.fn()

      await new PromptService().deleteByName('Non-existent Prompt')

      expect(console.error).toHaveBeenCalled()
    })
  })
})