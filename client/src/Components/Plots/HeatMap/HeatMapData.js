import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Spinner from '../../Utils/Spinner';
import HeatMap from './HeatMap';
import NewHeatMap from './NewHeatMap';
import { OncoprintGenes } from '../../../utils/OncoprintGenes';

// dimension and margin variables
const dimensions = { height: 30, width: 14 };
const margin = {
    top: 200, right: 250, bottom: 50, left: 250,
};

// fetch the patient list and model response data
const fetchData = async (drugList, datasetId) => {
    // get model response data and list of patients based on the dataset id
    let modelResponse;

    if (drugList) {
        modelResponse = axios.get(
            `/api/v1/modelresponse?drug=${drugList}&dataset=${datasetId}`,
            { headers: { Authorization: localStorage.getItem('user') } },
        );
    } else {
        modelResponse = axios.get(
            `/api/v1/modelresponse/${datasetId}`,
            { headers: { Authorization: localStorage.getItem('user') } },
        );
    }

    // patient API call
    const patients = axios.get(
        `/api/v1/datasets/detail/${datasetId}`,
        { headers: { Authorization: localStorage.getItem('user') } },
    );

    // running both API calls in parallel
    const data = await Promise.all([modelResponse, patients]);

    // get model response and patient data
    const modelResponseData = data[0].data;
    const patientList = data[1].data.datasets[0].patients;

    return [modelResponseData, patientList];
};

// this function takes the parsed result and set the states.
const parseData = (modelResponse, patients) => {
    const dataset = {};
    let patientArray = patients;
    const drug = [];

    // this function will loop through the elements and
    // assign empty values in case model information is not available for the patient.
    modelResponse.forEach((element) => {
        drug.push(element.Drug);
        dataset[element.Drug] = {};
        patientArray.forEach((patient) => {
            if (!element[patient]) {
                dataset[element.Drug][patient] = '';
            } else {
                dataset[element.Drug][patient] = element[patient];
            }
        });
    });

    // patient from one of the object elements to keep it in sync.
    patientArray = Object.keys(Object.values(dataset)[0]).sort();

    // TODO: Update the 'data' for now; change later when we have average data
    // TODO: 'mRECIST' will be the max occuring value and the other
    // TODO: parameters are just taking the first element
    // finds the maximum occurences of a 'mRECIST' type
    const maxOccuringmRECISTValue = (mRECIST) => {
        // this object will store the occurences of mRECIST values
        const mRECISTObject = {};
        mRECIST.forEach((el) => {
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
    const transformedData = {};
    Object.entries(dataset).forEach(([drugName, patientObject]) => {
        transformedData[drugName] = {};
        Object.entries(patientObject).forEach(([key, value]) => {
            transformedData[drugName][key] = {
                'Best Average Response': value['best.average.response']?.[0] || 'NA',
                Survival: value.survival?.[0] || 'NA',
                Slope: value.slope?.[0] || 'NA',
                AUC: value.AUC?.[0] || 'NA',
                mRECIST: value.mRECIST ? maxOccuringmRECISTValue(value.mRECIST) : 'NA',
            };
        });
    });

    return {
        drugList: drug,
        patientList: patientArray,
        responseData: transformedData,
    };
};

/**
 * main component
 */
const HeatMapData = (props) => {
    console.log(props);
    const {
        datasetId, drugList: drugProp, geneList: geneProp, isOld,
    } = props;
    const geneList = geneProp ? geneProp.split(',') : OncoprintGenes;
    const [dataObject, setDataObject] = useState({
        responseData: [],
        patientList: [],
        drugList: [],
    });
    const [isLoading, setLoadingState] = useState(true);

    useEffect(() => {
        if (datasetId > 0) {
            fetchData(drugProp, datasetId)
                .then((data) => {
                    const [responseArray, patientArray] = data;
                    return parseData(responseArray, patientArray);
                })
                .then((data) => {
                    setDataObject({
                        responseData: data.responseData,
                        patientList: data.patientList,
                        drugList: data.drugList,
                    });
                    setLoadingState(false);
                });
        }
    }, [props]);

    return (
        <div>
            {
                isLoading
                    ? <Spinner loading={isLoading} />
                    : (
                        isOld // TODO: FIX THIS! REMOVE old heatmap code
                            ? (
                                <HeatMap
                                    data={dataObject.responseData}
                                    drugId={dataObject.drugList}
                                    patientId={dataObject.patientList}
                                    dimensions={dimensions}
                                    geneList={geneList}
                                    margin={margin}
                                    dataset={datasetId}
                                    className='heatmap'
                                />
                            ) : (
                                <NewHeatMap
                                    data={dataObject.responseData}
                                    drugId={dataObject.drugList}
                                    patientId={dataObject.patientList}
                                    dimensions={dimensions}
                                    geneList={geneList}
                                    margin={margin}
                                    dataset={datasetId}
                                    className='heatmap'
                                />
                            )
                    )
            }
        </div>
    );
};

HeatMapData.propTypes = {
    datasetId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    drugList: PropTypes.string,
    geneList: PropTypes.string,
};

export default HeatMapData;
