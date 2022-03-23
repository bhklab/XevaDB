import React from 'react';
import SearchResultHeatMap from './SearchResultHeatMap';
import SearchResultOncoprint from './SearchResultOncoprint';
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
                            <SearchResultHeatMap
                                drugParam={drugParam}
                                datasetParam={datasetParam}
                                geneParam={geneParam}
                            />
                            <SearchResultOncoprint
                                geneParam={geneParam}
                                datasetParam={datasetParam}
                                genomicsParam={genomicsParam}
                                threshold={threshold}
                            />
                        </PatientProvider>
                    </div>

                </div>
            </>
        );
    }
}


export default SearchResult;
