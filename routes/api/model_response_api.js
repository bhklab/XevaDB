const knex = require('../../db/knex1');


// this will get the evaluations based one the param id which is the dataset id.
const getModelResponseBasedOnDataset = function(request,response) {
    let param_dataset = request.params.dataset

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

    let promise2 = knex.select('patients.patient', 'drugs.drug_name', 'value', 'model_information.model_id')
                        .from('model_response')
                        .rightJoin(
                            'model_information',
                            'model_response.model_id',
                            'model_information.model_id'
                        )
                        .leftJoin(
                            'patients',
                            'model_information.patient_id',
                            'patients.patient_id'
                        )
                        .leftJoin(
                            'drugs',
                            'model_information.drug_id',
                            'drugs.drug_id'
                        )
                        .where('model_information.dataset_id', param_dataset)
                        // .whereIn('model_response.model_id', distinctPatient)
                        // .andWhere('model_response.response_type', 'mRECIST')
                        .andWhere(function() {
                            this.where('model_response.response_type', 'mRECIST')
                                .orWhereNull('model_response.response_type')
                        })
                        .orderBy('drug_name')
                        .orderBy('patient')

        Promise.all([promise1, promise2])
                .then((row) => {
                    console.log(row)
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
                    response.send(data)
                })
}



// this will get the model evaluations based on
// dataset and drug query parameters.
const getModelResponseBasedPerDatasetBasedOnDrugs = function(request, response) {
    //grabbing the drug parameters and dataset parameters.
        let param_drug = request.query.drug
        let param_dataset = request.query.dataset
        let drug = param_drug.split(',')
        drug = drug.map(value => {
            return value.replace('_', ' + ')
        })


        let distinct_patients = knex('model_information')
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

        let response_data = knex.select('patients.patient', 'drugs.drug_name', 'value', 'model_information.model_id')
                                .from('model_response')
                                .rightJoin(
                                    'model_information',
                                    'model_response.model_id',
                                    'model_information.model_id'
                                )
                                .leftJoin(
                                    'patients',
                                    'model_information.patient_id',
                                    'patients.patient_id'
                                )
                                .leftJoin(
                                    'drugs',
                                    'model_information.drug_id',
                                    'drugs.drug_id'
                                )
                                .where('model_information.dataset_id', param_dataset)
                                .andWhere(function() {
                                    this.where('model_response.response_type', 'mRECIST')
                                        .orWhereNull('model_response.response_type')
                                })
                                .whereIn('drugs.drug_name', drug)
                                .orderBy('drug_name')
                                .orderBy('patient')

        Promise.all([distinct_patients, response_data])
                .then((row) => {
                    console.log(row)
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
                    response.send(data)
                })
        
}


module.exports = {
    getModelResponseBasedOnDataset,
    getModelResponseBasedPerDatasetBasedOnDrugs
}