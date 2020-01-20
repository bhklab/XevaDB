import React from 'react';
import HeatMapData from '../HeatMap/HeatMapData';
import OncoprintData from '../Oncoprint/OncoprintData';
import Footer from '../Footer/Footer';

class Dataset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataset: 0,
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
                <HeatMapData
                    dataset={dataset}
                />
                <OncoprintData
                    dataset={dataset}
                />
                <Footer />
            </div>
        );
    }
}


export default Dataset;
