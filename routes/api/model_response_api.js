const knex = require('../../db/knex1');


// this will get the evaluations based one the param id which is the dataset id.
const getModelResponseBasedOnDataset = function(req,res) {
    let param_dataset = req.params.dataset

    function distinctPatient() {
        return this.distinct('patient_id')
                    .from('model_information')
                    .where({
                        dataset_id: param_dataset
                    })
    }

    knex.select('models.model', 'drugs.drug_name', 'value')
        .from('model_response')
        .leftJoin(
            'models',
            'model_response.model_id',
            'models.model_id'
        )
        .leftJoin(
            'drugs',
            'model_response.drug_id',
            'drugs.drug_id'
        )
        .whereIn('model_response.model_id', distinctPatient)
        .then((row) => {
            console.log(row)
            let drug = ''
            let data = []
            let untreated = {Drug:'untreated'}
            let value = 0
            usersRows = JSON.parse(JSON.stringify(row));
            usersRows.forEach(element => {
                if (element.drug_name === drug) {
                    data[value-1][element.model] = element.value
                } 
                else if (element.drug_name === 'untreated') {
                    untreated[element.model] = element.value
                }
                else {
                    drug = element.drug_name
                    data.push({})
                    data[value]['drug_name'] = element.drug_name
                    data[value][element.model] = element.value
                    value += 1
                }
            })
            if(Object.entries(untreated).length === 1 && untreated.constructor === Object) {}
            else {data.unshift(untreated)}
            res.send(data)
        })
}



module.exports = {
    getModelResponseBasedOnDataset
}