const knex = require('../../db/knex1');

// get all the data from drug table.
const getDatasetTableData = function(req,res) {
    knex.select()
        .from('datasets')
        .then((dataset) => res.status(200).json({
            status: 'success',
            data: dataset
        }))
        .catch((error) => res.status(500).json({
            status: 'could not find data from dataset table, getDatasetTableData',
            data: error
        }))
}


// get all the count of distinct patient ids for a particular dataset, this uses the modelinformation table.
const getDatasetDistinctPatient = function(req,res) {
    knex.countDistinct('model_information.patient_id as patient_id')
        .select('dataset_name')
        .from('model_information')
        .leftJoin(
            'datasets',
            'model_information.dataset',
            'datasets.dataset_id'
        )
        .groupBy('dataset')
        .then((dataset) => res.status(200).json({
            status: 'success',
            data: dataset
        }))
        .catch((error) => res.status(500).json({
            status: 'could not find data from dataset table, getDatasetTableData',
            data: error
        }))
}


module.exports = {
    getDatasetTableData,
    getDatasetDistinctPatient
}