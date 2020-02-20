/* eslint-disable no-shadow */
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import HeatMap from '../HeatMap/HeatMap';

class SearchResultHeatMap extends React.Component {
    constructor(props) {
        super(props);
        // setting the states for the data.
        this.state = {
            drugData: [],
            patientIdDrug: [],
            drugId: [],
            dimensions: {},
            margin: {},
        };
        // binding the functions declared.
        this.parseData = this.parseData.bind(this);
    }

    componentDidMount() {
        const { drugParam } = this.props;
        const { datasetParam } = this.props;

        axios.get(`/api/v1/response?drug=${drugParam}&dataset=${datasetParam}`, { headers: { Authorization: localStorage.getItem('user') } })
            .then((response) => {
                this.parseData(response.data);
            });
    }

    // this function takes the parsed result and set the states.
    parseData(result) {
        // defining the variables.
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

        // patient from one of the object elements to keep it in sync.
        patient = Object.keys(dataset[0]);

        // setting the states using the defined variables.
        this.setState({
            drugId: drug,
            patientIdDrug: patient,
            drugData: dataset,
            dimensions: { height: 35, width: 20 },
            margin: {
                top: 300, right: 200, bottom: 0, left: 250,
            },
        });
    }

    render() {
        const {
            drugData, drugId,
            patientIdDrug, dimensions,
            margin,
        } = this.state;
        const { datasetParam } = this.props;
        return (
            drugData.length > 0 ? (
                <HeatMap
                    data={drugData}
                    drugId={drugId}
                    patientId={patientIdDrug}
                    dimensions={dimensions}
                    margin={margin}
                    className="searchedheatmap"
                    dataset={datasetParam}
                />
            ) : ''
        );
    }
}

SearchResultHeatMap.propTypes = {
    datasetParam: PropTypes.string.isRequired,
    drugParam: PropTypes.string.isRequired,
};

export default SearchResultHeatMap;
