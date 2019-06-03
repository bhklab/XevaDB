const express = require('express');
const knex = require('../../db/knex1');

const isValidId = function (req, res, next) {
    console.log(req.param.id)
    console.log(req.query.page)
    if(!isNaN(req.params.id)) return next();
    next(new Error('Invalid Id'));
}

const getMutationId = function(req,res) {
    res.json({
        message: "Hello!"
    })
}

const getMutation = function(req,res) {
    console.log(req.query.page)
    var tissue_name = req.query.tissue;
    console.log(tissue_name);
    knex.select('gene_id', 'patient_id', 'mutation').from('sequencing_data').where((builder) =>
        builder.whereIn('patient_id',(knex.select('patient_id').from('model_information').where('tissue', "Breast Cancer")))
    ).limit(840)
    .then(function(sequencing_data) {
        let data = [];
        let value = 0;
        let patient = ""
        let gene = "";
        usersRows = JSON.parse(JSON.stringify(sequencing_data));
        usersRows.forEach(element => {
            if(patient === "" || element.patient_id === patient || element.gene_id !== gene) {
                patient = element.patient_id;
                gene = element.gene_id;
                data[value] = {};
                data[value]["gene_id"] = element.gene_id;
                data[value][element.patient_id] = element.mutation;
                value += 1;
            } else {
                data[value-1][element.patient_id] = element.mutation;
            }
        });
        res.send(data);
    })
}

module.exports = {
    getMutationId,
    getMutation,
    isValidId
}