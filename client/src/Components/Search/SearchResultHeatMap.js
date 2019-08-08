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
        };
        //binding the functions declared.
        this.parseData = this.parseData.bind(this);
        console.log(this.props.drug_param)
    }

    // this function takes the parsed result and set the states.
    parseData(result) {
        const dataset = result;
        let patient = Object.keys(dataset[0]);
        patient.shift();
        let drug = dataset.map((data) => {
            return data.Drug;
        })
        this.setState({
            drug_id : drug,
            patient_id_drug : patient,
            drug_data: dataset
        })
    }

    componentDidMount() {
       
        let drug_param = this.props.drug_param
        let dataset_param = this.props.dataset_param
        
        axios.get(`http://localhost:5000/api/v1/respevaldrug/?drug=${drug_param}&dataset=${dataset_param}`)
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
        bottom: 200,
        left: 250
    }

    render() {
        return (
            <HeatMap
                data={this.state.drug_data} drug_id={this.state.drug_id} 
                patient_id={this.state.patient_id_drug} dimensions={this.dimensions}
                margin={this.margin}
            />
        )
    }
}



export default SearchResultHeatMap
