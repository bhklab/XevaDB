const express = require('express');
const router = express.Router();
const knex = require('../../db/knex1');


router.get('/', function(req,res) {
    knex.select().from('model_information')
        .then(function(model_information) {
            res.send(model_information);
        })
})

module.exports = router;