import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import tokenRoutes from './routes/tokenRoutes';

export class Server {
    private app: Express;
    private server: any;
    
    constructor() {
        this.app = express();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    private setupMiddleware(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private setupRoutes(): void {
        // Health check endpoint
        this.app.get('/health', (req: Request, res: Response) => {
            res.status(200).json({ status: 'OK' });
        });

        // API routes
        this.app.use('/api/notifications', tokenRoutes);

        // 404 handler
        this.app.use((req: Request, res: Response) => {
            res.status(404).json({ error: 'Not Found' });
        });
    }

    private setupErrorHandling(): void {
        this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.error('Unhandled error:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    }

    public async start(port: number = 3000): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.server = this.app.listen(port, () => {
                    console.log(`Server is running on port ${port}`);
                    resolve();
                });

                // Handle server-side errors
                this.server.on('error', (error: Error) => {
                    console.error('Server error:', error);
                    reject(error);
                });

                // Setup graceful shutdown
                process.on('SIGTERM', () => this.shutdown());
                process.on('SIGINT', () => this.shutdown());

            } catch (error) {
                console.error('Failed to start server:', error);
                reject(error);
            }
        });
    }

    private async shutdown(): Promise<void> {
        console.log('Shutting down server...');
        
        if (this.server) {
            await new Promise<void>((resolve) => {
                this.server.close(() => {
                    console.log('Server closed');
                    resolve();
                });
            });
        }
        
        process.exit(0);
    }
}
