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
const isValidId = (request, response, next) => (
    Number(request.params.dataset || request.params.patient || request.params.model)
        ? next()
        : next(new Error('Invalid Id, Please enter a valid integer id.'))
);


/**
 * @param {string} user
 * @returns {Array} returns an array of values based the user argument.
 */
const getAllowedDatasetIds = (user) => (user === 'unknown' ? [1, 6] : [1, 8]);


module.exports = {
    isVerified,
    isValidId,
    getAllowedDatasetIds,
};
