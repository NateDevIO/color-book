// API URL: use relative path in production (Firebase), localhost in development
const getApiUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocalhost ? 'http://localhost:3001/api/generate' : '/api/generate';
};

export const generateImage = async (topic: string, complexity: string): Promise<string> => {
  const t = topic.toLowerCase();

  // Determine complexity level for pre-loaded assets
  let level = 'little';
  if (complexity.includes('intricate') || complexity.includes('complex')) level = 'expert';
  else if (complexity.includes('moderate')) level = 'big';

  // Check for pre-loaded assets first (instant response, browser-cached)
  if (t.includes('dinosaur')) return `/assets/dinosaur-${level}.png`;
  if (t.includes('unicorn')) return `/assets/unicorn-${level}.png`;
  if (t.includes('robot')) return `/assets/robot-${level}.png`;
  if (t.includes('butterfly')) return `/assets/butterfly-${level}.png`;
  if (t.includes('car')) return `/assets/car-${level}.png`;
  if (t.includes('flower')) return `/assets/flower-${level}.png`;

  // For custom prompts, call the backend API with just the topic
  try {
    const apiUrl = getApiUrl();
    console.log(`Calling backend with topic: "${topic}" at ${apiUrl}`);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: topic })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.error || `Server error (${response.status})`;
      console.error('Server returned error:', errorMsg);
      throw new Error(errorMsg);
    }

    if (!data.image) {
      throw new Error('No image in response');
    }

    return data.image;

  } catch (error) {
    console.error('Backend API call failed:', error);
    // Re-throw with more context so App.tsx can show a better message
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Make sure the server is running on port 3001.');
    }
    throw error;
  }
};
