import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import DonutChart from '../DonutChart/DonutChart';
import Footer from '../Footer/Footer';
import DrugTable from './DrugTable';
import GlobalStyles from '../../GlobalStyles';
import TopNav from '../TopNav/TopNav';

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
`;

class DonutDrug extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dimensions: {},
            margin: {},
            arc: {},
        };
    }

    componentDidMount() {
        const newValues = [];
        // passing on token as the header to the api call.
        axios.get('/api/v1/drug/class', { headers: { Authorization: localStorage.getItem('user') } })
            .then((response) => {
                response.data.data.forEach((data) => {
                    const value = {};
                    if (data.class_name !== '') {
                        value.id = (data.class_name).replace('"', '').replace('/', '_');
                        value.value = data.model_ids;
                        newValues.push(value);
                    }
                });
                this.setState({
                    data: newValues,
                    dimensions: { width: 650, height: 250 },
                    margin: {
                        top: 320, right: 100, bottom: 100, left: 380,
                    },
                    arc: { outerRadius: 260, innerRadius: 150 },
                });
            });
    }

    render() {
        const {
            data, arc,
            dimensions, margin,
        } = this.state;
        return (
            <div>
                <TopNav />
                <GlobalStyles />
                <Wrapper>
                    <div className="donut-wrapper">
                        <h1> Number of Models Per Drug class </h1>
                        <DonutChart
                            dimensions={dimensions}
                            margin={margin}
                            chartId="donut_drugs"
                            data={data}
                            arcRadius={arc}
                        />
                    </div>
                    <div className="donut-wrapper">
                        <DrugTable />
                    </div>
                </Wrapper>
                <Footer />
            </div>
        );
    }
}

export default DonutDrug;
