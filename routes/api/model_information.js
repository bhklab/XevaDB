/* eslint-disable func-names */
const knex = require('../../db/knex1');
const { isVerified } = require('./util');

// getting a list of all the distinct drugs and patient_id based on the dataset.
const postDrugandPatientBasedOnDataset = function (request, response) {
    const dataset = request.body.label;

    function distinctDrug() {
        return this.distinct('drug_id')
            .from('model_information')
            .where({
                dataset_id: dataset,
            })
            .as('model_information');
    }

    function distinctPatient() {
        return this.distinct('patient_id')
            .from('model_information')
            .where({
                dataset_id: dataset,
            })
            .as('model_information');
    }

    // allows only if the dataset value is less than 6 and user is unknown or token is verified.
    if (isVerified(response, request.body.label)) {
        const drugs = knex
            .select('drugs.drug_name as drug', 'drugs.drug_id as drug_id')
            .from(distinctDrug)
            .leftJoin(
                'drugs',
                'model_information.drug_id',
                'drugs.drug_id',
            );

        const patients = knex
            .select('patients.patient as patient', 'patients.patient_id as patient_id')
            .from(distinctPatient)
            .leftJoin(
                'patients',
                'model_information.patient_id',
                'patients.patient_id',
            );

        Promise.all([drugs, patients])
            .then((data) => response.status(200).json({
                status: 'success',
                data,
            }))
            .catch((error) => response.status(500).json({
                status: 'could not find data from model_information table, postDrugandPatientBasedOnDataset',
                data: error,
            }));
    } else {
        response.status(500).json({
            status: 'Could not find data from model_information table, postDrugandPatientBasedOnDataset',
            data: 'Bad Request',
        });
    }
};


const getModelInformation = function (request, response) {
    // if the user is not logged in the dataset id's would be between 1 to 6, else 1 to 8.
    const datasetArray = response.locals.user === 'unknown' ? [1, 6] : [1, 8];
    // query
    knex.select()
        .from('model_information as mi')
        .leftJoin('datasets as d', 'd.dataset_id', 'mi.dataset_id')
        .leftJoin('models as m', 'm.model_id', 'mi.model_id')
        .leftJoin('patients as p', 'p.patient_id', 'mi.patient_id')
        .leftJoin('drugs as dg', 'dg.drug_id', 'mi.drug_id')
        .leftJoin('tissues as t', 't.tissue_id', 'mi.tissue_id')
        .whereBetween('mi.dataset_id', datasetArray)
        .then((data) => response.status(200).json({
            status: 'success',
            data,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from model information table, getModelInformation',
            data: error,
        }));
};


module.exports = {
    postDrugandPatientBasedOnDataset,
    getModelInformation,
};
