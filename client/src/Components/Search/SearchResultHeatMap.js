import React from 'react'
import HeatMap from '../HeatMap/HeatMap'
import axios from 'axios'


class SearchResultHeatMap extends React.Component {

    constructor(props) {
        super(props)
        //setting the states for the data.
        this.state = {
            drug_data : [],
            patient_id_drug : [],
            drug_id : [],
            dataset_param : 0
        };
        //binding the functions declared.
        this.parseData = this.parseData.bind(this);
    }

    // this function takes the parsed result and set the states.
    parseData(result) {
      
        // defining the variables.
        let dataset = []
        let patient = []
        let drug = []

        //patient array.
        patient = result.pop()
        
        // this function will loop through the elements and
        // assign empty values in case model information is not available.
        result.forEach(element => {
            let data_object = {}
            drug.push(element.Drug)
            patient.forEach((patient) => {
                if(!element[patient]) {
                    data_object[patient] = ''
                } else {
                    data_object[patient] = element[patient]
                }
            })
            dataset.push(data_object)
        });

        //setting the states using the defined variables.
        this.setState({
            drug_id : drug,
            patient_id_drug : patient,
            drug_data: dataset
        })
    }

    componentDidMount() {
        let drug_param = this.props.drug_param
        let dataset_param = this.props.dataset_param
        
        axios.get(`/api/v1/response?drug=${drug_param}&dataset=${dataset_param}`)
             .then(response => {
                 this.parseData(response.data);
             })
    }

    dimensions = {
        height: 35,
        width: 20,
    }

    margin = {
        top: 300,
        right: 200,
        bottom: 0,
        left: 250
    }

    render() {
        return (
            <HeatMap
                data = {this.state.drug_data} 
                drug_id = {this.state.drug_id} 
                patient_id = {this.state.patient_id_drug} 
                dimensions = {this.dimensions}
                margin = {this.margin}
                className = 'searchedheatmap'
            />
        )
    }
}



export default SearchResultHeatMap
