const express = require('express');
const knex = require('../../db/knex1');


const getDrugScreening = function(req,res) {
    let drug = req.query.drug;
    let patient = req.query.patient;

    knex.select()
        .from('drug_screening')
        .where(() => {
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


module.exports = {
    getDrugScreening,
    getUntreated
}