const express = require('express');

const router = express.Router();

// setting the path of the drugscreening api to variable so that we can use it later.
const datasets = require('./api/dataset');
const drugs = require('./api/drug');
const tissues = require('./api/tissue');
const genes = require('./api/gene');
const patients = require('./api/patient');
const models = require('./api/model');
const batches = require('./api/batch');
const mixed = require('./api/mixed');
const modelInformation = require('./api/model_information');
const modelResponse = require('./api/model_response');
const mutation = require('./api/mutation');
const drugScreening = require('./api/drug_screening');
const rnasequencing = require('./api/rnaseq');
const copyNumberVariation = require('./api/copy_number_variation');
const awtauthentication = require('./api/auth');
const batchResponse = require('./api/batch_response');
const verifytoken = require('./api/verify_token');


// APIs related to dataset table.
router.get('/v1/datasets', verifytoken, datasets.getDatasets);
router.get('/v1/dataset/patients', datasets.getPatientsGroupedByDataset);
router.get('/v1/dataset/models', verifytoken, datasets.getModelsPatientsGroupedByDataset);

// APIs related to drugs table.
router.get('/v1/drugs', verifytoken, drugs.getDrugs);
router.get('/v1/drug/class', verifytoken, drugs.getDrugGroupedByClass);
// router.get('/v1/drug/class', drugs.getDrugGroupedByClass);

// APIs related to tissues table.
router.get('/v1/tissues', tissues.getTissues);
router.get('/v1/tissue/models', verifytoken, tissues.getModelsGroupedByTissue);

// APIs related to drug table.
router.get('/v1/genes', genes.getGenes);

// APIs related to patients table.
router.get('/v1/patients', verifytoken, patients.getPatients);

// APIs related to batches table.
router.get('/v1/batches', batches.getBatches);

// APIs related to models table.
router.get('/v1/models', models.getModels);

// mixed APIs.
router.get('/v1/counter', verifytoken, mixed.getCounter);

// APIs for the model information table.
router.post('/v1/drugpatient/dataset', verifytoken, modelInformation.postDrugandPatientBasedOnDataset);

// APIs for model response table.
router.get('/v1/response/:dataset', verifytoken, modelResponse.getModelResponseBasedOnDataset);
router.get('/v1/response', verifytoken, modelResponse.getModelResponseBasedPerDatasetBasedOnDrugs);
router.get('/v1/modelstats', verifytoken, modelResponse.getModelResponseStats);

// APIs related to mutation table.
router.get('/v1/mutation/:dataset', mixed.isValidId, verifytoken, mutation.getMutationBasedOnDataset);
router.get('/v1/mutation', verifytoken, mutation.getMutationBasedPerDatasetBasedOnGenes);

// APIs related to rnasequencing table.
router.get('/v1/rnaseq/:dataset', mixed.isValidId, verifytoken, rnasequencing.getRnaSeqBasedOnDataset);
router.get('/v1/rnaseq', verifytoken, rnasequencing.getRnaSeqBasedPerDatasetBasedOnGenes);

// APIs related to copy_number_variation table.
router.get('/v1/cnv/:dataset', mixed.isValidId, verifytoken, copyNumberVariation.getCopyNumberVariationBasedOnDataset);
router.get('/v1/cnv', verifytoken, copyNumberVariation.getCopyNumberVariationBasedPerDatasetBasedOnGenes);

// APIs related to drug screening table.
router.get('/v1/treatment', verifytoken, drugScreening.getDrugScreening);

// Authorization APIs.
router.post('/v1/login', awtauthentication.createLogin);
router.post('/v1/register', awtauthentication.registerUser);


// APIs related to batch response.
router.get('/v1/batchstats', verifytoken, batchResponse.getBatchResponseStats);


module.exports = router;
