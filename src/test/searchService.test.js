import { describe, it, expect, vi, beforeEach } from 'vitest';
import { performWebSearch } from '../services/searchService';

// Mock the GoogleGenerativeAI class using the 'class' syntax for constructor compatibility
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      constructor() {}
      getGenerativeModel() {
        return {
          generateContent: vi.fn().mockResolvedValue({
            response: {
              text: () => JSON.stringify({
                answer: "AI Generated Answer",
                results: [{ title: "AI Source", content: "AI Content", url: "#" }]
              })
            }
          })
        };
      }
    }
  };
});

describe('searchService - performWebSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    
    // Stub global for import.meta.env
    vi.stubGlobal('import', {
      meta: {
        env: {
          VITE_GEMINI_API_KEY: 'mock-gemini-key'
        }
      }
    });
  });

  it('successfully fetches results from Tavily API', async () => {
    const mockTavilyResponse = {
      results: [{ title: 'Test News', content: 'Test Content', url: 'http://test.com' }]
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTavilyResponse,
    });

    const data = await performWebSearch('test query', 'test-key');
    expect(data.results).toHaveLength(1);
    expect(data.results[0].title).toBe('Test News');
  });

  it('triggers AI Search Fallback when Tavily returns 432 (Quota Exceeded)', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 432,
      json: async () => ({ error: 'Quota exceeded' }),
    });

    const data = await performWebSearch('test query', 'test-key');
    
    expect(data.results[0].title).toBe('AI Source');
    expect(data.answer).toBe('AI Generated Answer');
  });

  it('handles network errors by falling back to AI search', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const data = await performWebSearch('test query', 'test-key');
    
    expect(data.results).toBeDefined();
    expect(data.results[0].title).toBe('AI Source');
  });
});
