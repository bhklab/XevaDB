import React from 'react';
import SearchResultHeatMap from './SearchResultHeatMap';
import SearchResultOncoprint from './SearchResultOncoprint';
import GlobalStyles from '../../GlobalStyles';
import TopNav from '../TopNav/TopNav';
import { PatientProvider } from '../Dataset/DatasetContext';

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
            drugParam, datasetParam, geneParam, genomicsParam, threshold,
        } = this.state;
        return (
            <div>
                <TopNav />
                <GlobalStyles />
                <div className="wrapper" style={{ margin: 'auto' }}>
                    <PatientProvider value={this.state}>
                        <SearchResultHeatMap
                            drugParam={drugParam}
                            datasetParam={datasetParam}
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
        );
    }
}


export default SearchResult;
