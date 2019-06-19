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
    }

    //function to read the data and set the states.
    updateResults(result) {
        const dataset = result;
        console.log(dataset);
    }

    componentDidMount() {
        axios.get(`http://localhost:5000/api/v1/treatment?drug=BGJ398&patient=X-1008`)
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