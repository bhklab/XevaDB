const knex = require('../../db/knex1');


// This will get the mutation for the selected dataset id.
const getMutationBasedOnDataset = function(request, response) {
        let param_dataset = request.params.dataset

        // get the distinct patients or total patients from model information table.
        // as some patient ids are missing from oncoprint because data is not available for that patient/model.
        let modelInformationDistinctPatient = knex('model_information')
                                                    .distinct('patients.patient')
                                                    .from('model_information')
                                                    .leftJoin(
                                                        'patients',
                                                        'model_information.patient_id',
                                                        'patients.patient_id'
                                                    )
                                                    .where({
                                                        dataset_id: param_dataset
                                                    })

        // to get the number of distinct patient ids.
        const distinctPatient = knex.distinct('modelid_moleculardata_mapping.sequencing_uid')
                                    .from('model_information')
                                    .leftJoin(
                                        'modelid_moleculardata_mapping'
                                        ,'model_information.model_id'
                                        ,'modelid_moleculardata_mapping.model_id'
                                    )
                                .where('model_information.dataset_id', param_dataset)
                                .andWhere('modelid_moleculardata_mapping.mDataType', 'mutation')                  

        // mutation data.
        Promise.all([modelInformationDistinctPatient, distinctPatient])                   
                    .then((total) => {
                        let patientRows = JSON.parse(JSON.stringify(total[0]))
                        let data = []
                        // grabbing the mutation data based on patients and limiting genes to 1-30.
                        knex.select('genes.gene_name', 'sequencing.sequencing_id', 'mutation.value')
                            .from('mutation')
                            .rightJoin(
                                'genes',
                                'mutation.gene_id',
                                'genes.gene_id'
                            )
                            .leftJoin(
                                'sequencing',
                                'mutation.sequencing_uid',
                                'sequencing.sequencing_uid'
                            )
                            .whereIn('mutation.sequencing_uid', distinctPatient)
                            .andWhereBetween('mutation.gene_id', [1,30])
                            .then((mutation_data) => {
                                let gene_id = ''
                                let i = 0
                                usersRows = JSON.parse(JSON.stringify(mutation_data));
                                usersRows.map((element) => {
                                    if(element.gene_name !== gene_id) {
                                        gene_id = element.gene_name;
                                        data[i] = {}
                                        data[i]['gene_id'] = element.gene_name
                                        data[i][element.sequencing_id] = element.value
                                        i++
                                    } else {
                                        data[i-1][element.sequencing_id] = element.value
                                    }
                                })

                                //array of all the patients belonging to a particular dataset.
                                patient = patientRows.map(element => {
                                    return element.patient
                                })
                                data.push(patient)

                                //sending the response.
                                response.send(data)
                            })
                    })
                    .catch((error) => response.status(500).json({
                        status: 'could not find data from mutation table, getMutationBasedOnDataset',
                        data: error
                    }))
}



// this will get the mutation based on
// dataset and drug query parameters.
const getMutationBasedPerDatasetBasedOnDrugs = function(request, response) {
    let param_gene = request.query.genes
    let param_dataset = request.query.dataset
    let genes = param_gene.split(',')
    
     // to get the number of distinct patient ids.
     const distinctPatient = knex.distinct('modelid_moleculardata_mapping.sequencing_uid')
                                .from('model_information')
                                .leftJoin(
                                    'modelid_moleculardata_mapping'
                                    ,'model_information.model_id'
                                    ,'modelid_moleculardata_mapping.model_id'
                                )
                                .where('model_information.dataset_id', param_dataset)
                                .andWhere('modelid_moleculardata_mapping.mDataType', 'mutation')    
                                                             
    // to get the gene list based on gene_id param.
    const gene_list = knex.select('gene_id')
                            .from('genes')
                            .whereIn('gene_name', genes)
                 
    // mutation data.
            gene_list                    
                    .then((gene_list) => {
                        //parsing the gene_list in order to get an array of genes.
                        let value = JSON.parse(JSON.stringify(gene_list))
                        value = value.map((value) => {
                            return value.gene_id
                        })
                        // grabbing the mutation data for the genes.
                        knex.select('genes.gene_name', 'sequencing.sequencing_id', 'mutation.value')
                            .from('mutation')
                            .rightJoin(
                                'genes',
                                'mutation.gene_id',
                                'genes.gene_id'
                            )
                            .leftJoin(
                                'sequencing',
                                'mutation.sequencing_uid',
                                'sequencing.sequencing_uid'
                            )
                        .whereIn('mutation.sequencing_uid', distinctPatient)
                        .whereIn('mutation.gene_id', value)
                        .then((mutation_data) => {
                            let gene_id = ''
                            let data = []
                            let i = 0
                            usersRows = JSON.parse(JSON.stringify(mutation_data));
                            usersRows.map((element) => {
                                if(element.gene_name !== gene_id) {
                                    gene_id = element.gene_name;
                                    data[i] = {}
                                    data[i]['gene_id'] = element.gene_name
                                    data[i][element.sequencing_id] = element.value
                                    i++
                                } else {
                                    data[i-1][element.sequencing_id] = element.value
                                }
                            })
                            response.send(data)
                        })
                    })
                    .catch((error) => response.status(500).json({
                        status: 'could not find data from mutation table, getMutationBasedPerDatasetBasedOnDrugs',
                        data: error
                    }))
}




module.exports = {
    getMutationBasedOnDataset,
    getMutationBasedPerDatasetBasedOnDrugs
}