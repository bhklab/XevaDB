const express = require('express');

const router = express.Router();

// setting the path of the drugscreening api to variable so that we can use it later.
const datasets = require('./api/dataset_api');
const drugs = require('./api/drug_api');
const tissues = require('./api/tissue_api');
const genes = require('./api/gene_api');
const patients = require('./api/patient_api');
const models = require('./api/model_api');
const batches = require('./api/batch_api');
const mixed = require('./api/mixed_api');
const modelInformation = require('./api/model_information_api');
const modelResponse = require('./api/model_response_api');
const mutation = require('./api/mutation_api');
const drugScreening = require('./api/drug_screening');
const rnasequencing = require('./api/rnaseq_api');
const copyNumberVariation = require('./api/copy_number_variation_api');
const awtauthentication = require('./api/auth_api');
const batchResponse = require('./api/batch_response_api');
const verifytoken = require('./api/verify_token_api');


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
router.get('/v1/patients', patients.getPatients);

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
router.get('/v1/stats', verifytoken, modelResponse.getModelResponseStats);

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
router.get('/v1/batchstat', verifytoken, batchResponse.getBatchResponseStats);


module.exports = router;
