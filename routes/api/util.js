const { request } = require("express");

/**
 * @param {string} datasetId
 * @param {Object} response
 * @returns {boolean} - return true if verified else false.
 */
const isVerified = (response, datasetId) => (
    (response.locals.user === 'unknown' && datasetId < 7 && datasetId > 0)
    || (response.locals.user.verified === 'verified' && datasetId > 0
        && ((response.locals.user.exp - response.locals.user.iat) === 7200))
);


/**
 * @param {Object} request - request object.
 * @param {Object} response - reponse object.
 * @param {Object} next
 * checks the validity of the param id.
 */
const isValidId = (request, response, next) => {
    const { params: { id } } = request;
    Number(id)
        ? next()
        : next(new Error('Invalid Id, Please enter a valid integer id.'));
};


/**
 * @param {Object} request - request object.
 * @param {Object} response - reponse object.
 * @param {Object} next
 * checks the validity of the dataset id parameter.
 */
const isValidDatasetId = (request, response, next) => {
    const { params: { dataset } } = request;

    Number(dataset)
        ? next()
        : next(new Error('Invalid dataset id, Please enter a valid integer dataset id.'));
};


/**
 * @param {string} user
 * @returns {Array} returns an array of values based the user argument.
 */
const getAllowedDatasetIds = (user) => (user === 'unknown' ? [1, 6] : [1, 8]);


module.exports = {
    isVerified,
    isValidId,
    isValidDatasetId,
    getAllowedDatasetIds,
};
