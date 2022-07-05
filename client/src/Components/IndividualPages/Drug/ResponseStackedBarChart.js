import React from 'react';
import Plot from 'react-plotly.js';
import createSvgCanvas from '../../../utils/CreateSvgCanvas';
import mRECISTObject from '../../../utils/mRECISTObject';
import mRECISTColorMapper from '../../../utils/mRECISTColorMapper';
import styled from 'styled-components';

const ChartStyle = styled.div`
    width: 1000px;
    overflow: scroll;
    margin: 0 0 40px 0;

    ::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 10px;
        height: 10px;
    }
      
    ::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-color: rgba(0, 0, 0, .5);
        box-shadow: 0 0 1px rgba(255, 255, 255, .5);
    }
`;

/**
 * 
 * @param {Object} data - input data object
 * @param {string} response - response type
 * @returns {Object} - transformed data object
 */
const transformData = (data, response = 'mRECIST') => {
    // transformed data object
    const transformedData = {};

    Object.entries(data).forEach(([patient, drug]) => {
        if (typeof (drug) === 'object') {
            // make a copy of the object
            const mRECISTObjectCopy = { ...mRECISTObject };
            let totalResponseCount = 0;

            drug[response].forEach(responseValue => {
                if (response === 'mRECIST' && responseValue) {
                    mRECISTObjectCopy[responseValue] = mRECISTObjectCopy[responseValue] + 1;
                    totalResponseCount++;
                }
            })

            mRECISTObjectCopy['count'] = totalResponseCount;
            transformedData[patient] = mRECISTObjectCopy;
        }
    })

    return transformedData;
};

/**
 * 
 * @param {Object} data - input data
 * @param {string} name - type corresponding to which the trace object is created
 */
const createPlotTrace = (data, name) => {
    const xAxis = Object.keys(data).map(el => String(`~${el}`));
    const yAxis = Object.values(data).map(row => row[name]);

    return {
        x: xAxis,
        y: yAxis,
        name,
        type: 'bar',
        marker: {
            color: mRECISTColorMapper[name]
        }
    };
};

/**
 * creates the plot
 * @param {Object} data - input data
 * @param {Object} mRECISTObject - mRECIST mapper
 */
const createPlot = (data, mRECISTObject) => {
    // creates a trace array
    const traceArray = Object.keys(mRECISTObject).map(key => createPlotTrace(data, key));

    const width = Object.keys(data).length * 16;

    return (
        <Plot
            data={traceArray}
            layout={{
                autosize: true,
                barmode: 'stack',
                showlegend: true,
                width: width,
                height: 400,
            }}
            config={{
                responsive: true,
                displayModeBar: false,
            }}
        />
    )
};


/**
 * Component function creates the histogram chart for the individual drug page
 */
const ResponseStackedBarChart = function ({
    individualDrugResponseData,
}) {
    // transformed data object
    const transformedData = transformData(individualDrugResponseData[0]);

    return (
        // create plot
        <ChartStyle>
            {createPlot(transformedData, mRECISTObject)}
        </ChartStyle>
    );
};

export default ResponseStackedBarChart;
