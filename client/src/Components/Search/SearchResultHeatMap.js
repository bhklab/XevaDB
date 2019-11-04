/* eslint-disable no-shadow */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-filename-extension */
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

        axios.get(`/api/v1/response?drug=${drugParam}&dataset=${datasetParam}`)
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
        return (
            <HeatMap
                data={drugData}
                drug_id={drugId}
                patient_id={patientIdDrug}
                dimensions={dimensions}
                margin={margin}
                className="searchedheatmap"
            />
        );
    }
}

SearchResultHeatMap.propTypes = {
    datasetParam: PropTypes.string.isRequired,
    drugParam: PropTypes.string.isRequired,
};

export default SearchResultHeatMap;
