import React, {Fragment} from 'react'
import DonutChart from '../DonutChart/DonutChart'
import Footer from '../Footer/Footer'
import axios from 'axios'
import styled from 'styled-components'


const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
    color: #bd0808;
`

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
        width: 600,
        height: 250
    }

    margin = {
        top: 320,
        right: 100,
        bottom: 100,
        left: 380
    }

    arc = {
        outerRadius: 260,
        innerRadius: 150
    }

    chartId = 'donut_drug'

    render() {
        return (
            <Fragment>
                <Wrapper>
                    <DonutChart 
                        dimensions={this.dimensions} margin={this.margin} 
                        chartId={this.chartId} data={this.state.data}
                        arc={this.arc}
                    />
                </Wrapper>
                <Footer/>
            </Fragment>
        )
    }
}

export default DonutDrug