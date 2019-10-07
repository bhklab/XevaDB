import React from 'react'
import axios from 'axios'
import Oncoprint from '../Oncoprint/Oncoprint'



class SearchResultOncoprint extends React.Component {

    constructor(props) {
        super(props)
        //setting the states for the data.
        this.state = {
            data : [],
            genes : [],
            patient_id : [],
            hmap_patients: [],
            genes_rna : [],
        };
        //binding the functions declared.
        this.updateResults = this.updateResults.bind(this);
    }

    updateResults(result) {
        const dataset = result[0].data;
        let gene_id = [];
        let patient = [];
        let hmap_patients = [];

        Object.keys(dataset[0]).forEach(value => {
            if(value !== 'gene_id') {
                patient.push(value)
            }
        });

        // grabbing the total patients from hmap.
        hmap_patients = dataset.pop()

        // genes
        dataset.map((data) => {
            return gene_id.push(data['gene_id']);
        })

        let data = result.map(value => {
            return value.data
        })

        // genes for rnaseq
        let gene_id_rna = result[1].data.map((data) => {
            return data['gene_id']
        })

        this.setState({
            data : data,
            genes : gene_id,
            patient_id : patient,
            hmap_patients : hmap_patients,
            genes_rna : gene_id_rna
        })
        
    }

    componentDidMount() {
        let dataset_param = this.props.dataset_param
        let gene_param = this.props.gene_param
        let genomics_param = this.props.genomics_param
        let query_data = []

        // making get requests based on the genomics parameters.
        // sequence is important (first cnv or mutation) then rnaseq has to be pushed.
        if (genomics_param.includes('CNV') || genomics_param.includes('Mutation')) {
            query_data.push(axios.get(`/api/v1/mutation?genes=${gene_param}&dataset=${dataset_param}`))
        }
        if (genomics_param.includes('RNASeq')) {
            query_data.push(axios.get(`/api/v1/rnaseq?genes=${gene_param}&dataset=${dataset_param}`))
        } 
        
        Promise.all([...query_data])
                .then(response => {
                    this.updateResults(response)
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
                data = {this.state.data} 
                patient_id = {this.state.patient_id}
                hmap_patients = {this.state.hmap_patients}
                className = 'oprint_result'
                genes = {this.state.genes} 
                dimensions = {this.dimensions}
                margin = {this.margin}
                genes_rna = {this.state.genes_rna}
            />
        )
    }
}



export default SearchResultOncoprint
