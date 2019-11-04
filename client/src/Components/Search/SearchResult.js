/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/no-deprecated */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import SearchResultHeatMap from './SearchResultHeatMap';
import SearchResultOncoprint from './SearchResultOncoprint';
import GlobalStyles from '../../GlobalStyles';
import TopNav from '../TopNav/TopNav';


class SearchResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drugParam: '',
            datasetParam: '',
            geneParam: '',
            genomicsParam: '',
            threshold: 0,
        };
    }

    componentWillMount() {
        // eslint-disable-next-line react/prop-types
        const { location } = this.props;
        // eslint-disable-next-line react/prop-types
        const params = new URLSearchParams(location.search);
        const genomics = params.get('genomics');
        const drug = params.get('drug');
        const dataset = params.get('dataset');
        const gene = params.get('genes');
        const threshold = params.get('threshold');

        this.setState({
            drugParam: drug,
            datasetParam: dataset,
            geneParam: gene,
            genomicsParam: genomics,
            threshold,
        });
    }

    render() {
        const {
            drugParam, datasetParam, geneParam, genomicsParam, threshold,
        } = this.state;
        return (
            <div>
                <TopNav />
                <GlobalStyles />
                <div className="wrapper" style={{ margin: 'auto', fontSize: '0' }}>
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
                </div>
            </div>
        );
    }
}


export default SearchResult;
