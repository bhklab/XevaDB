const knex = require('../../db/knex1');

/**
 * @param {Object|string} user - response.locals.user, set by verify_token.js.
 * @returns {boolean} - true if the user sent a token with a valid signature, else false.
 */
const isLoggedIn = (user) => user !== 'unknown' && user.verified === 'verified';

/**
 * @param {Object} response - response object with the user set by verify_token.js.
 * @param {string} datasetId - id of the dataset being requested.
 * @returns {Promise<boolean>} - true if the dataset exists and is public,
 * or if it is private and the user is logged in.
 */
const canAccessDataset = async (response, datasetId) => {
    const dataset = await knex('datasets')
        .select('private')
        .where('dataset_id', datasetId)
        .first();

    // the dataset does not exist.
    if (!dataset) {
        return false;
    }

    // public datasets are open to everyone.
    if (!dataset.private) {
        return true;
    }

    // private datasets need a valid login token.
    return isLoggedIn(response.locals.user);
};

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
 * @param {Object} response - response object.
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
 * checks the validity of the patient id parameter.
 */
const isValidPatientId = (request, response, next) => {
    const { params: { patient } } = request;

    Number(patient)
        ? next()
        : next(new Error('Invalid patient id, Please enter a valid integer patient id.'));
};

/**
 * @param {Object} request - request object.
 * @param {Object} response - reponse object.
 * @param {Object} next
 * checks the validity of the model id parameter.
 */
const isValidModelId = (request, response, next) => {
    const { params: { model } } = request;

    Number(model)
        ? next()
        : next(new Error('Invalid model id, Please enter a valid integer model id.'));
};

/**
 * @param {Object|string} user - response.locals.user, set by verify_token.js.
 * @returns {Object} - a query for the ids of the datasets the user can see:
 * every dataset for logged-in users, only public datasets otherwise.
 * It can be passed straight into whereIn, e.g. .whereIn('dataset_id', getAllowedDatasetIds(user)).
 */
const getAllowedDatasetIds = (user) => {
    const query = knex('datasets').select('dataset_id');
    if (!isLoggedIn(user)) {
        query.where('private', false);
    }
    return query;
};

module.exports = {
    isLoggedIn,
    canAccessDataset,
    isValidId,
    isValidDatasetId,
    isValidTissueId,
    isValidDrugId,
    isValidPatientId,
    isValidModelId,
    getAllowedDatasetIds,
};
