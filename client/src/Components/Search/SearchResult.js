import React from 'react';
import HeatMapData from '../Plots/HeatMap/HeatMapData';
import OncoprintData from '../Plots/Oncoprint/OncoprintData';
import GlobalStyles from '../../GlobalStyles';
import PatientContext from '../Context/PatientContext';
import Footer from '../Footer/Footer';

class SearchResult extends React.Component {
    constructor(props) {
        super(props);

        this.setPatients = (patients) => {
            this.setState({
                globalPatients: patients,
            });
        };

        this.setPlotDimensions = (dimensions) => {
            this.setState((prev) => {
                const p = prev.plotDimensions;
                return p && p.width === dimensions.width && p.height === dimensions.height
                    ? null
                    : { plotDimensions: dimensions };
            });
        };

        this.setPlotMargin = (margin) => {
            this.setState((prev) => {
                const p = prev.plotMargin;
                return p && p.top === margin.top && p.right === margin.right
                    && p.bottom === margin.bottom && p.left === margin.left
                    ? null
                    : { plotMargin: margin };
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
            plotDimensions: null,
            setPlotDimensions: this.setPlotDimensions,
            plotMargin: null,
            setPlotMargin: this.setPlotMargin,
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
            plotDimensions, setPlotDimensions,
            plotMargin, setPlotMargin,
        } = this.state;
        const providerData = {
            globalPatients,
            setPatients,
            plotDimensions,
            setPlotDimensions,
            plotMargin,
            setPlotMargin,
        };
        return (
            <>
                <GlobalStyles />
                <div className='wrapper'>
                    <div className='heatmap-oncoprint-wrapper center-component'>
                        <PatientContext.Provider value={providerData}>
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
                        </PatientContext.Provider>
                    </div>
                </div>
                <Footer />
            </>
        );
    }
}

export default SearchResult;
