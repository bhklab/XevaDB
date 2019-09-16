const express = require('express')
const router = express.Router()



// setting the path of the drugscreening api to variable so that we can use it later.
const datasets = require('./api/dataset_api')
const drugs = require('./api/drug_api')
const tissues = require('./api/tissue_api')
const genes = require('./api/gene_api')
const patients = require('./api/patient_api')
const models = require('./api/model_api')
const batches = require('./api/batch_api')
const mixed = require('./api/mixed_api')
const modelInformation = require('./api/model_information_api')
const modelResponse = require('./api/model_response_api')



// APIs related to dataset table.
router.get('/v1/datasets', datasets.getDatasets)
router.get('/v1/dataset/patients', datasets.getPatientsGroupedByDataset)

// APIs related to drugs table.
router.get('/v1/drugs', drugs.getDrugs)
router.get('/v1/drug/class', drugs.getDrugGroupedByClass)

// APIs related to tissues table.
router.get('/v1/tissues', tissues.getTissues)
router.get('/v1/tissue/patients', tissues.getPatientsGroupedByTissue)

// APIs related to drug table.
router.get('/v1/genes', genes.getGenes)

// APIs related to patients table.
router.get('/v1/patients', patients.getPatients)

// APIs related to batches table.
router.get('/v1/batches', batches.getBatches)

// APIs related to models table.
router.get('/v1/models', models.getModels)

// mixed APIs.
router.get('/v1/counter', mixed.getCounter)

// APIs for the model information table.
router.post('/v1/drugpatient/dataset', modelInformation.postDrugandPatientBasedOnDataset);

// APIs for model response table.
router.get('/v1/response/:dataset', modelResponse.getModelResponseBasedOnDataset);






// // APIs related to the drug screening table.
// router.get('/v1/treatment', drugScreening.getDrugScreening);
// router.get('/v1/untreated', drugScreening.getUntreated);
// router.get('/v1/drugdatanotavailable', drugScreening.getNotDrugAvailable);
// router.get('/v1/getonlydrug', drugScreening.getOnlyDrugData);
// router.get('/v1/getinboth', drugScreening.getInBoth)


// // APIs related to the response evaluation table.
// router.get('/v1/respeval', responseEvaluation.getResponseEvaluation);
// //router.get('/v1/respevaldrug/:id', responseEvaluation.getResponseEvaluationDrug);
// router.get('/v1/respevaldrug', responseEvaluation.getResponseEvaluationDrug);
// router.get('/v1/respeval/:dataset', responseEvaluation.getResponseEvaluationDataset);


// // APIs related to the mutation table.
// router.get('/v1/mutation', mutation.getMutation);
// router.get('/v1/patientnottested', mutation.getNotTestedPatient);
// router.get('/v1/getonlysequencing', mutation.getOnlySequenceData);
// router.get('/v1/mutationgene', mutation.getMutationGeneList);
// router.get('/v1/mutation/:dataset', mutation.isValidId, mutation.getMutationDataset);


// // APIs related to models.
// router.get('/v1/alldrugs', modelInformation.getTotalDrugs);
// router.get('/v1/alltissues', modelInformation.getTotalTissues);




module.exports = router;