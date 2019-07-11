const express = require('express');
const router = express.Router();
const knex = require('../../db/knex1');


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


const getModelInformation = function(req,res) {
    knex.select()
        .from('model_information')
        .then((model_information) => {
            res.send(model_information);
        })
}


const getNotTestedPatient = function(req,res) {
    knex.distinct('patient_id').select()
        .from('model_information')
}



module.exports = {
    getModelInformation,
    getNotTestedPatient,
    getDistinctDrugs,
    getDistinctTissues
}