import React from 'react';
import HeatMapData from '../Plots/HeatMap/HeatMapData';
import OncoprintData from '../Plots/Oncoprint/OncoprintData';
import Footer from '../Footer/Footer';
import { PatientProvider } from '../Context/PatientContext';
import GlobalStyles from '../../GlobalStyles';
import axios from 'axios';
import SpinnerUtil from '../Utils/Spinner';

class Dataset extends React.Component {
    constructor(props) {
        super(props);

        this.setPatients = (patients) => {
            this.setState({
                globalPatients: patients,
            });
        };

        this.state = {
            datasetId: 0,
            globalPatients: [],
            setPatients: this.setPatients,
            loading: true,
            datasetName: '',
        };
    }

    // new component life cycle method (mounting).
    static getDerivedStateFromProps(props) {
        const { match } = props;
        const datasetParam = match.params.id;
        return {
            datasetId: datasetParam,
        };
    }

    /**
     * 
     * @param {Array} datasets - an array of the datasets
     * @returns {string} - dataset name corresponding to the dataset id
     */
    findDatasetName = (datasets) => {
        const datasetId = Number(this.state.datasetId);

        return datasets.filter(dataset => dataset.id === datasetId)[0]['name'];
    }

    // lifecycle method to make an API request
    componentDidMount() {
        const datasets = axios.get('/api/v1/datasets', { headers: { Authorization: localStorage.getItem('user') } })
            .then(datasets => {
                this.setState({
                    datasetName: this.findDatasetName(datasets.data.datasets),
                    loading: false,
                });
            })
    }

    render() {
        const { datasetId, globalPatients, setPatients, loading, datasetName } = this.state;
        const providerData = { globalPatients, setPatients };
        return (
            <>
                <GlobalStyles />
                <div className='wrapper'>
                    {
                        loading
                            ? <SpinnerUtil loading={loading} />
                            : (
                                <>
                                    <h1> {datasetName} </h1>
                                    <div className='heatmap-oncoprint-wrapper center-component'>
                                        <PatientProvider value={providerData}>
                                            <HeatMapData
                                                datasetId={datasetId}
                                            />
                                            <OncoprintData
                                                datasetId={datasetId}
                                            />
                                        </PatientProvider>
                                    </div>
                                    <Footer />
                                </>
                            )
                    }
                </div>
            </>
        );
    }
}

export default Dataset;
