import React, {Fragment} from 'react'
import DonutChart from '../DonutChart/DonutChart'
import Footer from '../Footer/Footer'
import DrugTable from './DrugTable'
import axios from 'axios'
import styled from 'styled-components'


const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 200px;
    margin-bottom: 100px;
    color: #3453b0

    h1 {
        font-family:'Raleway', sans-serif;
        font-weight:700;
        text-align:center;
    }
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
        axios.get(`http://localhost:5000/api/v1/drug/class`)
             .then((response) => {
                 response.data.data.forEach((data) => {
                     let value = {}
                     if(data.class_name !== '') {
                        value['id'] = (data.class_name).replace('"', '').replace("/", "_")
                        value['value'] = data.model_ids
                        new_values.push(value)
                     }
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

    chartId = 'donut_drugs'

    render() {
        return (
            <Fragment>
                <Wrapper>
                    <div className="donut-wrapper">
                        <h1> Number of Model IDs Per Drug class </h1>
                        <DonutChart 
                            dimensions = {this.dimensions} 
                            margin = {this.margin} 
                            chartId = {this.chartId} 
                            data = {this.state.data}
                            arc = {this.arc}
                        />
                    </div>
                    <div className="donut-wrapper">
                        <DrugTable/>
                    </div>
                </Wrapper>
                <Footer/>
            </Fragment>
        )
    }
}

export default DonutDrug