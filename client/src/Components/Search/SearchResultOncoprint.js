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
            gene_data: []
        };
        //binding the functions declared.
        this.updateResults = this.updateResults.bind(this);
    }


    updateResults(result) {
        console.log('result is here', result)
        const datasets = result;
        let gene = [];
        let patient = [];
        
        patient = Object.keys(datasets[0]);
        patient.shift();

        datasets.map((data) => {
            return gene.push(data['gene_id']);
        })
        
        this.setState({
            gene_data : datasets,
            gene_id : gene,
            patient_id : patient
        })
    }


    componentDidMount() {
        let dataset_param = this.props.dataset_param
        let gene_param = this.props.gene_param
        
        axios.get(`http://localhost:5000/api/v1/mutationgene/?genes=${gene_param}&dataset=${dataset_param}`)
            .then(response => {
                console.log(response)
                this.updateResults(response.data)
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
            <Oncoprint 
                data={this.state.gene_data} patient_id={this.state.patient_id}
                genes={this.state.gene_id} dimensions={this.dimensions}
                margin={this.margin}
            />
        )
    }
}



export default SearchResultOncoprint
