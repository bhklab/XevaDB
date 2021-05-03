import React from 'react';
import axios from 'axios';
import DonutChart from '../../Plots/DonutChart';
import Footer from '../../Footer/Footer';
import GlobalStyles from '../../../GlobalStyles';
import DatasetTable from './DatasetTable';
import Spinner from '../../Utils/Spinner';

class DatasetSummary extends React.Component {
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
        axios.get('/api/v1/datasets/details', { headers: { Authorization: localStorage.getItem('user') } })
            .then((response) => {
                console.log(response);
                const data = response.data.datasets.map((element) => ({
                    dataset_name: element.name,
                    dataset_id: element.id,
                    totalPatients: element.patients.length,
                    totalModels: element.models.length,
                }));
                this.setState({
                    data,
                    dimensions: { width: 650, height: 250 },
                    margin: {
                        top: 320, right: 100, bottom: 100, left: 380,
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
                    <div className="donut-wrapper">
                        <h1> Number of Patients Per Dataset </h1>
                        {
                            loading
                                ? <Spinner loading={loading} />
                                : (
                                    <DonutChart
                                        dimensions={dimensions}
                                        margin={margin}
                                        data={
                                            data.map((element) => (
                                                {
                                                    id: element.dataset_name,
                                                    value: element.totalPatients,
                                                }
                                            ))
                                        }
                                        arcRadius={arc}
                                        chartId="donut_datasets"
                                    />
                                )
                        }
                    </div>
                    <div className="summary-table">
                        {
                            loading
                                ? <Spinner loading={loading} />
                                : (
                                    <DatasetTable
                                        data={data}
                                        dataLength={data.length}
                                    />
                                )
                        }
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default DatasetSummary;
