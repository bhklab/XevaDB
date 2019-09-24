import React from 'react'
import axios from 'axios'
import Oncoprint from '../Oncoprint/Oncoprint'



class SearchResultOncoprint extends React.Component {

    constructor(props) {
        super(props)
        //setting the states for the data.
        this.state = {
            patient_id : [],
            gene_id: [],
            gene_data: [],
            heatmap_patients: [],
        };
        //binding the functions declared.
        this.updateResults = this.updateResults.bind(this);
    }

    updateResults(result, heatmap) {
        console.log('result is here', result)
        const datasets = result;
        let gene = [];
        let patient = [];
        let heatmap_patients = [];
        
        patient = Object.keys(datasets[0]);
        patient.shift();

        heatmap_patients = Object.keys(heatmap[0]);
        heatmap_patients.shift();

        datasets.map((data) => {
            return gene.push(data['gene_id']);
        })
        
        this.setState({
            gene_data : datasets,
            gene_id : gene,
            patient_id : patient,
            heatmap_patients : heatmap_patients
        })
    }

    componentDidMount() {
        let dataset_param = this.props.dataset_param
        let gene_param = this.props.gene_param
        let drug_for_onco = this.props.drug_for_onco
        
        axios.get(`/api/v1/mutation?genes=${gene_param}&dataset=${dataset_param}`)
            .then(response => {
                axios.get(`/api/v1/response?drug=${drug_for_onco}&dataset=${dataset_param}`)
                .then(heatmap_patient => {
                    this.updateResults(response.data, heatmap_patient.data);
                })
            })
    }

    dimensions = {
        height: 35,
        width: 20,
    }

    margin = {
        top: 100,
        right: 200,
        bottom: 200,
        left: 250
    }

    render() {
        return (
            <Oncoprint 
                data = {this.state.gene_data}
                patient_id = {this.state.patient_id}
                genes = {this.state.gene_id} 
                dimensions = {this.dimensions}
                margin = {this.margin}
                hmap_patients = {this.state.heatmap_patients}
            />
        )
    }
}



export default SearchResultOncoprint
