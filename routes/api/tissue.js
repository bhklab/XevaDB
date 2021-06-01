/* eslint-disable func-names */
const knex = require('../../db/knex1');
const { getAllowedDatasetIds } = require('./util');
const { getModelInformationDataQuery } = require('./model_information');


/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - list of the tissues.
 */
const getTissues = (request, response) => {
    knex.select()
        .from('tissues')
        .then((tissues) => response.status(200).json({
            status: 'success',
            data: tissues,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from tissue table, getTissues',
            data: error,
        }));
};


/**
 * @param {Object} request - request object.
 * @param {string} request.params.tissue - tissue id.
 * @param {Object} response - response object with authorization header.
 * @param {string} response.locals.user - whether the user is verified or not ('unknown').
 * @returns {Object} - model information data based on the tissue id.
 */
const getTissueDetailedInformationBasedOnTissueId = (request, response) => {
    // user variable.
    const { user } = response.locals;
    // model param.
    const tissueParam = request.params.tissue;

    // query to grab the data based on the tissue id.
    getModelInformationDataQuery()
        .where('t.tissue_id', tissueParam)
        .andWhereBetween('d.dataset_id', getAllowedDatasetIds(user))
        .then((data) => response.status(200).json({
            status: 'success',
            data,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from model information table, getTissueDetailedInformationBasedOnTissueId',
            data: error,
        }));
};


module.exports = {
    getTissues,
    getTissueDetailedInformationBasedOnTissueId,
};
