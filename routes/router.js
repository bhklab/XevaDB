const express = require('express');

const router = express.Router();

// setting the path of the drugscreening api to variable so that we can use it later.
// const awtauthentication = require('./api/auth');
const batchResponse = require('./api/batch_response');
const batches = require('./api/batch');
const biomarker = require('./api/biomarker');
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

// Authorization APIs.
// router.post('/v1/login', awtauthentication.createLogin);
// router.post('/v1/register', awtauthentication.registerUser);

// APIs related to batch response.
router.get('/v1/batchresponse/stats', batchResponse.getBatchResponseStatsBasedOnDrugAndPatient);

// APIs related to batches table.
router.get('/v1/batches', batches.getAllBatches);

// API related to gene_drug_tissue table.
router.get('/v1/biomarkers', biomarker.getBiomarkers);

// APIs related to copy_number_variation table.
router.get('/v1/cnv', copyNumberVariation.getCopyNumberVariationBasedOnDatasetAndGenes);
router.get('/v1/cnv/:dataset', utils.isValidDatasetId, copyNumberVariation.getCopyNumberVariationDataBasedOnDataset);

// counter APIs.
router.get('/v1/counter', counter.getCounter);

// APIs related to dataset table.
router.get('/v1/datasets', datasets.getAllDatasets);
router.get('/v1/datasets/detail', datasets.getAllDatasetsDetailedInformation);
router.get('/v1/datasets/detail/:dataset', utils.isValidDatasetId, datasets.getSingleDatasetDetailedInformationBasedOnDatasetId);
// TODO: maybe not use this end point and use end point to get the data related to a single dataset.
// TODO: rename the endpoint? or use /v1/datasets/detail/:dataset by adding drugs to that API.
router.post('/v1/drugspatients/dataset', datasets.postDrugsandPatientsBasedOnDataset);
router.get('/v1/datasets/stats', datasets.getAllDatasetStatistics);

// APIs related to drugs table.
router.get('/v1/drugs', drugs.getAllDrugs);
router.get('/v1/drugs/:drug', utils.isValidDrugId, drugs.getSingleDrugInformation);

// APIs related to drug table.
router.get('/v1/genes', genes.getAllGenes);

// APIs related to models table.
router.get('/v1/models', models.getAllModels);
router.get('/v1/models/detail', models.getModelsDetailedInformation);
router.get('/v1/models/count/groupbytissue', models.getModelCountByTissueType);
router.get('/v1/models/count/groupbydrugclass', models.getModelCountByDrugClass);

// APIs for the model information table.
router.get('/v1/modelinformation', modelInformation.getAllModelInformation);
router.get('/v1/modelinformation/:model', utils.isValidModelId, modelInformation.getSingleModelInformationBasedOnModelId);

// APIs for model response table.
router.get('/v1/modelresponse', modelResponse.getModelResponse);
router.get('/v1/modelresponse/stats', modelResponse.getModelResponseStatsBasedOnDrugAndPatient);
// TODO: this API end point can be eliminated
// TODO: and also the 'getModelResponsePerDataset' function can be removed
// TODO: instead we can use '/v1/modelresponse' endpoint
// TODO: and pass 'dataset' as the query parameter with either name or id
router.get('/v1/modelresponse/:dataset', utils.isValidDatasetId, modelResponse.getModelResponsePerDataset);

// APIs related to mutation table.
router.get('/v1/mutation', mutation.getMutationDataBasedOnDatasetAndGenes);
router.get('/v1/mutation/:dataset', utils.isValidDatasetId, mutation.getMutationDataBasedOnDataset);

// APIs related to patients table.
router.get('/v1/patients', patients.getAllPatients);
router.get('/v1/patients/detail', patients.getAllPatientsDetailedInformation);
router.get('/v1/patients/detail/:patient', utils.isValidPatientId, patients.getSinglePatientInformationBasedOnPatientId);

// APIs related to rnasequencing table.
router.get('/v1/rnaseq', rnasequencing.getRnaSeqBasedOnDatasetAndGenes);
router.get('/v1/rnaseq/:dataset', utils.isValidDatasetId, rnasequencing.getRnaSeqDataBasedOnDataset);

// APIs related to tissues table.
router.get('/v1/tissues', tissues.getAllTissues);
router.get('/v1/tissues/details/:tissue', utils.isValidTissueId, tissues.getSingleTissueDetailedInformationBasedOnTissueId);

// APIs related to drug screening table.
router.get('/v1/treatment', drugScreening.getDrugScreeningDataBasedOnDrugAndPatient);

module.exports = router;
