import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import DonutChart from '../DonutChart/DonutChart';
import Footer from '../Footer/Footer';
import GlobalStyles from '../../GlobalStyles';
import TopNav from '../TopNav/TopNav';

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
`;


class DonutTissue extends React.Component {
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
        axios.get('/api/v1/tissue/patients')
            .then((response) => {
                response.data.data.forEach((data) => {
                    const value = {};
                    value.id = data.tissue_name;
                    value.value = data.total;
                    newValues.push(value);
                });
                this.setState({
                    data: newValues,
                    dimensions: { width: 600, height: 300 },
                    margin: {
                        top: 320, right: 100, bottom: 100, left: 380,
                    },
                    arc: { outerRadius: 280, innerRadius: 150 },
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
                        <h1> Number of Models Per Tissue Type </h1>
                        <DonutChart
                            dimensions={dimensions}
                            margin={margin}
                            chartId="donut_tissues"
                            data={data}
                            arcRadius={arc}
                        />
                    </div>
                </Wrapper>
                <Footer />
            </div>
        );
    }
}

export default DonutTissue;
