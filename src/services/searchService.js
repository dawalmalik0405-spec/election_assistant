const TAVILY_API_URL = 'https://api.tavily.com/search';

export const performWebSearch = async (query, apiKey) => {
  if (!apiKey) {
    throw new Error('Tavily API Key is required for real web search.');
  }

  try {
    const response = await fetch(TAVILY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: 'advanced',
        include_answer: true,
        include_images: false,
        include_raw_content: false,
        max_results: 5,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch search results');
    }

    const data = await response.json();
    return {
      answer: data.answer || "I couldn't find a direct answer, but here are some relevant sources.",
      results: data.results.map(r => ({
        title: r.title,
        url: r.url,
        content: r.content
      }))
    };
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};
