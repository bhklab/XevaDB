import React from 'react';
import HeatMapData from '../Plots/HeatMap/HeatMapData';
import OncoprintData from '../Plots/Oncoprint/OncoprintData';
import GlobalStyles from '../../GlobalStyles';
import { PatientProvider } from '../Context/PatientContext';

class SearchResult extends React.Component {
    constructor(props) {
        super(props);

        this.setPatients = (patients) => {
            this.setState({
                globalPatients: patients,
            });
        };

        this.state = {
            drugParam: '',
            datasetParam: '',
            geneParam: '',
            genomicsParam: '',
            threshold: 0,
            globalPatients: [],
            setPatients: this.setPatients,
        };
    }

    static getDerivedStateFromProps(props) {
        // eslint-disable-next-line react/prop-types
        const { location } = props;
        // eslint-disable-next-line react/prop-types
        const params = new URLSearchParams(location.search);
        const genomics = params.get('genomics');
        const drug = params.get('drug');
        const dataset = params.get('dataset');
        const gene = params.get('genes');
        const threshold = params.get('threshold');
        return {
            drugParam: drug,
            datasetParam: dataset,
            geneParam: gene,
            genomicsParam: genomics,
            threshold,
        };
    }

    render() {
        const {
            drugParam, datasetParam, geneParam, genomicsParam,
            threshold, globalPatients, setPatients,
        } = this.state;
        const providerData = {
            globalPatients,
            setPatients,
        };
        return (
            <>
                <GlobalStyles />
                <div className="wrapper">
                    <div className='heatmap-oncoprint-wrapper center-component'>
                        <PatientProvider value={providerData}>
                            <HeatMapData
                                drugList={drugParam}
                                datasetId={datasetParam}
                                geneList={geneParam}
                            />
                            <OncoprintData
                                geneList={geneParam}
                                datasetId={datasetParam}
                                genomicsList={genomicsParam}
                                threshold={threshold}
                                drugList={drugParam}
                            />
                        </PatientProvider>
                    </div>

                </div>
            </>
        );
    }
}


export default SearchResult;
