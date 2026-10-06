/* eslint-disable func-names */
const knex = require('../../db/knex1');
const { canAccessDataset } = require('./util');
const { batchIdQuery } = require('./batch');
const { resolveDrugName } = require('./helper');

// ************************** Mutation Queries ************************************************
const drugScreeningQuery = () => knex
    .select(
        'drug_screening.time', 'drug_screening.volume', 'drug_screening.volume_normal',
        'drugs.drug_name as drug', 'patients.patient as patient_id',
        'batch_information.type', 'batches.batch', 'models.model as model_id',
    )
    .from('drug_screening')
    .rightJoin(
        'model_information',
        'drug_screening.model_id',
        'model_information.model_id',
    )
    .rightJoin(
        'models',
        'model_information.model_id',
        'models.model_id',
    )
    .rightJoin(
        'drugs',
        'model_information.drug_id',
        'drugs.drug_id',
    )
    .rightJoin(
        'patients',
        'model_information.patient_id',
        'patients.patient_id',
    )
    .rightJoin(
        'batch_information',
        'drug_screening.model_id',
        'batch_information.model_id',
    )
    .rightJoin(
        'batches',
        'batches.batch_id',
        'batch_information.batch_id',
    );

// ******************************* API Endpoints Functions ***********************************
/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @param {string} request.query.drug - drug query parameter.
 * @param {string} request.query.patient - patient query parameter.
 * @returns {Object} - list of the datasets.
 */
// this will get the drug screening data based on drug and patient id.
const getDrugScreeningDataBasedOnDrugAndPatient = async (request, response) => {
    const { patient } = request.query;
    const drug = await resolveDrugName(request.query.drug);

    // grabs the batch_id based on the drug and patient query param passed on.
    const grabBatchId = batchIdQuery()
        .where('drugs.drug_name', drug)
        .andWhere('patients.patient', patient);
    // .andWhere('batch_information.type', 'treatment')

    grabBatchId.then(async (batch) => {
        if (!batch || batch.length === 0) {
            return response.status(404).json({ status: 'no batch found', data: [] });
        }

        // grab the dataset id.
        const dataset = JSON.parse(JSON.stringify(batch))[0].dataset_id;

        // allows only if the dataset is public or the user is logged in.
        if (await canAccessDataset(response, dataset)) {
            drugScreeningQuery()
                .where(function () {
                    this.where('drugs.drug_name', drug)
                        .orWhereIn('drugs.drug_name', ['water', 'untreated', 'control', 'H2O']);
                })
                .andWhere('patients.patient', patient)
                .andWhere(function () {
                    this
                        .where('drug_screening.time', 0)
                        .orWhere('drug_screening.time', '>', 0);
                })
                .andWhere('batches.batch_id', JSON.parse(JSON.stringify(batch))[0].batch_id)
                .then((data) => {
                    response.send(data);
                })
                .catch((error) => response.status(500).json({
                    status: 'an error has occurred',
                    data: error,
                }));
        }
    });
};

module.exports = {
    getDrugScreeningDataBasedOnDrugAndPatient,
};
