import { Request, Response, NextFunction } from 'express';

if (!process.env.API_KEY) {
    console.error('\x1b[31m%s\x1b[0m', 'API_KEY is not provided. Please provide it in .env file.');
    throw new Error('API_KEY is not provided. Please provide it in .env file.');
}
const validApiKey = process.env.API_KEY;

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['ns-api-key'];

    if (!apiKey || apiKey !== validApiKey) {
        return res.status(401).json({ error: 'Invalid or missing API key. Add it as `ns-api-key` to your header' });
    }

    next();
};
