import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env, isProd } from './config/env.js';
import routes from './routes/index.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Security middlewares
app.use(helmet());

// CORS configuration
app.use(
    cors({
        origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
        credentials: true,
    })
);

// Logging
app.use(morgan(isProd ? 'combined' : 'dev'));

// Body parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
