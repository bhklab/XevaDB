import React from 'react';
import axios from 'axios';
import HeatMapData from '../Plots/HeatMap/HeatMapData';
import OncoprintData from '../Plots/Oncoprint/OncoprintData';
import Footer from '../Footer/Footer';
import PatientContext from '../Context/PatientContext';
import GlobalStyles from '../../GlobalStyles';
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

    // lifecycle method to make an API request
    componentDidMount() {
        const datasets = axios.get('/api/v1/datasets', { headers: { Authorization: localStorage.getItem('user') } })
            .then((datasetList) => {
                this.setState({
                    datasetName: this.findDatasetName(datasetList.data.datasets),
                    loading: false,
                });
            });
    }

    /**
     *
     * @param {Array} datasets - an array of the datasets
     * @returns {string} - dataset name corresponding to the dataset id
     */
    findDatasetName = (datasets) => {
        const datasetId = Number(this.state.datasetId);
        return datasets.filter((dataset) => dataset.id === datasetId)[0].name;
    }

    render() {
        const {
            datasetId, globalPatients, setPatients, loading, datasetName,
        } = this.state;
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
                                    <h1>
                                        {' '}
                                        {datasetName}
                                        {' '}
                                    </h1>
                                    <div className='heatmap-oncoprint-wrapper center-component'>
                                        <PatientContext.Provider value={providerData}>
                                            <HeatMapData
                                                datasetId={datasetId}
                                                isOld
                                            />
                                            <OncoprintData
                                                datasetId={datasetId}
                                            />
                                        </PatientContext.Provider>
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
