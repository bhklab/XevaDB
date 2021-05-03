const express = require('express');

const router = express.Router();

// setting the path of the drugscreening api to variable so that we can use it later.
const awtauthentication = require('./api/auth');
const batchResponse = require('./api/batch_response');
const batches = require('./api/batch');
const copyNumberVariation = require('./api/copy_number_variation');
const counter = require('./api/counter');
const datasets = require('./api/dataset');
const drugs = require('./api/drug');
const drugScreening = require('./api/drug_screening');
const genes = require('./api/gene');
const models = require('./api/model');
const modelInformation = require('./api/model_information');
const modelResponse = require('./api/model_response');
const mutation = require('./api/mutation');
const patients = require('./api/patient');
const rnasequencing = require('./api/rnaseq');
const tissues = require('./api/tissue');
const utils = require('./api/util');
const verifytoken = require('./api/verify_token');

// Authorization APIs.
router.post('/v1/login', awtauthentication.createLogin);
router.post('/v1/register', awtauthentication.registerUser);

// APIs related to batch response.
router.get('/v1/batchstats', verifytoken, batchResponse.getBatchResponseStats);

// APIs related to batches table.
router.get('/v1/batches', batches.getBatches);

// APIs related to copy_number_variation table.
router.get('/v1/cnv/:dataset', utils.isValidId, verifytoken, copyNumberVariation.getCopyNumberVariationBasedOnDataset);
router.get('/v1/cnv', verifytoken, copyNumberVariation.getCopyNumberVariationBasedPerDatasetBasedOnGenes);

// counter APIs.
router.get('/v1/counter', verifytoken, counter.getCounter);

// APIs related to dataset table.
router.get('/v1/datasets', verifytoken, datasets.getDatasets);
router.get('/v1/datasets/details', verifytoken, datasets.getDatasetsDetailedInformation);

// APIs related to drugs table.
router.get('/v1/drugs', verifytoken, drugs.getDrugs);

// APIs related to drug table.
router.get('/v1/genes', genes.getGenes);

// APIs related to models table.
router.get('/v1/models', verifytoken, models.getModels);
router.get('/v1/models/details', verifytoken, models.getModelsDetailedInformation);
router.get('/v1/models/groupbytissue', verifytoken, models.getModelsGroupedByTissueType);
router.get('/v1/models/groupbydrugclass', verifytoken, models.getModelsGroupedByDrugClass);

// APIs for the model information table.
router.post('/v1/drugpatient/dataset', verifytoken, modelInformation.postDrugandPatientBasedOnDataset);
router.get('/v1/modelinformation', verifytoken, modelInformation.getModelInformation);
router.get('/v1/modelinformation/:patient', utils.isValidId, verifytoken, modelInformation.getModelInformationBasedOnPatient);

// APIs for model response table.
router.get('/v1/modelresponse/:dataset', utils.isValidId, verifytoken, modelResponse.getModelResponseBasedOnDataset);
router.get('/v1/modelresponse', verifytoken, modelResponse.getModelResponseBasedOnDatasetAndDrugList);
router.get('/v1/modelresponsestats', verifytoken, modelResponse.getModelResponseStats);

// APIs related to mutation table.
router.get('/v1/mutation/:dataset', utils.isValidId, verifytoken, mutation.getMutationBasedOnDataset);
router.get('/v1/mutation', verifytoken, mutation.getMutationBasedPerDatasetBasedOnGenes);

// APIs related to patients table.
router.get('/v1/patients', verifytoken, patients.getPatients);

// APIs related to rnasequencing table.
router.get('/v1/rnaseq/:dataset', utils.isValidId, verifytoken, rnasequencing.getRnaSeqBasedOnDataset);
router.get('/v1/rnaseq', verifytoken, rnasequencing.getRnaSeqBasedPerDatasetBasedOnGenes);

// APIs related to tissues table.
router.get('/v1/tissues', tissues.getTissues);

// APIs related to drug screening table.
router.get('/v1/treatment', verifytoken, drugScreening.getDrugScreening);


module.exports = router;
