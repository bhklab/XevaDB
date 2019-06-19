import React from 'react';
import * as d3 from 'd3';
import axios from 'axios';

class TumorGrowthCurve extends React.Component {

    constructor(props) {
        super(props)

        //binding the functions declared.
        this.TumorGrowthCurve = this.TumorGrowthCurve.bind(this);
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <svg ref = {node => this.node = node} width={1500} height={1200}>
                
            </svg>
        )
    }
}

export default TumorGrowthCurve;