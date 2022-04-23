import React from 'react';
import HeatMapData from '../Plots/HeatMap/HeatMapData';
import OncoprintData from '../Plots/Oncoprint/OncoprintData';
import Footer from '../Footer/Footer';
import { PatientProvider } from '../Context/PatientContext';
import GlobalStyles from '../../GlobalStyles';

class Dataset extends React.Component {
    constructor(props) {
        super(props);

        this.setPatients = (patients) => {
            this.setState({
                globalPatients: patients,
            });
        };

        this.state = {
            dataset: 0,
            globalPatients: [],
            setPatients: this.setPatients,
        };
    }

    // new component life cycle method (mounting).
    static getDerivedStateFromProps(props) {
        const { match } = props;
        const datasetParam = match.params.id;
        return {
            dataset: datasetParam,
        };
    }

    render() {
        const { dataset, globalPatients, setPatients } = this.state;
        const providerData = {
            globalPatients,
            setPatients,
        };
        return (
            <>
                <GlobalStyles />
                <div className='wrapper'>
                    <div className='heatmap-oncoprint-wrapper center-component'>
                        <PatientProvider value={providerData}>
                            <HeatMapData
                                datasetId={dataset}
                            />
                            <OncoprintData
                                dataset={dataset}
                            />
                        </PatientProvider>
                    </div>
                    <Footer />
                </div>
            </>
        );
    }
}

export default Dataset;
