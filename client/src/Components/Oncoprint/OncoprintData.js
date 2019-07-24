import React from 'react'
import Oncoprint from './Oncoprint'
import axios from 'axios'

class OncoprintData extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data : [],
            genes : [],
            patient_id : []
        };
        this.updateResults = this.updateResults.bind(this);
    }

    updateResults(result) {
        const dataset = result;
        let gene_id = [];
        let patient = [];
        
        patient = Object.keys(dataset[0]);
        patient.shift();

        dataset.map((data) => {
            return gene_id.push(data['gene_id']);
        })
        
        this.setState({
            data : dataset,
            genes : gene_id,
            patient_id : patient
        })
    }

    componentDidMount() {
        axios.get(`http://localhost:5000/api/v1/mutation`)
             .then(response => {
                 this.updateResults(response.data);
             })
    }

    render() {
        return (
            <div>
                <Oncoprint
                    data={this.state.data} patient_id={this.state.patient_id}
                    genes={this.state.genes}
                />       
            </div>
           
        )
    }
}

export default OncoprintData