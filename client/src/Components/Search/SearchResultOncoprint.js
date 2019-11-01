import React from 'react'
import axios from 'axios'
import Oncoprint from '../Oncoprint/Oncoprint'



class SearchResultOncoprint extends React.Component {

    constructor(props) {
        super(props)
        //setting the states for the data.
        this.state = {
            threshold : 0,
            hmap_patients: [],
            genes_mut : [],
            genes_rna : [],
            genes_cnv: [],
            patient_mut : [],
            patient_rna : [],
            patient_cnv : [],
            data_mut : [],
            data_rna : [],
            data_cnv : []
        };
        //binding the functions declared.
        this.updateResults = this.updateResults.bind(this);
    }

    updateResults(result, genomics_param) {
        let genomics_value = genomics_param.split(',')
        let genomics = []

        // temporary solution to remove cnv if everything is selected.
        if((genomics_value.includes('Mutation') || genomics_value.includes('CNV'))) {
            genomics.push('Mutation')
        } 
        if (genomics_value.includes('RNASeq')){
            genomics.push('RNASeq')
        } 
       
        // grab the last array(patient array) from result[0]
        const dataset = result[0].data;
        let hmap_patients = [];
        // grabbing the total patients from hmap.
        hmap_patients = dataset.pop()

        //removing last element from each array element of result
        if(result.length > 1) {
            result.forEach((value, i) => {
                if (i !== 0) {
                    value.data.pop()
                }
            })
        }

        //setting patients genes and data for each of mutation, cnv and rna (given they are present)
        let patient = {}
        let genes = {}
        let data = {}

        genomics.forEach((value, i) => {
            let val = value.substring(0,3).toLowerCase()
           
            // setting patients
            let patient_id = Object.keys(result[i].data[0]).filter(value => {
                let return_value = ''
                if(value !== 'gene_id') {
                    return_value = value
                }
                return return_value
            });
            patient[`patient_${val}`] = patient_id

            // genes
            let gene_id = result[i].data.map((data) => {
                return data['gene_id']
            })
            genes[`genes_${val}`] = gene_id

            //data
            data[`data_${val}`] = result[i].data
        })

        this.setState({
            threshold : this.props.threshold,
            hmap_patients : hmap_patients,
            patient_mut : patient['patient_mut'] === undefined ? this.state.patient_mut : patient['patient_mut'],
            patient_rna : patient['patient_rna'] === undefined ? this.state.patient_rna : patient['patient_rna'],
            patient_cnv : patient['patient_cnv'] === undefined ? this.state.patient_cnv : patient['patient_cnv'],
            genes_mut : genes['genes_mut'] === undefined ? this.state.genes_mut : genes['genes_mut'],
            genes_rna : genes['genes_rna'] === undefined ? this.state.genes_rna : genes['genes_rna'],
            genes_cnv : genes['genes_cnv'] === undefined ? this.state.genes_cnv : genes['genes_cnv'],
            data_mut : data['data_mut'] === undefined ? this.state.data_mut : data['data_mut'],
            data_rna : data['data_rna'] === undefined ? this.state.data_rna : data['data_rna'],
            data_cnv : data['data_cnv'] === undefined ? this.state.data_cnv : data['data_cnv']
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
        top: 50,
        right: 200,
        bottom: 100,
        left: 250,
    }

    render() {
        return (
            <Oncoprint 
                className = 'oprint_result'
                dimensions = {this.dimensions}
                margin = {this.margin}
                threshold = {Number(this.state.threshold)}
                hmap_patients = {this.state.hmap_patients}
                genes_mut = {Boolean(this.state.genes_mut.length) ? this.state.genes_mut : this.state.genes_cnv} 
                genes_rna = {this.state.genes_rna}
                patient_mut = {Boolean(this.state.patient_mut.length) ? this.state.patient_mut : this.state.patient_cnv}
                patient_rna = {this.state.patient_rna}
                data_mut = {Boolean(this.state.data_mut.length) ? this.state.data_mut : this.state.data_cnv} 
                data_rna = {this.state.data_rna}
            />
        )
    }
}



export default SearchResultOncoprint
