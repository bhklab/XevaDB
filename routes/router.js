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
const mutation = require('./api/mutation_api')


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
router.get('/v1/response', modelResponse.getModelResponseBasedPerDatasetBasedOnDrugs)

// APIs related to mutation table.
router.get('/v1/mutation/:dataset', mutation.isValidId, mutation.getMutationBasedOnDataset);
router.get('/v1/mutation', mutation.getMutationBasedPerDatasetBasedOnDrugs)




module.exports = router;