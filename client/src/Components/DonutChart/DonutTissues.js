import React from 'react'
import DonutChart from './DonutChart'
import axios from 'axios'

class DonutTissue extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data : []
        }
    }

    componentDidMount() {
        let new_values = []
        axios.get(`http://localhost:5000/api/v1/tissues`)
             .then((response) => {
                 response.data.data.map((data) => {
                     let value = {}
                     value['id'] = data.tissue
                     value['value'] = data.total
                     new_values.push(value)
                 })
                 this.setState({
                     data : new_values
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