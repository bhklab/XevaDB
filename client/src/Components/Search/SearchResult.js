import React from 'react'
import HeatMap from '../HeatMap/HeatMap'
import axios from 'axios'
import TopNav from '../TopNav/TopNav'
import Oncoprint from '../Oncoprint/Oncoprint'
import Footer from '../Footer/Footer'



class SearchResult extends React.Component {

    constructor(props) {
        super(props)
        //setting the states for the data.
        this.state = {
            drug_data : [],
            patient_id : [],
            patient_id_drug : [],
            drug_id : [],
            gene_id: [],
            gene_data: []
        };
        //binding the functions declared.
        this.parseData= this.parseData.bind(this);
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

    // grab the query parameters passed to this component.
    getParams() {
        // grabbing the parameters
        let params = new URLSearchParams(this.props.location.search);
        let drug_param = params.get('drug')
        let dataset_param = params.get('dataset')
        let gene_param = params.get('genes')
        return {dataset_param: dataset_param, drug_param: drug_param, gene_param: gene_param}
    }

    componentDidMount() {
        let drug_param = this.getParams().drug_param
        let dataset_param = this.getParams().dataset_param
        let gene_param = this.getParams().gene_param
        
        axios.get(`http://localhost:5000/api/v1/respevaldrug/?drug=${drug_param}&dataset=${dataset_param}`)
             .then(response => {
                 this.parseData(response.data);
             })

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
            
            <div>
                
                <HeatMap
                    data={this.state.drug_data} drug_id={this.state.drug_id} 
                    patient_id={this.state.patient_id_drug} dimensions={this.dimensions}
                    margin={this.margin}
                />
                 <Oncoprint 
                    data={this.state.gene_data} patient_id={this.state.patient_id}
                    genes={this.state.gene_id} dimensions={this.dimensions}
                    margin={this.margin}
                />   
            </div>
        )
    }
}



export default SearchResult
