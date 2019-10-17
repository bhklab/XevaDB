import React from 'react'
import axios from 'axios'
import Oncoprint from '../Oncoprint/Oncoprint'



class SearchResultOncoprint extends React.Component {

    constructor(props) {
        super(props)
        //setting the states for the data.
        this.state = {
            data : [],
            threshold : 0,
            hmap_patients: [],
            genes_mut : [],
            genes_rna : [],
            //genes_cnv: [],
            patient_mut : [],
            patient_rna : [],
            //patient_cnv : []
        };
        //binding the functions declared.
        this.updateResults = this.updateResults.bind(this);
    }

    updateResults(result, genomics_param) {
        let genomics = genomics_param.split(',')
        // temporary solution to remove cnv if everything is selected.
        if(genomics.includes('Mutation') && genomics.includes('CNV')) {
            genomics = ['Mutation', 'RNASeq']
        }
       
        // grab the last array(patient array) from result[0]
        const dataset = result[0].data;
        let hmap_patients = [];
        // grabbing the total patients from hmap.
        hmap_patients = dataset.pop()
        
        //data array.
        let data = result.map(value => {
            return value.data
        })

        let patient = {}
        let genes = {}

        genomics.forEach((value, i) => {
            let patient_val = `patient_${value.substring(0,3).toLowerCase()}`
            // setting patients
            let patient_id = Object.keys(result[i].data[0]).filter(value => {
                if(value !== 'gene_id') {
                    //patient.push(value)
                    return value
                }
            });
            patient[patient_val] = patient_id

            // genes
            let gene_val = `genes_${value.substring(0,3).toLowerCase()}`
            let gene_id = result[i].data.map((data) => {
                return data['gene_id']
            })
            genes[gene_val] = gene_id
        })
        
        this.setState({
            data : data,
            threshold : this.props.threshold,
            hmap_patients : hmap_patients,
            patient_mut : patient['patient_mut'],
            patient_rna : patient['patient_rna'],
            //patient_cnv : patient['patient_cnv'],
            genes_mut : genes['genes_mut'],
            genes_rna : genes['genes_rna'],
            //genes_cnv : genes['genes_cnv'],
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
                    this.updateResults(response, genomics_param)
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
                className = 'oprint_result'
                data = {this.state.data} 
                threshold = {this.state.threshold}
                hmap_patients = {this.state.hmap_patients}
                patient_id = {this.state.patient_mut}
                genes = {this.state.genes_mut} 
                dimensions = {this.dimensions}
                margin = {this.margin}
                genes_rna = {this.state.genes_rna}
            />
        )
    }
}



export default SearchResultOncoprint
