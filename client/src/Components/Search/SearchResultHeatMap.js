/* eslint-disable no-shadow */
import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import HeatMap from '../Plots/HeatMap/HeatMap';

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
        this.fetchData = this.fetchData.bind(this);
    }


    componentDidMount() {
        const { drugParam } = this.props;
        const { datasetParam } = this.props;

        // fetch data
        this.fetchData(drugParam, datasetParam);
    }

    // async function to fetch model response and patients data
    async fetchData(drugParam, datasetParam) {
        // model response and patients
        const modelResponse = await axios.get(`/api/v1/modelresponse?drug=${drugParam}&dataset=${datasetParam}`, { headers: { Authorization: localStorage.getItem('user') } });
        const patients = await axios.get(`/api/v1/datasets/detail/${datasetParam}`, { headers: { Authorization: localStorage.getItem('user') } });

        // parse data
        this.parseData(modelResponse.data, patients.data.datasets[0].patients);
    }



    // this function takes the parsed result and set the states.
    parseData(modelResponse, patients) {
        // defining the variables.
        const dataset = [];
        let patientArray = patients;
        const drug = [];

        // this function will loop through the elements and
        // assign empty values in case model information is not available.
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

        // setting the states using the defined variables.
        this.setState({
            drugId: drug,
            patientIdDrug: patientArray,
            // drugData: dataset,
            drugData: transformedData,
            dimensions: { height: 30, width: 14 },
            margin: {
                top: 200, right: 250, bottom: 50, left: 250,
            },
        });
    }

    render() {
        const {
            drugData, drugId,
            patientIdDrug, dimensions,
            margin,
        } = this.state;
        const { datasetParam, geneParam } = this.props;
        const geneList = geneParam.split(',');

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
                    geneList={geneList}
                />
            ) : ''
        );
    }
}

SearchResultHeatMap.propTypes = {
    datasetParam: PropTypes.string.isRequired,
    drugParam: PropTypes.string.isRequired,
    geneParam: PropTypes.string.isRequired,
};

export default SearchResultHeatMap;
