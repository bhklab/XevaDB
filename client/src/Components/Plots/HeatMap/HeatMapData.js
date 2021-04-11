/* eslint-disable no-shadow */
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Spinner from '../../Utils/Spinner';
import HeatMap from './HeatMap';
import GlobalStyles from '../../../GlobalStyles';

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
            loading: true,
        };
        // binding the functions declared.
        this.parseData = this.parseData.bind(this);
    }


    static getDerivedStateFromProps(props) {
        const { dataset } = props;
        return {
            datasetParam: dataset,
        };
    }

    componentDidMount() {
        const { datasetParam } = this.state;
        if (datasetParam > 0) {
            axios.get(`/api/v1/response/${datasetParam}`, { headers: { Authorization: localStorage.getItem('user') } })
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

        // patient from one of the object elements to keep it in sync.
        patient = Object.keys(dataset[0]);

        this.setState({
            drugId: drug,
            patientId: patient,
            data: dataset,
            dimensions: { height: 30, width: 15 },
            margin: {
                top: 200, right: 250, bottom: 50, left: 250,
            },
            loading: false,
        });
    }

    render() {
        const {
            data, drugId, loading,
            patientId, dimensions,
            margin, datasetParam,
        } = this.state;
        return (
            <div>
                <GlobalStyles />
                <div className="wrapper">
                    {loading ? <Spinner loading={loading} />
                        : (
                            <HeatMap
                                data={data}
                                drugId={drugId}
                                patientId={patientId}
                                dimensions={dimensions}
                                margin={margin}
                                dataset={datasetParam}
                                className="heatmap"
                            />
                        )}
                </div>
            </div>
        );
    }
}

HeatMapData.propTypes = {
    dataset: PropTypes.string.isRequired,
};

export default HeatMapData;
