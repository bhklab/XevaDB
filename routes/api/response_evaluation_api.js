const express = require('express');
const knex = require('../../db/knex1');


const getResponseEvaluation = function(req,res) {
    knex.select('patient_id', 'drug', 'response').from('response_evaluation').limit(946)
        .then(function(response_evaluation) {
            let data = [];
            let value = 0;
            let patient = "";
            let drug_id = "";
            usersRows = JSON.parse(JSON.stringify(response_evaluation));
                usersRows.forEach(element => {
                    if(patient === "" || element.patient_id === patient || element.drug !== drug_id) {
                        patient = element.patient_id;
                        drug_id = element.drug;
                        data[value] = {};
                        data[value]["Drug"] = element.drug;
                        data[value][element.patient_id] = element.response;
                        value += 1;
                    } else {
                        data[value-1][element.patient_id] = element.response
                    }
                });
            res.send(data);
        })
        .catch(error => res.status(500).json({
            status: 'an error has occured',
            data: error,
        }));  
}

module.exports = {
    getResponseEvaluation
}