import React from 'react';
import axios from 'axios';
import DonutChart from '../Plots/DonutChart';
import Footer from '../Footer/Footer';
import GlobalStyles from '../../GlobalStyles';
import TopNav from '../TopNav/TopNav';


class TissueSummary extends React.Component {
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
        axios.get('/api/v1/tissue/models', { headers: { Authorization: localStorage.getItem('user') } })
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
                <div className="wrapper">
                    <div className="donut-wrapper summary-table">
                        <h1> PDXs Per Tissue Type </h1>
                        <DonutChart
                            dimensions={dimensions}
                            margin={margin}
                            chartId="donut_tissues"
                            data={data}
                            arcRadius={arc}
                        />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default TissueSummary;
