/* eslint-disable func-names */
const knex = require('../../db/knex1');


// this will get the drug screening data based on drug and patient id.
const getDrugScreening = function (req, res) {
    let { drug } = req.query;
    const { patient } = req.query;
    // this will remove the spaces in the drug name and replace
    // it with ' + '. example BKM120   LDE225 => BKM120 + LDE225
    drug = drug.replace(/\s\s\s/g, ' + ');

    // grabs the batch_id based on the drug and patient query param passed on.
    const grabBatchId = knex.select('batch_information.batch_id')
        .from('batch_information')
        .rightJoin(
            'model_information',
            'batch_information.model_id',
            'model_information.model_id'
        )
        .rightJoin(
            'patients',
            'model_information.patient_id',
            'patients.patient_id'
        )
        .rightJoin(
            'drugs',
            'model_information.drug_id',
            'drugs.drug_id'
        )
        .where('drugs.drug_name', drug)
        .andWhere('patients.patient', patient)
        //.andWhere('batch_information.type', 'treatment')

    grabBatchId.then((batch) => {
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
                .orWhere('drugs.drug_name', 'untreated');
        })
        .andWhere('patients.patient', patient)
        .andWhere('batches.batch_id', JSON.parse(JSON.stringify(batch))[0].batch_id)
        .then((data) => {
            res.send(data);
        })
        .catch((error) => res.status(500).json({
            status: 'an error has occured',
            data: error,
        }));
    })
};


module.exports = {
    getDrugScreening,
};
