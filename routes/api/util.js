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
 * @param {Object} request - request object.
 * @param {Object} response - reponse object.
 * @param {Object} next
 * checks the validity of the tissue id parameter.
 */
const isValidTissueId = (request, response, next) => {
    const { params: { tissue } } = request;

    Number(tissue)
        ? next()
        : next(new Error('Invalid tissue id, Please enter a valid integer tissue id.'));
};


/**
 * @param {Object} request - request object.
 * @param {Object} response - reponse object.
 * @param {Object} next
 * checks the validity of the drug id parameter.
 */
const isValidDrugId = (request, response, next) => {
    const { params: { drug } } = request;

    Number(drug)
        ? next()
        : next(new Error('Invalid drug id, Please enter a valid integer drug id.'));
};


/**
 * @param {Object} request - request object.
 * @param {Object} response - reponse object.
 * @param {Object} next
 * checks the validity of the tissue id parameter.
 */
const isValidPatientId = (request, response, next) => {
    const { params: { patient } } = request;

    Number(patient)
        ? next()
        : next(new Error('Invalid patient id, Please enter a valid integer patient id.'));
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
    isValidTissueId,
    isValidDrugId,
    isValidPatientId,
    getAllowedDatasetIds,
};
