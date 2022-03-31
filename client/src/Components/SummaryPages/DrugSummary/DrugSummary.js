import React from 'react';
import axios from 'axios';
import Footer from '../../Footer/Footer';
import Spinner from '../../Utils/Spinner';
import DrugTable from './DrugTable';
import GlobalStyles from '../../../GlobalStyles';
import BarPlot from '../../Plots/BarPlot';


class DrugSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dimensions: {},
            margin: {},
            arc: {},
            loading: true,
        };
    }

    componentDidMount() {
        const newValues = [];
        // passing on token as the header to the api call.
        axios.get('/api/v1/models/count/groupbydrugclass', { headers: { Authorization: localStorage.getItem('user') } })
            .then((response) => {
                response.data.data.forEach((data) => {
                    const value = {};
                    if (String(data.class_name) !== 'null') {
                        value.id = (data.class_name).replace('"', '').replace('/', '_');
                        value.value = data.modelCount;
                        newValues.push(value);
                    }
                });
                this.setState({
                    data: newValues,
                    // dimensions: { width: 650, height: 250 },
                    dimensions: { width: 850, height: 400 },
                    margin: {
                        // top: 320, right: 100, bottom: 100, left: 380,
                        top: 50, right: 150, bottom: 200, left: 150,
                    },
                    arc: { outerRadius: 260, innerRadius: 150 },
                    loading: false,
                });
            });
    }

    render() {
        const {
            data, arc, loading,
            dimensions, margin,
        } = this.state;
        return (
            <div>
                <GlobalStyles />
                <div className="wrapper">
                    <div className="component-wrapper center-component">
                        <h1> Number of Models per Drug Class </h1>
                        {
                            loading ? <Spinner loading={loading} />
                                : (
                                    <BarPlot
                                        dimensions={dimensions}
                                        margin={margin}
                                        chartId="donut_drugs"
                                        data={data}
                                        arcRadius={arc}
                                        label="Number of models"
                                        shouldAppendBarText={true}
                                    />
                                )
                        }
                    </div>
                    <div className="component-wrapper center-component">
                        <DrugTable />
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
}

export default DrugSummary;
