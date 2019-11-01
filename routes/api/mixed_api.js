/* eslint-disable no-restricted-globals */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
const knex = require('../../db/knex1');


// this is the function for grabing the total for counter.
const getCounter = function (request, response) {
    const tissues = knex('tissues')
        .countDistinct('tissue_name as tissues');

    const drugs = knex('drugs')
        .countDistinct('drug_name as drugs');

    const patients = knex('patients')
        .countDistinct('patient as patients');

    Promise.all([tissues, drugs, patients])
        .then((data) => response.status(200).json({
            status: 'success',
            data,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find the data',
            data: error,
        }));
};


// checks the validity of the dataset id.
const isValidId = function (request, response, next) {
    if (!isNaN(request.params.dataset)) return next();
    next(new Error('Invalid Id, Please enter a valid integer Id'));
};


module.exports = {
    getCounter,
    isValidId,
};
