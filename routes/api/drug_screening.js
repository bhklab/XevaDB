/* eslint-disable func-names */
const knex = require('../../db/knex1');


// this will get the drug screening data based on drug and patient id.
const getDrugScreening = function (request, response) {
    let { drug } = request.query;
    const { patient } = request.query;

    // this will remove the spaces in the drug name and replace
    // it with ' + '. example BKM120   LDE225 => BKM120 + LDE225
    drug = drug.replace(/\s\s\s/g, ' + ').replace(/\s\s/g, ' + ');
    // grabs the batch_id based on the drug and patient query param passed on.
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
        // .andWhere('batch_information.type', 'treatment')


    grabBatchId.then((batch) => {
        // grab the dataset id.
        const dataset = JSON.parse(JSON.stringify(batch))[0].dataset_id;
        // check if it verified and the dataset id is greater than 0
        // or if it's not verified (unkown) then the dataset id should be less than 7.
        if ((response.locals.user === 'unknown' && dataset < 7 && dataset > 0)
                || (response.locals.user.verified === 'verified' && dataset > 0 && ((response.locals.user.exp - response.locals.user.iat) === 7200))
        ) {
            knex.select('drug_screening.time', 'drug_screening.volume', 'drug_screening.volume_normal',
                'drugs.drug_name as drug', 'patients.patient as patient_id',
                'batch_information.type', 'batches.batch', 'models.model as model_id')
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
                )
                .where(function () {
                    this.where('drugs.drug_name', drug)
                        .orWhere('drugs.drug_name', 'water')
                        .orWhere('drugs.drug_name', 'untreated')
                        .orWhere('drugs.drug_name', 'control');
                })
                .andWhere('patients.patient', patient)
                .andWhere(function () {
                    this.where('drug_screening.time', 0).orWhere('drug_screening.time', '>', 0);
                })
                .andWhere('batches.batch_id', JSON.parse(JSON.stringify(batch))[0].batch_id)
                .then((data) => {
                    response.send(data);
                })
                .catch((error) => response.status(500).json({
                    status: 'an error has occured',
                    data: error,
                }));
        }
    });
};


module.exports = {
    getDrugScreening,
};
