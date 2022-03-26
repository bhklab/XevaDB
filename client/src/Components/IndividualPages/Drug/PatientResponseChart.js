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


// styling Patient Response Chart
const StyledChart = styled.div`
    max-width: 90%;

    .select-container {
        margin-top: 20px;
        min-width: 180px;
        float: right;
    }
`;

// options for select 
const options = [
    { value: 'mRECIST', label: 'mRECIST' },
    { value: 'Slope', label: 'Slope' },
    { value: 'Best Average Response', label: 'Best Average Response' },
    { value: 'AUC', label: 'AUC' }
]

// margin object to be passed as a prop to BarPlot component
const margin = {
    top: 50, right: 150, bottom: 50, left: 100,
};

// transform model response data
const transformModelResponseData = (data, responseType) => {
    // transformed object
    const transformedArray = [];

    // iterate through data and add an object to transformed Array
    Object.keys(data).forEach(element => {
        if (element !== 'Drug' && data[element][responseType] !== 'NA') {
            data[element][responseType].forEach(response => {
                transformedArray.push({
                    id: element,
                    // value: mRECISTMapper[data[element].mRECIST],
                    value: response,
                    // color: mRECISTColorMapper[response],
                });
            });
        };
    });

    return transformedArray;
};


// function to create mRECIST types
const mRECISTArray = (data) => {
    const mRECISTDataArray = [];
    Object.values(data).forEach(el => {
        if (typeof (el) === 'object') {
            el.mRECIST.forEach(response => {
                if (response && !mRECISTDataArray.includes(response) && response !== 'NA') {
                    mRECISTDataArray.push(response)
                }
            });
        };
    });
    return mRECISTDataArray;
};


// Patient Response Chart component 
const PatientResponseChart = ({ drugName }) => {
    // model response data
    const [modelResponseData, setModelResponseData] = useState([]);
    const [mRECISTTypes, setmRECISTTypes] = useState([]);
    const [isLoading, setLoadingState] = useState(true);
    const [selectionValue, setSelectionValue] = useState('mRECIST');

    // fetch model response data
    const fetchData = async () => {
        // fetch model response data
        const modelResponse = await axios.get(`/api/v1/modelresponse?drug=${drugName.replace(/\s/g, '').replace('+', '_')}`, { headers: { Authorization: localStorage.getItem('user') } });

        // transform model response data
        const transformedModelResponse = transformModelResponseData(modelResponse.data[0], selectionValue);

        // get the mRECIST array and set the state
        setmRECISTTypes(mRECISTArray(modelResponse.data[0]));

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
                        defaultInputValue={selectionValue}
                    />
                </div>
                <BarPlot
                    data={modelResponseData}
                    label="Model Response"
                    yAxisTicks={mRECISTTypes}
                    shouldAppendBarText={false}
                    margin={margin}
                    isScatter={true}
                // yAxisTicks={['PD', 'SD', 'PR', 'CR']}
                />
            </StyledChart>
        )
    )
};


export default PatientResponseChart;

PatientResponseChart.propTypes = {
    drugName: PropTypes.string,
};
