import React from 'react'
import Oncoprint from './Oncoprint'
import axios from 'axios'

class OncoprintData extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            dataset_param : 0,
            threshold : 2,
            hmap_patients: [],
            genes_mut : [],
            genes_rna : [],
            patient_mut : [],
            patient_rna : [],
            data_mut : [],
            data_rna : []
        };
        this.updateResults = this.updateResults.bind(this);
    }

    updateResults(onco) {
        // total patients.
        const dataset = onco[0].data;
        let hmap_patients = [];
        // grabbing the total patients from hmap.
        hmap_patients = dataset.pop()

        //setting patients genes and data for each of mutation, cnv and rna (given they are present)
        let patient = {}
        let genes = {}
        let data = {}
        let genomics = ['Mutation', 'RNASeq']

        genomics.forEach((value, i) => {
            let val = value.substring(0,3).toLowerCase()

            // setting patients
            let patient_id = Object.keys(onco[i].data[0]).filter(value => {
                let return_value = ''
                if(value !== 'gene_id') {
                    return_value = value
                }
                return return_value
            });
            console.log(patient_id)
            patient[`patient_${val}`] = patient_id

            // genes
            let gene_id = onco[i].data.map((data) => {
                return data['gene_id']
            })
            genes[`genes_${val}`] = gene_id

            //data
            data[`data_${val}`] = onco[i].data
        })


        this.setState({
            hmap_patients : hmap_patients,
            patient_mut : patient['patient_mut'],
            patient_rna : patient['patient_rna'],
            genes_mut : genes['genes_mut'],
            genes_rna : genes['genes_rna'],
            data_mut : data['data_mut'],
            data_rna : data['data_rna'],
        })
    }

    componentWillMount() {
        this.setState ({
            dataset_param : this.props.dataset
        })
    }

    componentDidMount() {
        if(this.state.dataset_param > 0) {
            let mutation_data = axios.get(`/api/v1/mutation/${this.state.dataset_param}`)
            let rnaseq_data = axios.get(`/api/v1/rnaseq/${this.state.dataset_param}`)
            
            Promise.all([mutation_data, rnaseq_data])
                    .then(response => {
                        this.updateResults(response);  
                    })
        } else { // this is basically useless else statement.
            axios.get(`/api/v1/mutation`)
                .then(response => {
                    this.updateResults(response.data);
                })
        }
    }

    dimensions = {
        height: 35,
        width: 20,
    }

    margin = {
        top: 100,
        right: 200,
        bottom: 0,
        left: 250
    }

    render() {
        return (
            <div className='wrapper' style={{margin:'auto', fontSize:'0'}}>
                <Oncoprint 
                    className = 'oprint'
                    dimensions = {this.dimensions}
                    margin = {this.margin}
                    threshold = {this.state.threshold}
                    hmap_patients = {this.state.hmap_patients}
                    genes_mut = {this.state.genes_mut} 
                    genes_rna = {this.state.genes_rna}
                    patient_mut = {this.state.patient_mut}
                    patient_rna = {this.state.patient_rna}
                    data_mut = {this.state.data_mut} 
                    data_rna = {this.state.data_rna}
                />   
            </div>    
        )
    }
}

export default OncoprintData