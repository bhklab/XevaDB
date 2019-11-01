/* eslint-disable func-names */
const knex = require('../../db/knex1');


// this will get the drug screening data based on drug and patient id.
const getDrugScreening = function (req, res) {
    const { drug } = req.query;
    const { patient } = req.query;

    knex.select('drug_screening.time', 'drug_screening.volume', 'drug_screening.volume_normal', 'drugs.drug_name as drug', 'patients.patient as patient_id', 'batch_information.type', 'batches.batch', 'models.model as model_id')
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
        .then((data) => {
            res.send(data);
        })
        .catch((error) => res.status(500).json({
            status: 'an error has occured',
            data: error,
        }));
};


module.exports = {
    getDrugScreening,
};
