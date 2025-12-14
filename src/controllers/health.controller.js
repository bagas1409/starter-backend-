import { ok } from '../utils/response.js';

/**
 * Health check controller
 * @param {Request} req
 * @param {Response} res
 */
export const checkHealth = (req, res) => {
    ok(res, {
        status: 'up',
        time: new Date().toISOString(),
    });
};
