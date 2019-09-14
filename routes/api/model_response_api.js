const knex = require('../../db/knex1');


// this will get the evaluations based one the param id which is the dataset id.
const getModelResponseBasedOnDataset = function(req,res) {
    let param_dataset = req.params.dataset

    function distinctPatient() {
        return this.distinct('model_id')
                    .from('model_information')
                    .where({
                        dataset_id: param_dataset
                    })
    }

    let promise1 = knex('model_information')
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

    let promise2 = knex.select('patients.patient', 'drugs.drug_name', 'value')
        .from('model_response')
        .leftJoin(
            'drugs',
            'model_response.drug_id',
            'drugs.drug_id'
        )
        .leftJoin(
            'model_information',
            'model_response.model_id',
            'model_information.model_id'
        )
        .leftJoin(
            'patients',
            'model_information.patient_id',
            'patients.patient_id'
        )
        .whereIn('model_response.model_id', distinctPatient)
        .andWhere('model_response.response_type', 'mRECIST')
        .orderBy('drug_name')
        .orderBy('patient')

        Promise.all([promise1, promise2])
                .then((row) => {
                    let drug = ''
                    let data = []
                    let untreated = {Drug:'untreated'}
                    let value = 0
                    let patient = []
                    
                    //this will create enteries for heatmap.
                    usersRows = JSON.parse(JSON.stringify(row[1]));
                    usersRows.forEach(element => {
                        if (element.drug_name === drug) {
                            data[value-1][element.patient] = element.value
                        } 
                        else if (element.drug_name === 'untreated') {
                            untreated[element.patient] = element.value
                        }
                        else {
                            drug = element.drug_name
                            data.push({})
                            data[value]['Drug'] = element.drug_name
                            data[value][element.patient] = element.value
                            value += 1
                        }
                    })
                    if(Object.entries(untreated).length === 1 && untreated.constructor === Object) {}
                    else {data.unshift(untreated)}

                    //array of all the patients belonging to a particular dataset.
                    patientRows = usersRows = JSON.parse(JSON.stringify(row[0]));
                    patient = patientRows.map(element => {
                        return element.patient
                    })
                    data.push(patient)

                    //sending the response.
                    res.send(data)
                })
}



module.exports = {
    getModelResponseBasedOnDataset
}