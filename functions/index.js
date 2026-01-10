import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';

// Define the API key as a secret (set via: firebase functions:secrets:set OPENAI_API_KEY)
const openaiApiKey = defineSecret('OPENAI_API_KEY');

// Simple in-memory rate limiter
const rateLimiter = {
    requests: new Map(),
    windowMs: 60000, // 1 minute window
    maxRequests: 10, // Max 10 requests per minute per IP

    isAllowed(ip) {
        const now = Date.now();
        const windowStart = now - this.windowMs;

        if (!this.requests.has(ip)) {
            this.requests.set(ip, []);
        }

        const history = this.requests.get(ip);
        const recentRequests = history.filter(time => time > windowStart);
        this.requests.set(ip, recentRequests);

        if (recentRequests.length >= this.maxRequests) {
            return false;
        }

        recentRequests.push(now);
        return true;
    }
};

// CORS headers helper
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

// Main API function
export const api = onRequest(
    {
        secrets: [openaiApiKey],
        cors: true,
        maxInstances: 10
    },
    async (req, res) => {
        // Handle CORS preflight
        if (req.method === 'OPTIONS') {
            res.set(corsHeaders);
            res.status(204).send('');
            return;
        }

        res.set(corsHeaders);

        const path = req.path;

        // Health check endpoint
        if (path === '/api/health' && req.method === 'GET') {
            res.json({
                status: 'ok',
                hasOpenAiKey: !!openaiApiKey.value()
            });
            return;
        }

        // Generate image endpoint
        if (path === '/api/generate' && req.method === 'POST') {
            // Rate limiting
            const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
            if (!rateLimiter.isAllowed(clientIp)) {
                res.status(429).json({ error: 'Too many requests. Please wait a minute before trying again.' });
                return;
            }

            const { prompt } = req.body || {};

            // Validate prompt
            if (!prompt) {
                res.status(400).json({ error: 'Prompt is required' });
                return;
            }

            if (typeof prompt !== 'string') {
                res.status(400).json({ error: 'Prompt must be a string' });
                return;
            }

            const trimmedPrompt = prompt.trim();
            if (trimmedPrompt.length === 0) {
                res.status(400).json({ error: 'Prompt cannot be empty' });
                return;
            }

            if (trimmedPrompt.length > 500) {
                res.status(400).json({ error: 'Prompt must be 500 characters or less' });
                return;
            }

            const apiKey = openaiApiKey.value();
            if (!apiKey) {
                res.status(500).json({ error: 'OPENAI_API_KEY not configured. Set it using: firebase functions:secrets:set OPENAI_API_KEY' });
                return;
            }

            try {
                console.log(`Generating coloring book image for: "${trimmedPrompt}"`);

                // Call DALL-E 3 API with timeout
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 60000);

                const response = await fetch('https://api.openai.com/v1/images/generations', {
                    signal: controller.signal,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: 'dall-e-3',
                        prompt: `A simple black and white coloring book page illustration of: ${trimmedPrompt}.
                        Style: Clean line art with thick black outlines on pure white background.
                        Simple shapes suitable for young children to color.
                        No shading, no gray tones, no colors - just black lines on white.
                        Cute and child-friendly design.`,
                        n: 1,
                        size: '1024x1024',
                        quality: 'standard',
                        response_format: 'b64_json'
                    })
                });

                clearTimeout(timeout);
                const data = await response.json();

                if (data.error) {
                    console.error('DALL-E error:', data.error);
                    throw new Error(data.error.message);
                }

                if (!data.data?.[0]?.b64_json) {
                    throw new Error('No image data in response');
                }

                console.log('Successfully generated image!');

                const imageDataUri = `data:image/png;base64,${data.data[0].b64_json}`;
                res.json({ success: true, image: imageDataUri });

            } catch (error) {
                console.error('Generation failed:', error);
                res.status(500).json({ error: error.message || 'Failed to generate image' });
            }
            return;
        }

        // 404 for unknown routes
        res.status(404).json({ error: 'Not found' });
    }
);
