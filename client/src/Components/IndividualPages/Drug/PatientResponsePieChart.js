import React, { useState, useEffect } from 'react';
import DonutChart from '../../Plots/DonutChart';
import mRECISTColorMapper from '../../../utils/mRECISTColorMapper';


// tooltip mapper to be passed as a Prop to the donut chart
const mapper = {
    'Response': 'id',
    'Models': 'value',
};

/**
 * 
 * @param {Object} data 
 * @returns {Array} - an array of the transformed data
 */
const transformData = (data) => {
    // stores the final data
    let finalData = {};

    // loops through data and prepare data based on the 'mRECIST' value
    data.forEach(element => {
        Object.values(element).forEach(patientResponse => {
            if (typeof (patientResponse) === 'object') {
                patientResponse.mRECIST.forEach(value => {
                    if (value !== 'NA') {
                        if (finalData.hasOwnProperty(value)) {
                            finalData[value].value += 1;
                        } else {
                            finalData[value] = {
                                id: value,
                                parameter: 1,
                                value: 1,
                            }
                        }
                    }
                })
            }
        })
    });

    // return the values for the object
    return Object.values(finalData);
};


// main component
const PatientResponsePieChart = ({ data, chartId, arcRadius, shouldDisplayLegend }) => {
    const transformedData = transformData(data);

    return (
        <DonutChart
            data={transformedData}
            chartId={chartId}
            arcRadius={arcRadius}
            tooltipMapper={mapper}
            colorMapper={mRECISTColorMapper}
            shouldDisplayLegend={shouldDisplayLegend}
        />
    );
};

export default PatientResponsePieChart;
