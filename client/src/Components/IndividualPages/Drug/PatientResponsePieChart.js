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
    let finalData = mRECISTObject;

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
const PatientResponsePieChart = ({ data, chartId, arcRadius, shouldDisplayLegend, opacity }) => {
    const transformedData = transformData(data, mRECISTObject);

    return (
        <DonutChart
            data={transformedData}
            chartId={chartId}
            arcRadius={arcRadius}
            tooltipMapper={mapper}
            colorMapper={mRECISTColorMapper}
            shouldDisplayLegend={shouldDisplayLegend}
            opacity={opacity}
        />
    );
};

export default PatientResponsePieChart;
