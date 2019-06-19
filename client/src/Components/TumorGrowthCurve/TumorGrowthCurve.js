import React from 'react';
import * as d3 from 'd3';
import axios from 'axios';

class TumorGrowthCurve extends React.Component {

    constructor(props) {
        super(props)
        //setting states for the data.
        this.state = {
            data : []
        }
        //binding the functions declared.
        this.TumorGrowthCurve = this.TumorGrowthCurve.bind(this);
        this.updateResults = this.updateResults.bind(this);
        this.getParams = this.getParams.bind(this)
    }

    //function to read the data and set the states.
    updateResults(result) {
        const dataset = result;
        console.log(dataset);
    }

    //get the parameters and set the values in the variables.
    getParams() {
        const params = new URLSearchParams(this.props.location.search)
        let patient_param = params.get('patient');
        let drugid_param = params.get('drug_id');
        return {patient_param: patient_param, drugid_param: drugid_param}
    }

    componentDidMount() {
        let patient_param = this.getParams().drugid_param
        let drugid_param = this.getParams().patient_param
        axios.get(`http://localhost:5000/api/v1/treatment?drug=${patient_param}&patient=${drugid_param}`)
             .then(response => {
                 this.updateResults(response.data);
             })
        this.TumorGrowthCurve()
    }

    componentDidUpdate() {
        this.TumorGrowthCurve()
    }

    // Grab the states and pass it to the main function.
    TumorGrowthCurve() {
        const node = this.node;
    }

    render() {
        return (
            <svg ref = {node => this.node = node} width={1500} height={1200}>
            </svg>
        )
    }
}

export default TumorGrowthCurve;