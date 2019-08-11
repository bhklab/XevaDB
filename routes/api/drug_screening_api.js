const knex = require('../../db/knex1');


const getDrugScreening = function(req,res) {
    let drug = req.query.drug;
    let patient = req.query.patient;
    knex.select()
        .from('drug_screening')
        .where(function() {
            this.where('drug', drug)
                .orWhere('drug', 'untreated')
        })
        .andWhere({ patient_id: patient})
        .then((treatment) => {
            res.send(treatment);
        })
        .catch(error => res.status(500).json({
            status: 'an error has occured',
            data: error
        }))
}


const getUntreated = function (req,res) {
    let patient = req.query.patient;
    
    knex.select()
        .from('drug_screening')
        .where({
            patient_id: patient,
            drug: 'untreated'
        })
        .then((untreated) => {
            res.send(untreated);
        })
        .catch(error => res.status(500).json({
            status: 'an error has occured',
            data: error
        }))
}

// This will give a list of the patients those are 
// not availabe in the drug_Screening table ie they don't have drug screening data.
const getNotDrugAvailable = function(req,res) {
    knex('model_information')
        .distinct('model_information.patient_id')
        .leftJoin(
            knex('drug_screening')
            .distinct('patient_id').as('drug_screening')
            , 'model_information.patient_id'
            , 'drug_screening.patient_id'
        )
        .where('drug_screening.patient_id', null)
        .then((patient) => {
            res.send(patient)
        })
        .catch(error => res.status(500).json({
            status: 'an error has occured',
            data: error
        }))
}


// This will give a list of the patients those are 
// not availabe in the mutation table ie they only have drug screening data.
const getOnlyDrugData = function(req,res) {
    knex('drug_screening')
        .distinct('drug_screening.patient_id')
        .leftJoin(
            knex('mutation')
            .distinct('patient_id').as('mutation')
            , 'drug_screening.patient_id'
            , 'mutation.patient_id'
        )
        .where('mutation.patient_id', null)
        .then((patients) => {
            res.send(patients)
        })
        .catch(error => res.status(500).json({
            status: 'an error has occured',
            data: error
        }))
}


// This will give a list of the patients those are 
// not availabe in the mutation table ie they only have drug screening data.
const getInBoth = function(req,res) {
    knex('drug_screening')
        .distinct('drug_screening.patient_id')
        .leftJoin(
            knex('mutation')
            .distinct('patient_id').as('mutation')
            , 'drug_screening.patient_id'
            , 'mutation.patient_id'
        )
        .whereNotNull('mutation.patient_id')
        .then((patients) => {
            res.send(patients)
        })
        .catch(error => res.status(500).json({
            status: 'an error has occured',
            data: error
        }))
}



module.exports = {
    getDrugScreening,
    getUntreated,
    getNotDrugAvailable,
    getOnlyDrugData,
    getInBoth
}