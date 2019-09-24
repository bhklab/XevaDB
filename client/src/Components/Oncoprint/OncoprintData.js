import React from 'react'
import Oncoprint from './Oncoprint'
import axios from 'axios'

class OncoprintData extends React.Component {

    constructor(props) {
        //console.log(this.props)
        super(props)
        this.state = {
            data : [],
            genes : [],
            patient_id : [],
            hmap_patients: [],
            dataset_param : 0
        };
        this.updateResults = this.updateResults.bind(this);
    }

    updateResults(onco, hmap) {
        
        const dataset = onco;
        let gene_id = [];
        let patient = [];
        let hmap_patients = [];

        Object.keys(dataset[0]).forEach(value => {
            if(value !== 'gene_id') {
                patient.push(value)
            }
        });

        // grabbing the total patients from hmap.
        hmap_patients = hmap.pop()

        // genes
        dataset.map((data) => {
            return gene_id.push(data['gene_id']);
        })
        
        this.setState({
            data : dataset,
            genes : gene_id,
            patient_id : patient,
            hmap_patients : hmap_patients
        })
    }

    componentWillMount() {
        this.setState ({
            dataset_param : this.props.dataset
        })
    }

    componentDidMount() {
        if(this.state.dataset_param > 0) {
            axios.get(`/api/v1/mutation/${this.state.dataset_param}`)
             .then(response => {
                axios.get(`/api/v1/response/${this.state.dataset_param}`)
                    .then(hmap => {
                        this.updateResults(response.data, hmap.data);
                    })
            })
        } else {
            axios.get(`/api/v1/mutation`)
            .then(response => {
                axios.get(`/api/v1/response/`)
                    .then(hmap => {
                        this.updateResults(response.data, hmap.data);
                    })
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
            <div className="wrapper" style={{margin:"auto", fontSize:"0"}}>
                <Oncoprint 
                    data = {this.state.data} 
                    patient_id = {this.state.patient_id}
                    hmap_patients = {this.state.hmap_patients}
                    className = "oprint"
                    genes = {this.state.genes} 
                    dimensions = {this.dimensions}
                    margin = {this.margin}
                />   
            </div>    
        )
    }
}

export default OncoprintData