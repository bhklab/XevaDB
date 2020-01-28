import React from 'react';
import HeatMapData from '../HeatMap/HeatMapData';
import OncoprintData from '../Oncoprint/OncoprintData';
import Footer from '../Footer/Footer';
import { PatientProvider } from './DatasetContext';

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
        const { dataset } = this.state;
        return (
            <div>
                <PatientProvider value={this.state}>
                    <HeatMapData
                        dataset={dataset}
                    />
                    <OncoprintData
                        dataset={dataset}
                    />
                </PatientProvider>
                <Footer />
            </div>
        );
    }
}


export default Dataset;
