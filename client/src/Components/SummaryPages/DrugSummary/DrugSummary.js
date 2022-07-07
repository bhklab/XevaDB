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
                    dimensions: { width: 800, height: 400 },
                    margin: {
                        top: 50, right: 50, bottom: 200, left: 100,
                    },
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
            <>
                <GlobalStyles />
                <div className="wrapper">
                    <div className="component-wrapper center-component">
                        <h1> Number of Models per Drug Class </h1>
                        {
                            loading
                                ? <Spinner loading={loading} />
                                : (
                                    <BarPlot
                                        dimensions={dimensions}
                                        margin={margin}
                                        chartId="barplot_drug"
                                        data={data}
                                        label="Number of models"
                                        shouldAppendBarText={true}
                                    />
                                )
                        }
                    </div>
                    <div className="component-wrapper">
                        <>
                            <h1> List of Drugs </h1>
                            <DrugTable />
                        </>
                    </div>
                    <Footer />
                </div>
            </>
        );
    }
}

export default DrugSummary;
