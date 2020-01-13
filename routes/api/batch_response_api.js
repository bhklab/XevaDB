const knex = require('../../db/knex1');

// get the stats like AUC, Slope etc
// based on drug and patient (model_id).
const getBatchResponseStats = function (request, response) {
    // grabbing the drug parameters and dataset parameters.
    let paramDrug = request.query.drug;
    const paramPatient = request.query.patient;

    // this will remove the spaces in the drug name and replace
    // it with ' + ' ,example BKM120   LDE225 => BKM120 + LDE225
    paramDrug = paramDrug.replace(/\s\s\s/g, ' + ').replace(/\s\s/g, ' + ');

    // grabs the batch id based on the patient id and drug param passed.
    const batchId = knex.select('batch_id', 'model_information.dataset_id')
        .from('model_information')
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
        .where('patients.patient', paramPatient)
        .andWhere('drugs.drug_name', paramDrug);

    batchId.then((batch) => {
        // grab the dataset id.
        const dataset = JSON.parse(JSON.stringify(batch))[0].dataset_id;
        // check if it verified and the dataset id is greater than 0
        // or if it's not verified (unkown) then the dataset id should be less than 7.
        if ((response.locals.user === 'unknown' && dataset < 7 && dataset > 0)
                 || (response.locals.user.verified === 'verified' && dataset > 0 && ((response.locals.user.exp - response.locals.user.iat) === 3600))
        ) {
            knex.select()
                .from('batch_response')
                .leftJoin(
                    'batches',
                    'batch_response.batch_id',
                    'batches.batch_id',
                )
                .andWhere('batch_response.batch_id', JSON.parse(JSON.stringify(batch))[0].batch_id)
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
    getBatchResponseStats,
};
