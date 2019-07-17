const knex = require('../../db/knex1');

// this is grouping different patientids based on the different drugs.
const getDistinctDrugs = function(req,res) {
    knex.select('drug')
        .count('patient_id as total')
        .groupBy('drug')
        .from('model_information')
        .limit(4)
        .then((drug) => res.status(200).json({
            status: 'success',
            data: drug
          }))
        .catch((error) => res.status(500).json({
            status: 'could not find drug',
            data: error
        }));
}

// this is grouping different patientids based on the different tissues.
const getDistinctTissues = function(req,res) {
    knex.select('tissue')
        .count('patient_id as total')
        .groupBy('tissue')
        .from('model_information')
        .then((tissue) => res.status(200).json({
            status: 'success',
            data: tissue
          }))
        .catch((error) => res.status(500).json({
            status: 'could not find tissue',
            data: error
        }))
}

// this will give a list of all the distinct patients in the database.
const getDistinctPatients = function(req,res) {
    knex('model_information')
        .distinct('patient_id')
        .then((patient_id) => res.status(200).json({
            status: 'success',
            data: patient_id
          }))
        .catch((error) => res.status(500).json({
            status: 'could not find patients',
            data: error
        }))
}

// selecting everything from the modelinformation table.
const getModelInformation = function(req,res) {
    knex.select()
        .from('model_information')
        .then((model_information) => {
            res.send(model_information);
        })
        .catch((error) => res.status(500).json({
            status: 'could not find the data',
            data: error
        }))
}


// getting all the distinct drugs and total number.
const getTotalDrugs = function(req,res) {
    knex('model_information')
        .distinct('drug')
        .then((drug) => res.status(200).json({
            status: 'success',
            total: drug.length,
            data: drug
        }))
        .catch((error) => res.status(500).json({
            status: 'could not find drugs',
            data: error
        }))
}

// getting all the distinct tissues and total number.
const getTotalTissues = function(req,res) {
    knex('model_information')
        .distinct('tissue')
        .then((tissue) => res.status(200).json({
            status: 'success',
            total: tissue.length,
            data: tissue
        }))
        .catch((error) => res.status(500).json({
            status: 'could not find drugs',
            data: error
        }))
}

// getting all the distinct models and total number.
const getTotalModels = function(req,res) {
    knex('model_information')
        .distinct('model_id')
        .then((model) => res.status(200).json({
            status: 'success',
            total: model.length,
            data: model
        }))
        .catch((error) => res.status(500).json({
            status: 'could not find drugs',
            data: error
        }))
}

// getting all the distinct models, drugs, patients, tissues and numbers.
const getCounter = function(req,res) {
    knex('model_information')
            .countDistinct('model_id as model')
            .countDistinct('patient_id as patient')
            .countDistinct('tissue as tissue')
            .countDistinct('drug as drug')
        .then((data) => res.status(200).json({
           data: data
        }))
        .catch((error) => res.status(500).json({
            status: 'could not find the data',
            data: error
        }))
}

module.exports = {
    getModelInformation,
    getDistinctDrugs,
    getDistinctTissues,
    getDistinctPatients,
    getTotalDrugs,
    getTotalTissues,
    getTotalModels,
    getCounter
}