/* eslint-disable react/no-deprecated */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import HeatMap from './HeatMap';
import GlobalStyles from '../../GlobalStyles';
import TopNav from '../TopNav/TopNav';

class HeatMapData extends React.Component {
    constructor(props) {
        super(props);
        // setting the states for the data.
        this.state = {
            data: [],
            patientId: [],
            drugId: [],
            datasetParam: 0,
            dimensions: {},
            margin: {},
        };
        // binding the functions declared.
        this.parseData = this.parseData.bind(this);
    }

    componentWillMount() {
        const { dataset } = this.props;
        this.setState({
            datasetParam: dataset,
        });
    }

    componentDidMount() {
        const { datasetParam } = this.state;
        if (datasetParam > 0) {
            axios.get(`/api/v1/response/${datasetParam}`)
                .then((response) => {
                    this.parseData(response.data);
                });
        } else {
            axios.get('/api/v1/respeval')
                .then((response) => {
                    this.parseData(response.data);
                });
        }
    }

    // this function takes the parsed result and set the states.
    parseData(result) {
        const dataset = [];
        let patient = [];
        const drug = [];

        // patient array.
        patient = result.pop();

        // this function will loop through the elements and
        // assign empty values in case model information is not available.
        result.forEach((element) => {
            const dataObject = {};
            drug.push(element.Drug);
            patient.forEach((patient) => {
                if (!element[patient]) {
                    dataObject[patient] = '';
                } else {
                    dataObject[patient] = element[patient];
                }
            });
            dataset.push(dataObject);
        });

        this.setState({
            drugId: drug,
            patientId: patient,
            data: dataset,
            dimensions: { height: 35, width: 20 },
            margin: {
                top: 200, right: 200, bottom: 20, left: 250,
            },
        });
    }

    render() {
        const {
            data, drugId,
            patientId, dimensions,
            margin,
        } = this.state;
        return (
            <div>
                <TopNav />
                <GlobalStyles />
                <div className="wrapper" style={{ margin: 'auto', fontSize: '0' }}>
                    <HeatMap
                        data={data}
                        drugId={drugId}
                        className="heatmap"
                        patientId={patientId}
                        dimensions={dimensions}
                        margin={margin}
                    />
                </div>
            </div>
        );
    }
}

HeatMapData.propTypes = {
    dataset: PropTypes.string.isRequired,
};

export default HeatMapData;
