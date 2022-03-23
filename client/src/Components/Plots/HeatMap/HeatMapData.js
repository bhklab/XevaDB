/* eslint-disable no-shadow */
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Spinner from '../../Utils/Spinner';
import HeatMap from './HeatMap';
import { OncoprintGenes } from '../../../utils/OncoprintGenes';

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
        this.fetchData = this.fetchData.bind(this);
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
            this.fetchData(datasetParam);
        }
    }

    async fetchData(datasetId) {
        // get model response data and list of patients based on the dataset id
        const modelResponse = await axios.get(`/api/v1/modelresponse/${datasetId}`, { headers: { Authorization: localStorage.getItem('user') } });
        const patients = await axios.get(`/api/v1/datasets/detail/${datasetId}`, { headers: { Authorization: localStorage.getItem('user') } });

        const modelResponseData = modelResponse.data;
        const patientsData = patients.data.datasets[0].patients;

        this.parseData(modelResponseData, patientsData);
    }

    // this function takes the parsed result and set the states.
    parseData(modelResponse, patients) {
        const dataset = [];
        let patientArray = patients;
        const drug = [];

        // this function will loop through the elements and
        // assign empty values in case model information is not available for the patient.
        modelResponse.forEach((element) => {
            const dataObject = {};
            drug.push(element.Drug);
            patientArray.forEach((patient) => {
                if (!element[patient]) {
                    dataObject[patient] = '';
                } else {
                    dataObject[patient] = element[patient];
                }
            });
            dataset.push(dataObject);
        });

        // patient from one of the object elements to keep it in sync.
        patientArray = Object.keys(dataset[0]);

        // TODO: Update the 'data' for now; change later when we have average data
        // TODO: 'mRECIST' will be the max occuring value and the other parameters are just taking the first element
        // finds the maximum occurences of a 'mRECIST' type
        const maxOccuringmRECISTValue = (mRECIST) => {
            // this object will store the occurences of mRECIST values
            const mRECISTObject = {};
            mRECIST.forEach(el => {
                if (mRECISTObject.hasOwnProperty(el)) {
                    mRECISTObject[el] += 1;
                } else {
                    mRECISTObject[el] = 1;
                }
            });

            // gets the maximum occuring mRECIST value
            let maxOccuringKey = '';
            let maxValue = 0;
            Object.entries(mRECISTObject).forEach(([key, value]) => {
                if (value > maxValue) {
                    maxValue = value;
                    maxOccuringKey = key;
                }
            });

            return maxOccuringKey;
        };

        // transforms the 'dataset' 
        const transformedData = dataset.map(row => {
            const transformedRow = {};
            Object.entries(row).forEach(([key, value]) => {
                transformedRow[key] = {
                    'best.average.response': value['best.average.response']?.[0] || 'NA',
                    'survival': value['survival']?.[0] || 'NA',
                    'slope': value['slope']?.[0] || 'NA',
                    'AUC': value['AUC']?.[0] || 'NA',
                    'mRECIST': value['mRECIST'] ? maxOccuringmRECISTValue(value['mRECIST']) : 'NA',
                };
            });
            return transformedRow;
        });

        // setting state
        this.setState({
            drugId: drug,
            patientId: patientArray,
            // data: dataset,
            data: transformedData,
            dimensions: { height: 30, width: 14 },
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
                            geneList={OncoprintGenes}
                        />
                    )}
            </div>
        );
    }
}

HeatMapData.propTypes = {
    dataset: PropTypes.string.isRequired,
};

export default HeatMapData;
