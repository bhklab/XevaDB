import React from 'react';
import * as d3 from 'd3';
import axios from 'axios';


class DonutChart extends React.Component {

    constructor(props) {
        super(props)
        this.DonutChart = this.DonutChart.bind(this);
    }

    componentDidMount() {

    }

    componentDidUpdate() {
        this.DonutChart()
    }

    DonutChart() {
        const node = this.node
    }

    render() {
        return (
            <svg ref = {node => this.node = node} width={1500} height={1200}>
                
            </svg>
        )
    }
}

export default DonutChart;