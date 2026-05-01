import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchDashboardStats, getCachedData, setCachedData } from '../services/dashboardService';

vi.mock('../services/searchService', () => ({
  performWebSearch: vi.fn().mockResolvedValue({
    answer: "Mock Answer",
    results: [{ title: "Mock Result", content: "Mock Content", url: "#" }]
  })
}));

describe('dashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    global.fetch = vi.fn();
  });

  it('retrieves data from cache if available and not expired', () => {
    const mockData = { test: 'value' };
    setCachedData('test-key', mockData, 60); // 60 mins
    
    const cached = getCachedData('test-key');
    expect(cached).toEqual(mockData);
  });

  it('returns null if cache is expired', () => {
    const mockData = { test: 'value' };
    // Manually set an expired timestamp
    localStorage.setItem('test-key', JSON.stringify(mockData));
    localStorage.setItem('test-key_timestamp', (Date.now() - 10000000).toString());
    
    const cached = getCachedData('test-key');
    expect(cached).toBeNull();
  });

  it('fetchDashboardStats returns mock data on API failure (resiliency check)', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    
    const stats = await fetchDashboardStats('mock-key');
    // It should return the default/fallback stats instead of crashing
    expect(stats.activeElections).toBeDefined();
  });
});
