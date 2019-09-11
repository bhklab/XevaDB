const knex = require('../../db/knex1');


// this is the function for grabing the total for counter.
const getCounter = function(request, response) {
    let tissues = knex('tissues')
                    .countDistinct('tissue_name as tissues')

    let drugs = knex('drugs')
                    .countDistinct('drug_name as drugs')

    let patients = knex('patients')
                    .countDistinct('patient as patients')

    Promise.all([tissues, drugs, patients])
            .then((data) => response.status(200).json({
                status: 'success',
                data: data
            }))
            .catch((error) => response.status(500).json({
                status: 'could not find the data',
                data: error
            }))
}




module.exports = {
    getCounter
}