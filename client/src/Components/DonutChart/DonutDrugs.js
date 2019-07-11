import React from 'react';
import DonutChart from './DonutChart';
import axios from 'axios';

class DonutTissue extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data : []
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:5000/api/v1/drugs`)
             .then((response) => {
                 this.setState({
                     data : response.data
                 })
             })
    }

    dimensions = {
        width: 500,
        height: 500
    }

    margin = {
        top: 300,
        right: 200,
        bottom: 100,
        left: 350
    }

    chartId = 'donut'

    render() {
        return (
            <div className='DonutTissue'>
                <DonutChart 
                    dimensions={this.dimensions} margin={this.margin} 
                    chartId={this.chartId} data={this.state.data}
                />
            </div>
        )
    }
}

export default DonutTissue