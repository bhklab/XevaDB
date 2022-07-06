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
    margin: 50px 0 0 0;
    width: 90%;
    position: relative;

    .select-container {
        margin: 20px 0 0 0;
        width: 180px;
        position: absolute;
        right: 0;
        top: 0;
    }

    .barplot-container {
        overflow: auto;
    
        ::-webkit-scrollbar {
            -webkit-appearance: none;
            width: 6px;
            height: 6px;
        }
          
        ::-webkit-scrollbar-thumb {
            border-radius: 5px;
            background-color: rgba(0, 0, 0, .5);
            box-shadow: 0 0 1px rgba(255, 255, 255, .5);
        }
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
    top: 50, right: 100, bottom: 80, left: 100,
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
                <div className='barplot-container'>
                    <BarPlot
                        data={transformedModelResponseData}
                        label="Model Response"
                        yAxisTicks={mRECISTTypes}
                        shouldAppendBarText={false}
                        margin={margin}
                        isScatter={true}
                    />
                </div>
            </StyledChart>
        )
    )
};


export default ResponseScatterPlot;
