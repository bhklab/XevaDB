/* eslint-disable no-shadow */
/* eslint-disable brace-style */
/* eslint-disable no-empty */
/* eslint-disable camelcase */
/* eslint-disable func-names */
const knex = require('../../db/knex1');


// this will get the evaluations based one the param id which is the dataset id.
const getModelResponseBasedOnDataset = function (request, response) {
    const param_dataset = request.params.dataset;

    // allows only if the dataset value is less than 6 and user is unknown or token is verified.
    if ((response.locals.user === 'unknown' && param_dataset < 7 && param_dataset > 0)
            || (response.locals.user.verified === 'verified' && param_dataset > 0 && ((response.locals.user.exp - response.locals.user.iat) === 7200))
    ) {
        const distinctPatients = knex('model_information')
            .distinct('patients.patient')
            .from('model_information')
            .leftJoin(
                'patients',
                'model_information.patient_id',
                'patients.patient_id',
            )
            .where({
                dataset_id: param_dataset,
            });

        const selectModelResponse = knex.select('patients.patient', 'drugs.drug_name', 'value', 'model_information.model_id', 'response_type')
            .from('model_response')
            .rightJoin(
                'model_information',
                'model_response.model_id',
                'model_information.model_id',
            )
            .leftJoin(
                'patients',
                'model_information.patient_id',
                'patients.patient_id',
            )
            .leftJoin(
                'drugs',
                'model_information.drug_id',
                'drugs.drug_id',
            )
            .where('model_information.dataset_id', param_dataset)
            // .whereIn('model_response.model_id', distinctPatient)
            // .andWhere('model_response.response_type', 'mRECIST')
            // .andWhere(function () {
            //     this.where('model_response.response_type', 'mRECIST');
            // // .orWhereNull('model_response.response_type')
            // })
            .orderBy('drug_name')
            .orderBy('patient');


        Promise.all([distinctPatients, selectModelResponse])
            .then((row) => {
                let drug = '';
                const data = [];
                const untreated = {};
                let value = 0;
                let patient = [];

                // this will create enteries for heatmap.
                const usersRows = JSON.parse(JSON.stringify(row[1]));
                usersRows.forEach((element) => {
                    if (element.drug_name === drug) {
                        if (!(element.patient in data[value - 1])) {
                            data[value - 1][element.patient] = {};
                        }
                        data[value - 1][element.patient][element.response_type] = element.value;
                    } else if (element.drug_name === 'untreated' || element.drug_name === 'WATER' || element.drug_name === 'Control') {
                        untreated.Drug = element.drug_name;
                        if (!(element.patient in untreated)) {
                            untreated[element.patient] = {};
                        }
                        untreated[element.patient][element.response_type] = element.value;
                    } else {
                        drug = element.drug_name;
                        data.push({});
                        data[value].Drug = element.drug_name;
                        if (!(element.patient in data[value])) {
                            data[value][element.patient] = {};
                        }
                        data[value][element.patient][element.response_type] = element.value;
                        value += 1;
                    }
                });

                if (Object.entries(untreated).length === 1 && untreated.constructor === Object) {}
                else { data.unshift(untreated); }

                // array of all the patients belonging to a particular dataset.
                const patientRows = JSON.parse(JSON.stringify(row[0]));
                patient = patientRows.map((element) => element.patient);
                data.push(patient);

                // sending the response.
                response.send(data);
            })
            .catch((error) => response.status(500).json({
                status: 'could not find data from model_response table, getModelResponseBasedOnDataset',
                data: error,
            }));
    } else {
        response.status(500).json({
            status: 'could not find data from model_response table, getModelResponseBasedOnDataset',
            data: 'Bad Request',
        });
    }
};


// this will get the model evaluations based on
// dataset and drug query parameters.
const getModelResponseBasedPerDatasetBasedOnDrugs = function (request, response) {
    // grabbing the drug parameters and dataset parameters.
    const param_drug = request.query.drug;
    const param_dataset = request.query.dataset;
    let drug = param_drug.split(',');
    drug = drug.map((value) => value.replace('_', ' + '));

    // to always include untreated/water (control)
    drug.push('untreated');

    // allows only if the dataset value is less than 6 and user is unknown or token is verified.
    if ((response.locals.user === 'unknown' && param_dataset < 7 && param_dataset > 0)
            || (response.locals.user.verified === 'verified' && param_dataset > 0 && ((response.locals.user.exp - response.locals.user.iat) === 7200))
    ) {
        const distinctPatients = knex('model_information')
            .distinct('patients.patient')
            .from('model_information')
            .leftJoin(
                'patients',
                'model_information.patient_id',
                'patients.patient_id',
            )
            .where({
                dataset_id: param_dataset,
            });

        const responseData = knex.select('patients.patient', 'drugs.drug_name', 'value', 'model_information.model_id')
            .from('model_response')
            .rightJoin(
                'model_information',
                'model_response.model_id',
                'model_information.model_id',
            )
            .leftJoin(
                'patients',
                'model_information.patient_id',
                'patients.patient_id',
            )
            .leftJoin(
                'drugs',
                'model_information.drug_id',
                'drugs.drug_id',
            )
            .where('model_information.dataset_id', param_dataset)
            .andWhere(function () {
                this.where('model_response.response_type', 'mRECIST')
                    .orWhereNull('model_response.response_type');
            })
            .whereIn('drugs.drug_name', drug)
            .orderBy('drug_name')
            .orderBy('patient');


        Promise.all([distinctPatients, responseData])
            .then((row) => {
                let drug = '';
                const data = [];
                const untreated = { Drug: 'untreated' };
                let value = 0;
                let patient = [];

                // this will create enteries for heatmap.
                const usersRows = JSON.parse(JSON.stringify(row[1]));
                usersRows.forEach((element) => {
                    if (element.drug_name === drug) {
                        data[value - 1][element.patient] = element.value;
                    } else if (element.drug_name === 'untreated' || element.drug_name === 'WATER' || element.drug_name === 'Control') {
                        untreated.Drug = element.drug_name;
                        untreated[element.patient] = element.value;
                    } else {
                        drug = element.drug_name;
                        data.push({});
                        data[value].Drug = element.drug_name;
                        data[value][element.patient] = element.value;
                        value += 1;
                    }
                });
                if (Object.entries(untreated).length === 1 && untreated.constructor === Object) {}
                else { data.unshift(untreated); }

                // array of all the patients belonging to a particular dataset.
                const patientRows = JSON.parse(JSON.stringify(row[0]));
                patient = patientRows.map((element) => element.patient);
                data.push(patient);

                // sending the response.
                response.send(data);
            })
            .catch((error) => response.status(500).json({
                status: 'could not find data from model_response table, getModelResponseBasedPerDatasetBasedOnDrugs',
                data: error,
            }));
    }
};


// get the stats like AUC, Slope etc
// based on drug and patient (model_id).
const getModelResponseStats = function (request, response) {
    // grabbing the drug parameters and dataset parameters.
    let { drug } = request.query;
    const { patient } = request.query;

    // this will remove the spaces in the drug name and replace
    // it with ' + ' ,example BKM120   LDE225 => BKM120 + LDE225
    drug = drug.replace(/\s\s\s/g, ' + ').replace(/\s\s/g, ' + ');

    // grabs the batch id based on the patient id and drug param passed.
    const grabBatchId = knex.select('batch_information.batch_id', 'model_information.dataset_id')
        .from('batch_information')
        .rightJoin(
            'model_information',
            'batch_information.model_id',
            'model_information.model_id',
        )
        .rightJoin(
            'patients',
            'model_information.patient_id',
            'patients.patient_id',
        )
        .rightJoin(
            'drugs',
            'model_information.drug_id',
            'drugs.drug_id',
        )
        .where('drugs.drug_name', drug)
        .andWhere('patients.patient', patient);

    grabBatchId.then((batch) => {
        // grab the dataset id.
        const dataset = JSON.parse(JSON.stringify(batch))[0].dataset_id;
        // check if it verified and the dataset id is greater than 0
        // or if it's not verified (unkown) then the dataset id should be less than 7.
        if ((response.locals.user === 'unknown' && dataset < 7 && dataset > 0)
                 || (response.locals.user.verified === 'verified' && dataset > 0 && ((response.locals.user.exp - response.locals.user.iat) === 7200))
        ) {
            knex.select()
                .from('model_response')
                .leftJoin(
                    'model_information',
                    'model_response.model_id',
                    'model_information.model_id',
                )
                .leftJoin(
                    'patients',
                    'model_information.patient_id',
                    'patients.patient_id',
                )
                .leftJoin(
                    'drugs',
                    'model_information.drug_id',
                    'drugs.drug_id',
                )
                .leftJoin(
                    'batch_information',
                    'batch_information.model_id',
                    'model_information.model_id',
                )
                .leftJoin(
                    'models',
                    'model_information.model_id',
                    'models.model_id',
                )
                .leftJoin(
                    'model_sheets',
                    'model_sheets.model_id',
                    'models.model',
                )
                .where('patients.patient', patient)
                .andWhere(function () {
                    this.where('drugs.drug_name', drug)
                        .orWhere('drugs.drug_name', 'water')
                        .orWhere('drugs.drug_name', 'untreated')
                        .orWhere('drugs.drug_name', 'control');
                })
                .andWhere('batch_id', JSON.parse(JSON.stringify(batch))[0].batch_id)
                .then((data) => {
                    response.send(data);
                })
                .catch((error) => response.status(500).json({
                    status: 'an error has occured in stats route at getModelResponseStats',
                    data: error,
                }));
        }
    });
};


module.exports = {
    getModelResponseBasedOnDataset,
    getModelResponseBasedPerDatasetBasedOnDrugs,
    getModelResponseStats,
};
