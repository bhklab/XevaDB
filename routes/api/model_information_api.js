/* eslint-disable func-names */
const knex = require('../../db/knex1');


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

    const drugs = knex.select('drugs.drug_name as drug', 'drugs.drug_id as drug_id')
        .from(distinctDrug)
        .leftJoin(
            'drugs',
            'model_information.drug_id',
            'drugs.drug_id',
        );

    const patients = knex.select('patients.patient as patient', 'patients.patient_id as patient_id')
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
};


module.exports = {
    postDrugandPatientBasedOnDataset,
};
