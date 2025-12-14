/**
 * Send success response (200 OK)
 * @param {Response} res Express response object
 * @param {any} data Response data
 * @param {string} message Optional message
 */
export const ok = (res, data, message = 'Success') => {
    return res.status(200).json({
        success: true,
        message,
        data,
    });
};

/**
 * Send created response (201 Created)
 * @param {Response} res Express response object
 * @param {any} data Response data
 * @param {string} message Optional message
 */
export const created = (res, data, message = 'Created') => {
    return res.status(201).json({
        success: true,
        message,
        data,
    });
};
