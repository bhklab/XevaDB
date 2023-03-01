import React, { useRef, useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import styled from 'styled-components';
import createSvgCanvas from '../../../utils/CreateSvgCanvas';
import mRECISTObject from '../../../utils/mRECISTObject';
import mRECISTColorMapper from '../../../utils/mRECISTColorMapper';

// default width of the single bar
const BAR_WIDTH = 17;

const ChartStyle = styled.div`
    width: 95%;
    overflow: scroll;

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

            drug[response].forEach((responseValue) => {
                if (response === 'mRECIST' && responseValue) {
                    mRECISTObjectCopy[responseValue] = mRECISTObjectCopy[responseValue] + 1;
                    totalResponseCount++;
                }
            });

            mRECISTObjectCopy.count = totalResponseCount;
            transformedData[patient] = mRECISTObjectCopy;
        }
    });

    return transformedData;
};

/**
 *
 * @param {Object} data - input data
 * @param {string} name - type corresponding to which the trace object is created
 */
const createPlotTrace = (data, name) => {
    const xAxis = Object.keys(data);
    const yAxis = Object.values(data).map((row) => row[name]);

    return {
        x: xAxis,
        y: yAxis,
        name,
        type: 'bar',
        marker: {
            color: mRECISTColorMapper[name],
        },
    };
};

/**
 * creates the plot
 * @param {Object} data - input data
 * @param {Object} mRECISTObject - mRECIST mapper
 */
const createPlot = (data, mRECISTObject, elementWidth) => {
    // creates a trace array
    const traceArray = Object.keys(mRECISTObject).map((key) => createPlotTrace(data, key));

    const dataLength = Object.keys(data).length;
    const width = elementWidth > BAR_WIDTH * dataLength
        ? elementWidth * 0.95
        : BAR_WIDTH * dataLength;

    return (
        <Plot
            data={traceArray}
            layout={{
                margin: {
                    l: 50, r: 0, b: 100, t: 40,
                },
                autosize: true,
                barmode: 'stack',
                showlegend: true,
                width,
                height: 400,
                xaxis: {
                    type: 'category',
                    title: { text: 'Patient', standoff: 10 },
                    tickfont: { size: 10 },
                },
            }}
            config={{
                responsive: true,
                displayModeBar: false,
            }}
        />
    );
};

/**
 * Component function creates the histogram chart for the individual drug page
 */
const ResponseStackedBarChart = function ({
    individualDrugResponseData,
}) {
    // reference for the div wrapper.
    const ref = useRef(null);

    // state to set the width of the styled div used for the plot
    const [elementWidth, setElementWidth] = useState(0);

    useEffect(() => {
        setElementWidth(ref.current.offsetWidth);
    }, []);

    // transformed data object
    const transformedData = transformData(individualDrugResponseData[0]);

    return (
        // create plot
        <ChartStyle ref={ref}>
            {
                elementWidth && createPlot(transformedData, mRECISTObject, elementWidth)
            }
        </ChartStyle>

    );
};

export default ResponseStackedBarChart;
