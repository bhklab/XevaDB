import React from 'react';
import axios from 'axios';
import DonutChart from '../../Plots/DonutChart';
import Footer from '../../Footer/Footer';
import GlobalStyles from '../../../GlobalStyles';
import DatasetTable from './DatasetTable';
import Spinner from '../../Utils/Spinner';


// tooltip mapper to be passed as a Prop to the donut chart
const mapper = {
    'Dataset': 'id',
    'Patients': 'value',
    'Models': 'models',
};

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
        axios.get('/api/v1/datasets/stats', { headers: { Authorization: localStorage.getItem('user') } })
            .then((response) => {
                const data = response.data.data.map((element) => ({
                    dataset_name: element.dataset,
                    dataset_id: element.dataset_id,
                    totalPatients: element.patients,
                    totalModels: element.models,
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
                    <div className="component-wrapper center-component">
                        <h1> Datasets </h1>
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
                                                    parameter: element.dataset_id,
                                                    models: element.totalModels,
                                                }
                                            ))
                                        }
                                        arcRadius={arc}
                                        chartId="donut_datasets"
                                        tooltipMapper={mapper}
                                    />
                                )
                        }
                    </div>
                    <div className="component-wrapper center-component">
                        {
                            loading
                                ? <Spinner loading={loading} />
                                : (
                                    <>
                                        <h1> List of Datasets </h1>
                                        <DatasetTable
                                            data={data}
                                            dataLength={data.length}
                                        />
                                    </>
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
