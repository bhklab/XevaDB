import React from 'react'
import DonutChart from './DonutChart'
import axios from 'axios'

class DonutDrug extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data : []
        }
    }

    componentDidMount() {
        let new_values = []
        axios.get(`http://localhost:5000/api/v1/drugs`)
             .then((response) => {
                 response.data.data.forEach((data) => {
                     let value = {}
                     value['id'] = (data.drug).replace(/\s/g, '').replace('+', '_')
                     value['value'] = data.total
                     new_values.push(value)
                 })
                 this.setState({
                     data : new_values
                 })
             })
    }

    dimensions = {
        width: 130,
        height: 80
    }

    margin = {
        top: 220,
        right: 100,
        bottom: 100,
        left: 250
    }

    arc = {
        outerRadius: 160,
        innerRadius: 70
    }

    chartId = 'donut_drug'

    render() {
        return (
            <div className='DonutDrug'>
                <DonutChart 
                    dimensions={this.dimensions} margin={this.margin} 
                    chartId={this.chartId} data={this.state.data}
                    arc={this.arc}
                />
            </div>
        )
    }
}

export default DonutDrug