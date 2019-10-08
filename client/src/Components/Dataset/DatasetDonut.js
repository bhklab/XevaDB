import React, {Fragment} from 'react'
import DonutChart from '../DonutChart/DonutChart'
import axios from 'axios';
import styled from 'styled-components'
import Footer from '../Footer/Footer'
import GlobalStyles from '../../GlobalStyles'
import TopNav from '../TopNav/TopNav'

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 200px;
    color: #3453b0;
    margin-bottom: 100px;

    h1 {
        font-family:'Raleway', sans-serif;
        font-weight:700;
        text-align:center;
    }
`

class DatasetDonut extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data : []
        }
    }

    componentDidMount() {
        axios.get(`/api/v1/dataset/patients`)
            .then((response) => {
                response = response.data.data.map((element) => {
                    return ({
                        id: element.dataset_name,
                        value: element.patient_id,
                        parameter: element.dataset_id
                    })
                })
                this.setState({
                    data: response
                })
            })
    }

    dimensions = {
        width: 650,
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

    chartId = 'donut_datasets'

    render() {
        return (
            <Fragment>
                <GlobalStyles/>
                <TopNav/>
                <Wrapper>
                    <div className='donut-wrapper'>
                        <h1> Number of Patient IDs Per Dataset </h1>
                        <DonutChart 
                            dimensions = {this.dimensions} 
                            margin = {this.margin} 
                            chartId = {this.chartId} 
                            data = {this.state.data}
                            arc = {this.arc}
                        />
                    </div>
                </Wrapper>
                <Footer/>
            </Fragment>
        )
    }
}


export default DatasetDonut