import React from 'react';
import * as d3 from 'd3';
import createSvgCanvas from '../../../utils/CreateSvgCanvas';
import mRECISTObject from '../../../utils/mRECISTObject';


// default dimension and margin object
const DIMENSIONS = { width: 600, height: 250 };
const MARGIN = { top: 320, right: 100, bottom: 100, left: 380 };


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
};


/**
 * creates the plot
 * @param {Object} data - input data
 */
const createPlot = (data) => {

};


/**
 * Component function creates the histogram chart for the individual drug page
 */
const ResponseStackedHistogramChart = function ({
    individualDrugResponseData,
    dimensions = dimensions ?? DIMENSIONS,
    margin = margin ?? MARGIN,
}) {
    // get height and width from the dimensions object
    const { height, width } = dimensions;

    // transformed data object
    const transformedData = transformData(individualDrugResponseData[0]);

    // create plot
    createPlot(transformedData);

    return (
        <h1> Hello World </h1>
    );
};

export default ResponseStackedHistogramChart;
