import React, { useState, useEffect } from 'react';
import DonutChart from '../../Plots/DonutChart';


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
    Object.values(data).forEach(element => {
        if (typeof (element) === 'object') {
            element.mRECIST.forEach(value => {
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
    });
    // return the values for the object
    return Object.values(finalData);
};


// main component
const PatientResponsePieChart = ({ data }) => {
    // set the data states
    const [responseData, setResponseData] = useState([]);

    useEffect(() => {
        // get the transformed data
        const transformedData = transformData(data);
        // set data state
        setResponseData(transformedData);
    }, [data]);

    return (
        responseData.length === 0 ? '' :
            <DonutChart
                data={responseData}
                chartId='patient-response-donut'
                tooltipMapper={mapper}
            />
    );
};

export default PatientResponsePieChart;
