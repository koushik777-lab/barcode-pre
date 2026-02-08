import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import { registerRoutes } from '../server/routes';

const app = express();

// Configure CORS for Hostinger frontend
// Ideally, replace '*' with your actual Hostinger domain in production
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const httpServer = createServer(app);

// Lazy initialization to handle async route registration
let initialized = false;

export default async (req: any, res: any) => {
    if (!initialized) {
        await registerRoutes(httpServer, app);
        initialized = true;
    }
    return app(req, res);
};
