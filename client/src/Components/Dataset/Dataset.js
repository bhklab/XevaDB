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

    componentWillMount() {
        const dataset_param = this.props.match.params.id;
        this.setState({
            dataset: dataset_param,
        });
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
