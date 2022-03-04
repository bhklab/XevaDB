import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import BarPlot from '../../Plots/BarPlot';
import mRECISTMapper from '../../../utils/mRECISTMapper';
import mRECISTColorMapper from '../../../utils/mRECISTColorMapper';
import Spinner from '../../Utils/Spinner';
import Select from 'react-select';
import styled from 'styled-components';
import { customStyles } from '../../Search/SearchStyle';

// options for select 
const options = [
    { value: 'mRECIST', label: 'mRECIST' },
    { value: 'Slope', label: 'Slope' },
    { value: 'Best Average Response', label: 'Best Average Response' },
    { value: 'AUC', label: 'AUC' }
]

// styling Patient Response Chart
const StyledChart = styled.div`
    max-width: 90%;

    .select-container {
        margin-top: 20px;
        min-width: 180px;
        float: right;
    }
`;

// header constant
const HEADER = { headers: { Authorization: localStorage.getItem('user') } };


// Patient Response Chart component 
const PatientResponseChart = ({ drugName }) => {
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
        const modelResponse = await axios.get(`/api/v1/modelresponse?drug=${drugName}`, HEADER);

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
            <StyledChart>
                <h1> Model Response </h1>
                <div className='select-container'>
                    <Select
                        options={options}
                        styles={customStyles}
                    />
                </div>
                <BarPlot
                    data={modelResponseData}
                    label="Model Response"
                />
            </StyledChart>
        )
    )
};


export default PatientResponseChart;

PatientResponseChart.propTypes = {
    drugName: PropTypes.string
};
