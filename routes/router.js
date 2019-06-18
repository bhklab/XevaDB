const express = require('express');
const router = express.Router();

// setting the path of the drugscreening api to variable so that we can use it later.
const drugScreening = require('./api/drug_screening_api');
const responseEvaluation = require('./api/response_evaluation_api');
const mutation = require('./api/sequencing_data_api');


// APIs related to the drug screening table.
router.get('/v1/drug', drugScreening.getDrug);
router.get('/v1/treatment', drugScreening.getDrugScreening);
router.get('/v1/untreated', drugScreening.getUntreated);

// APIs related to the response evaluation table.
router.get('/v1/respeval', responseEvaluation.getResponseEvaluation);

// APIs related to the mutation table.
router.get('/v1/mutation/:id', mutation.isValidId, mutation.getMutationId);
router.get('/v1/mutation', mutation.getMutation);

module.exports = router;