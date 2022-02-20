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
router.get('/v1/batchresponsestats', verifytoken, batchResponse.getBatchResponseStatsBasedOnDrugAndPatient);

// APIs related to batches table.
router.get('/v1/batches', batches.getBatches);

// APIs related to copy_number_variation table.
router.get('/v1/cnv', verifytoken, copyNumberVariation.getCopyNumberVariationBasedOnDatasetAndGenes);
router.get('/v1/cnv/:dataset', utils.isValidDatasetId, verifytoken, copyNumberVariation.getCopyNumberVariationDataBasedOnDataset);

// counter APIs.
router.get('/v1/counter', verifytoken, counter.getCounter);

// APIs related to dataset table.
router.get('/v1/datasets', verifytoken, datasets.getAllDatasets);
router.get('/v1/datasets/detail', verifytoken, datasets.getAllDatasetsDetailedInformation);
router.get('/v1/datasets/detail/:dataset', utils.isValidDatasetId, verifytoken, datasets.getSingleDatasetDetailedInformationBasedOnDatasetId);

// APIs related to drugs table.
router.get('/v1/drugs', verifytoken, drugs.getDrugs);
router.get('/v1/drugs/:id', utils.isValidId, verifytoken, drugs.getSingleDrugInformation);

// APIs related to drug table.
router.get('/v1/genes', genes.getGenes);

// APIs related to models table.
router.get('/v1/models', verifytoken, models.getAllModels);
router.get('/v1/models/details', verifytoken, models.getModelsDetailedInformation);
router.get('/v1/models/count/groupbytissue', verifytoken, models.getModelCountByTissueType);
router.get('/v1/models/groupbydrugclass', verifytoken, models.getModelsGroupedByDrugClass);

// APIs for the model information table.
router.get('/v1/modelinformation', verifytoken, modelInformation.getModelInformation);
router.get('/v1/modelinformation/:id', utils.isValidId, verifytoken, modelInformation.getModelInformationBasedOnModelId);
// TODO: maybe not use this end point and use end point to get the data related to a single dataset.
router.post('/v1/drugspatients/dataset', verifytoken, modelInformation.postDrugsandPatientsBasedOnDataset);

// APIs for model response table.
router.get('/v1/modelresponse/:id', utils.isValidId, verifytoken, modelResponse.getModelResponseBasedOnDataset);
router.get('/v1/modelresponse', verifytoken, modelResponse.getModelResponseBasedOnDatasetAndDrugList);
router.get('/v1/modelresponsestats', verifytoken, modelResponse.getModelResponseStatsBasedOnDrugAndPatient);

// APIs related to mutation table.
router.get('/v1/mutation', verifytoken, mutation.getMutationDataBasedOnDatasetAndGenes);
router.get('/v1/mutation/:dataset', utils.isValidDatasetId, verifytoken, mutation.getMutationDataBasedOnDataset);

// APIs related to patients table.
router.get('/v1/patients', verifytoken, patients.getPatients);
router.get('/v1/patients/details', verifytoken, patients.getPatientsDetailedInformation);
router.get('/v1/patients/details/:id', utils.isValidId, verifytoken, patients.getPatientDetailedInformationBasedOnPatientId);

// APIs related to rnasequencing table.
router.get('/v1/rnaseq', verifytoken, rnasequencing.getRnaSeqBasedOnDatasetAndGenes);
router.get('/v1/rnaseq/:dataset', utils.isValidDatasetId, verifytoken, rnasequencing.getRnaSeqDataBasedOnDataset);

// APIs related to tissues table.
router.get('/v1/tissues', tissues.getAllTissues);
router.get('/v1/tissues/details/:tissue', utils.isValidTissueId, verifytoken, tissues.getSingleTissueDetailedInformationBasedOnTissueId);

// APIs related to drug screening table.
router.get('/v1/treatment', verifytoken, drugScreening.getDrugScreeningDataBasedOnDrugAndPatient);


module.exports = router;
