const knex = require('../../db/knex1');


// checks the validity of the dataset id.
const isValidId = function (request, response, next) {
    if(!isNaN(request.params.dataset)) return next();
    next(new Error('Invalid Id'));
}


// This will get the mutation for the selected dataset id.
const getMutationBasedOnDataset = function(request, response) {
        let param_dataset = request.params.dataset

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
        distinctPatient                      
                    .then((total) => {
                        let value = JSON.parse(JSON.stringify(total))
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
                            console.log(mutation_data)
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
}




module.exports = {
    isValidId,
    getMutationBasedOnDataset,
    getMutationBasedPerDatasetBasedOnDrugs
}