import { isProd } from '../config/env.js';

/**
 * Global Error Handler
 * @param {Error} err Error object
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export const errorHandler = (err, req, res, next) => {
    // Handle invalid JSON parsing error
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON payload',
        });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    const response = {
        success: false,
        message,
    };

    if (!isProd) {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};
