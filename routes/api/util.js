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
// checks the validity of the dataset id.
const isValidId = (request, response, next) => (
    Number(request.params.dataset || request.params.patient)
        ? next()
        : next(new Error('Invalid Id, Please enter a valid integer id.'))
);


module.exports = {
    isVerified,
    isValidId,
};
