import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarPlot from '../../Plots/BarPlot';
import mRECISTMapper from '../../../utils/mRECISTMapper';
import mRECISTColorMapper from '../../../utils/mRECISTColorMapper';
import Spinner from '../../Utils/Spinner';

// header constant
const HEADER = { headers: { Authorization: localStorage.getItem('user') } };

// Patient Response Chart component 
const PatientResponseChart = () => {
    // model response data
    const [modelResponseData, setModelResponseData] = useState([]);
    const [isLoading, setLoadingState] = useState(true);

    // transform model response data
    const transformModelResponseData = (data) => {
        // transformed object
        const transformedArray = [];

        // iterate through data and add an object to transformed Array
        Object.keys(data).forEach(element => {
            if (element !== 'Drug' && data[element].mRECIST !== 'NA') {
                transformedArray.push({
                    id: element,
                    value: mRECISTMapper[data[element].mRECIST],
                    color: mRECISTColorMapper[data[element].mRECIST],
                })
            };
        });

        return transformedArray;
    };

    // fetch model response data
    const fetchData = async () => {
        // fetch model response data
        const modelResponse = await axios.get(`/api/v1/modelresponse?drug=BGJ398`, HEADER);

        // transform model response data
        const transformedModelResponse = transformModelResponseData(modelResponse.data[0]);

        // set the model response data
        setModelResponseData(transformedModelResponse);

        // update the loading state
        setLoadingState(false);
    };

    // use effect react hook
    useEffect(() => {
        // fetch data function
        const modelResponse = fetchData();

    }, []);

    return (
        isLoading ? <Spinner loading={isLoading} /> : (
            <>
                <h1> Model Response </h1>
                <BarPlot
                    data={modelResponseData}
                    label="Model Response"
                />
            </>
        )
    )
};


export default PatientResponseChart;
