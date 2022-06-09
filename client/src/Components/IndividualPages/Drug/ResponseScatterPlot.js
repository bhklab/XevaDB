import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BarPlot from '../../Plots/BarPlot';
// import mRECISTMapper from '../../../utils/mRECISTMapper';
// import mRECISTColorMapper from '../../../utils/mRECISTColorMapper';
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
    top: 20, right: 150, bottom: 80, left: 100,
};

// transform model response data based on response type!
const transformModelResponseData = (data, responseType) => {
    // transformed object
    const transformedArray = [];

    // iterate through data and add an object to transformed Array
    Object.keys(data).forEach(element => {
        if (element !== 'Drug' && data[element][responseType].length > 0) {
            data[element][responseType].forEach(response => {
                if (response !== 'NA') {
                    transformedArray.push({
                        id: element,
                        // value: mRECISTMapper[data[element].mRECIST],
                        value: response,
                        // color: mRECISTColorMapper[response],
                    });
                }
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
const ResponseScatterPlot = ({ data }) => {
    // model response data
    const [transformedModelResponseData, setTransformedModelResponseData] = useState([]);
    const [mRECISTTypes, setmRECISTTypes] = useState([]);
    const [selectionValue, setSelectionValue] = useState('mRECIST');

    // fetch model response data
    const fetchData = () => {
        // transform model response data
        const transformedData = transformModelResponseData(data, selectionValue);

        // get the mRECIST array and set the state
        setmRECISTTypes(mRECISTArray(data));

        // set the model response data
        setTransformedModelResponseData(transformedData);
    };

    // use effect react hook
    useEffect(() => {
        // fetch data function
        const modelResponse = fetchData();

    }, [data]);

    return (
        data.length === 0 ? <Spinner loading={true} /> : (
            <StyledChart>
                <div className='select-container'>
                    <Select
                        options={options}
                        styles={customStyles}
                        defaultValue={{ value: 'mRECIST', label: 'mRECIST' }}
                    />
                </div>
                <BarPlot
                    data={transformedModelResponseData}
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


export default ResponseScatterPlot;
