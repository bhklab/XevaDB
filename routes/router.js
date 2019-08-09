const express = require('express');
const router = express.Router();

// setting the path of the drugscreening api to variable so that we can use it later.
const drugScreening = require('./api/drug_screening_api');
const responseEvaluation = require('./api/response_evaluation_api');
const mutation = require('./api/sequencing_data_api');
const modelInformation = require('./api/model_information_api');
const drugTable = require('./api/drug_api');
const datasetTable = require('./api/dataset_api');


// APIs related to the drug screening table.
router.get('/v1/treatment', drugScreening.getDrugScreening);
router.get('/v1/untreated', drugScreening.getUntreated);
router.get('/v1/drugdatanotavailable', drugScreening.getNotDrugAvailable);
router.get('/v1/getonlydrug', drugScreening.getOnlyDrugData);
router.get('/v1/getinboth', drugScreening.getInBoth)


// APIs related to the response evaluation table.
router.get('/v1/respeval', responseEvaluation.getResponseEvaluation);
//router.get('/v1/respevaldrug/:id', responseEvaluation.getResponseEvaluationDrug);
router.get('/v1/respevaldrug', responseEvaluation.getResponseEvaluationDrug);
router.get('/v1/respeval/:dataset', responseEvaluation.getResponseEvaluationDataset);


// APIs related to the mutation table.
router.get('/v1/mutation/:id', mutation.isValidId, mutation.getMutationId);
router.get('/v1/mutation', mutation.getMutation);
router.get('/v1/patientnottested', mutation.getNotTestedPatient);
router.get('/v1/getonlysequencing', mutation.getOnlySequenceData);
router.get('/v1/mutationgene', mutation.getMutationGeneList);


// APIs related to models.
router.get('/v1/drugs', modelInformation.getDistinctDrugs);
router.get('/v1/tissues', modelInformation.getDistinctTissues);
router.get('/v1/patients', modelInformation.getDistinctPatients);
router.get('/v1/models', modelInformation.getTotalModels);
router.get('/v1/alldrugs', modelInformation.getTotalDrugs);
router.get('/v1/alltissues', modelInformation.getTotalTissues);
router.get('/v1/counter', modelInformation.getCounter);
router.post('/v1/drug/dataset', modelInformation.postDrugBasedOnDataset);

//APIs related to drug table.
router.get('/v1/drugtable', drugTable.getDrugTableData)
router.get('/v1/drugclass', drugTable.getDrugClassName)


//APIs related to dataset table.
router.get('/v1/dataset', datasetTable.getDatasetTableData)
router.get('/v1/datasetpatient', datasetTable.getDatasetDistinctPatient)


module.exports = router;