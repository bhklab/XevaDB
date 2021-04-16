import React from 'react';
import axios from 'axios';
import DonutChart from '../../Plots/DonutChart';
import Footer from '../../Footer/Footer';
import GlobalStyles from '../../../GlobalStyles';
import DatasetTable from './DatasetTable';
import Spinner from '../../Utils/Spinner';

class DatasetSummary extends React.Component {
    static parseDataset(dataset) {
        if (dataset === 'SU2C UHN (Breast Cancer)') {
            return 'UHN (Breast Cancer)';
        }
        if (dataset === 'SU2C McGill (Breast Cancer)') {
            return 'McGill (Breast Cancer)';
        }
        return dataset;
    }

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
        axios.get('/api/v1/dataset/models', { headers: { Authorization: localStorage.getItem('user') } })
            .then((response) => {
                const data = response.data.data.map((element) => ({
                    id: DatasetSummary.parseDataset(element.dataset_name),
                    value: element.patient_id,
                    parameter: element.dataset_id,
                    totalModels: element.totalModels,
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
                                        data={data}
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
