import React, { useState, useEffect } from 'react';
import DonutChart from '../../Plots/DonutChart';
import mRECISTColorMapper from '../../../utils/mRECISTColorMapper';


// tooltip mapper to be passed as a Prop to the donut chart
const mapper = {
    'Response': 'id',
    'Models': 'value',
};

// initial mRECIST object
const mRECISTObject = {
    'SD': { id: 'SD', value: 0 },
    'PD': { id: 'PD', value: 0 },
    'PR': { id: 'PR', value: 0 },
    'CR': { id: 'CR', value: 0 },
};

/**
 * 
 * @param {Object} data 
 * @returns {Array} - an array of the transformed data
 */
const transformData = (data, mRECISTObject) => {
    // stores the final data
    let finalData = JSON.parse(JSON.stringify(mRECISTObject));

    // loops through data and prepare data based on the 'mRECIST' value
    data.forEach(element => {
        Object.values(element).forEach(patientResponse => {
            if (typeof (patientResponse) === 'object') {
                patientResponse.mRECIST.forEach(value => {
                    if (value !== 'NA') {
                        finalData[value].value += 1;
                    }
                })
            }
        })
    });

    // return the values for the object
    return Object.values(finalData);
};


// main component
const ResponsePieChart = ({ totalResponsedata, individualDrugResponseData }) => {
    // transformed data
    const transformedTotalResponseData = transformData(totalResponsedata, mRECISTObject);
    const transformedIndividualDrugResponseData = transformData(individualDrugResponseData, mRECISTObject);

    return (
        <DonutChart
            data={transformedTotalResponseData}
            tooltipMapper={mapper}
            colorMapper={mRECISTColorMapper}
            chartId='model-response-all-drugs'
            arcRadius={{ outerRadius: 280, innerRadius: 180 }}
            shouldDisplayLegend={true}
            shouldDisplayTextLabels={true}
            opacity={0.2}
        />
    );
};

export default ResponsePieChart;
