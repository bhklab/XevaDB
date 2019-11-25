const knex = require('../../db/knex1');

// get the stats like AUC, Slope etc
// based on drug and patient (model_id).
const getBatchResponseStats = function (request, response) {
    // grabbing the drug parameters and dataset parameters.
    let paramDrug = request.query.drug;
    const paramPatient = request.query.patient;

    // this will remove the spaces in the drug name and replace
    // it with ' + ' ,example BKM120   LDE225 => BKM120 + LDE225
    paramDrug = paramDrug.replace(/\s\s\s/g, ' + ');

    // grabs the batch id based on the patient id and drug param passed.
    const batchId = knex.select('batch_id')
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

    batchId.then(() => {
        knex.select()
            .from('batch_response')
            .leftJoin(
                'batches',
                'batch_response.batch_id',
                'batches.batch_id',
            )
            .andWhere('batch_response.batch_id', batchId)
            .then((data) => {
                response.send(data);
            })
            .catch((error) => response.status(500).json({
                status: 'an error has occured in stats route at getModelResponseStats',
                data: error,
            }));
    });
};


module.exports = {
    getBatchResponseStats,
};
