/**
 * @param {string} datasetId
 * @param {Object} response
 * @returns {boolean}
 */
const isVerified = (response, datasetId) => (
    (response.locals.user === 'unknown' && datasetId < 7 && datasetId > 0)
    || (response.locals.user.verified === 'verified' && datasetId > 0
        && ((response.locals.user.exp - response.locals.user.iat) === 7200))
);


module.exports = {
    isVerified,
};
