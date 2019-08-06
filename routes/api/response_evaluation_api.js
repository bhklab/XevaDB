const knex = require('../../db/knex1');


const getResponseEvaluation = function(req,res) {
    knex.select('patient_id', 'drug', 'response')
        .from('response_evaluation')
        .limit(946)
        .then((response_evaluation) => {
            let data = [];
            let value = 0;
            let patient = '';
            let drug_id = '';
            usersRows = JSON.parse(JSON.stringify(response_evaluation));
                usersRows.forEach(element => {
                    if(patient === '' || element.patient_id === patient || element.drug !== drug_id) {
                        patient = element.patient_id;
                        drug_id = element.drug;
                        data[value] = {};
                        data[value]['Drug'] = element.drug;
                        data[value][element.patient_id] = element.response;
                        value += 1;
                    } else {
                        data[value-1][element.patient_id] = element.response
                    }
                });
            // pushing the last element of the array to the first position.
            data.unshift(data.pop())
            res.send(data);
        })
        .catch(error => res.status(500).json({
            status: 'an error has occured',
            data: error,
        }));  
}



// this will get the result based on a single drug id, the parameter passed here is like 'BGJ398'
const getResponseEvaluationSingleDrug = function(req,res) {
    let drug = req.params.id
        knex.select('patient_id', 'drug', 'response')
            .from('response_evaluation')
            .limit(43)
            .where('drug', drug)
            .then((row) => {
                let data = {};
                let patient = '';
                data['Drug'] = drug
                usersRows = JSON.parse(JSON.stringify(row));
                usersRows.forEach( element => {
                    data[element.patient_id] = element.response;
                })
                res.send(data)
            })
}



// this will get the evaluations based one the query parameter.
const getResponseEvaluationDrug = function(req,res) {
        let param = req.query.drug
        //console.log(param)
        let drug = param.split(',')
        drug = drug.map(value => {
            return value.replace('_', ' + ')
        })
        //console.log(drug)
        knex.select('patient_id', 'drug', 'response')
            .from('response_evaluation')
            .limit(43)
            .whereIn('drug', drug)
            .then((row) => {
                let drug = ''
                let data = []
                let value = 0
                usersRows = JSON.parse(JSON.stringify(row));
                usersRows.forEach(element => {
                    if (element.drug === drug) {
                        data[value-1][element.patient_id] = element.response
                    } else {
                        drug = element.drug
                        data.push({})
                        data[value]['Drug'] = element.drug
                        data[value][element.patient_id] = element.response
                        value += 1
                    }
                })
                //console.log(data)
                res.send(data)
            })
}



module.exports = {
    getResponseEvaluation,
    getResponseEvaluationDrug
}