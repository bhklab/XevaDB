const knex = require('../../db/knex1');

const isValidId = function (req, res, next) {
    if(!isNaN(req.params.dataset)) return next();
    next(new Error('Invalid Id'));
}

const getMutation = function(req,res) {
    var tissue_name = req.query.tissue;
    knex.select('gene_id', 'patient_id', 'mutation')
        .from('mutation')
        .where((builder) =>
            builder.whereIn('patient_id',
                                        (knex.select('patient_id')
                                        .from('model_information')
                                        .where('tissue', 'Breast Cancer'))
                            )
        ).limit(1050)
        .then((mutation) => {
        let data = [];
        let value = 0;
        let patient = ''
        let gene = '';
        usersRows = JSON.parse(JSON.stringify(mutation));
        usersRows.forEach(element => {
            if(patient === '' || element.patient_id === patient || element.gene_id !== gene) {
                patient = element.patient_id;
                gene = element.gene_id;
                data[value] = {};
                data[value]['gene_id'] = element.gene_id;
                data[value][element.patient_id] = element.mutation;
                value += 1;
            } else {
                data[value-1][element.patient_id] = element.mutation;
            }
        });
        res.send(data);
    })
}


// This will get the list of the patient id's which are not 
// available in the mutation table ie don't have sequencing data.
const getNotTestedPatient = function(req,res) {
    knex('model_information')
        .distinct('model_information.patient_id')
        .leftJoin(
            knex('mutation')
            .distinct('patient_id').as('mutation')
            , 'model_information.patient_id'
            , 'mutation.patient_id'
        )
        .where('mutation.patient_id', null)
        .then((patient) => {
            res.send(patient)
        })
}



// This will give a list of the patients those are 
// not availabe in the drug_screening table ie they only have mutation screening data.
const getOnlySequenceData = function(req,res) {
       knex('mutation')
            .distinct('patient_id')
            .whereNotIn('patient_id', knex('drug_screening')
                            .distinct('patient_id')
                        )
            .then((patient) => {
                res.send(patient)
            })
}


// This will get the mutation for the selected genes or the genes those are passed as the query parameters.
const getMutationGeneList = function(req,res) {
        let param_gene = req.query.genes
        let param_dataset = req.query.dataset
        let genes = param_gene.split(',')

        knex.select('mutation.patient_id', 'mutation.gene_id', 'mutation.mutation')
            .from('mutation')
            .whereIn('mutation.gene_id', genes)     
            .where((builder) => {
                builder.whereIn('mutation.patient_id', (knex('model_information').distinct('patient_id')
                .where('dataset', param_dataset)
                ))
            })
            .then((mutation_data) => {
                let gene_id = ''
                let data = []
                let i = 0
                usersRows = JSON.parse(JSON.stringify(mutation_data));
                usersRows.map((element) => {
                    if(element.gene_id !== gene_id) {
                        gene_id = element.gene_id;
                        data[i] = {}
                        data[i]['gene_id'] = element.gene_id
                        data[i][element.patient_id] = element.mutation
                        i++
                    } else {
                        data[i-1][element.patient_id] = element.mutation
                    }
                })
                res.send(data)
            })
}



// This will get the mutation for the selected genes or the genes those are passed as the query parameters.
const getMutationDataset = function(req,res) {
    let param_dataset = req.params.dataset

        knex.countDistinct('mutation.patient_id as total')
            .from('mutation')
            .leftJoin(
                knex('model_information')
                .distinct('patient_id')
                .where('model_information.dataset', param_dataset)
                .as('model_information')
                , 'mutation.patient_id'
                , 'model_information.patient_id'
            )
        .whereNotNull('model_information.patient_id')
        // this is slow because of orderBy.
        //.then((total) => {
        //    value = JSON.parse(JSON.stringify(total));
        //    value = value[0].total
        //    knex.select('mutation.patient_id', 'mutation.gene_id', 'mutation.mutation')
        //        .from('mutation')
        //        .leftJoin(
        //            knex('model_information')
        //            .distinct('model_information.patient_id')
        //            .where('model_information.dataset', param_dataset)
        //            .as('model_information')
        //            , 'mutation.patient_id'
        //            , 'model_information.patient_id'
        //        )
        //        .whereNotNull('model_information.patient_id')
        //        .orderBy('mutation.gene_id')
        //        .limit(value * 25)
        //        .offset(value * 30)
        .then((total) => {
            value = JSON.parse(JSON.stringify(total));
            value = value[0].total
            knex.select('patient_id', 'gene_id', 'mutation')
            .from('mutation')
            .whereIn('mutation.patient_id', 
                    (knex('model_information')
                        .distinct('patient_id')
                        .where('dataset', param_dataset)
                    )
            )
            .limit(value*25)
            .then((mutation_data) => {
                let gene_id = ''
                let data = []
                let i = 0
                usersRows = JSON.parse(JSON.stringify(mutation_data));
                usersRows.map((element) => {
                    if(element.gene_id !== gene_id) {
                        gene_id = element.gene_id;
                        data[i] = {}
                        data[i]['gene_id'] = element.gene_id
                        data[i][element.patient_id] = element.mutation
                        i++
                    } else {
                        data[i-1][element.patient_id] = element.mutation
                    }
                })
                res.send(data)
            })
        })   
}




module.exports = {
    getMutation,
    isValidId,
    getNotTestedPatient,
    getOnlySequenceData,
    getMutationGeneList,
    getMutationDataset
}