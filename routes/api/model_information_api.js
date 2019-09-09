const knex = require('../../db/knex1');


// getting a list of all the distinct drugs and patient_id based on the dataset.
const postDrugandPatientBasedOnDataset = function(req,res) {
    dataset = req.body.label

    function distinctDrug() {
        return this.distinct('drug_id')
                    .from('model_information')
                    .where({
                        dataset_id: dataset
                    })
                    .as('model_information')
    }

    function distinctPatient() {
        return this.distinct('patient_id')
                    .from('model_information')
                    .where({
                        dataset_id: dataset
                    })
                    .as('model_information')
    }

    let drugs = knex.select('drugs.drug_name as drug')
                    .from(distinctDrug)
                    .leftJoin(
                        'drugs',
                        'model_information.drug_id',
                        'drugs.drug_id'
                    )

    let patients = knex.select('patients.patient as patient')
                        .from(distinctPatient)
                        .leftJoin(
                            'patients',
                            'model_information.patient_id',
                            'patients.patient_id'
                        )


    Promise.all([drugs, patients])
            .then((data) => res.status(200).json({
                status: 'success',
                data: data
            }))
}



module.exports = {
    postDrugandPatientBasedOnDataset
}