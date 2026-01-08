export const generateImage = async (prompt: string, apiKey?: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const p = prompt.toLowerCase();
  const timestamp = Date.now();

  // 1. Check for local assets first (Quick Picks)
  if (p.includes('dinosaur')) return `/assets/dinosaur.png?t=${timestamp}`;
  if (p.includes('unicorn')) return `/assets/unicorn.png?t=${timestamp}`;
  if (p.includes('robot')) return `/assets/robot.png?t=${timestamp}`;
  if (p.includes('butterfly')) return `/assets/butterfly.png?t=${timestamp}`;
  if (p.includes('car')) return `/assets/car.png?t=${timestamp}`;
  if (p.includes('flower')) return `/assets/flower.png?t=${timestamp}`;

  // 2. If API Key is present, call Real AI (Simulated for this demo, but structure is here)
  if (apiKey) {
    console.log("Calling AI with key:", apiKey);
    // Here you would fetch('https://api.anthropic.com/v1/messages', ...)
    // For now, we will fallback to mock but simulate "AI" logic
    // In a real implementation this would return the generated image URL
  }

  // 3. Fallback Mock for custom queries without API Key
  // Return a generic placeholder or the "Flower" as default if totally unknown
  return `/assets/flower.png?t=${timestamp}`;
};
