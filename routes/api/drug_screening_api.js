const express = require('express');
const knex = require('../../db/knex1');


const getDrug = function(req,res) {
    knex.distinct('drug').select().from('drug_screening')
        .then((drug_screening) => res.status(200).json({
            status: 'success',
            data: drug_screening,
          }))
          .catch(error => res.status(500).json({
            status: 'an error has occured',
            data: error,
          }));      
}

module.exports = {
    getDrug
}