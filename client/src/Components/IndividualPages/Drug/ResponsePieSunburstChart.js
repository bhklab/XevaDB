import React, { useState, useEffect } from 'react';
import DonutChart from '../../Plots/DonutChart';
import OverlayArcs from './OverlayArcs';
import mRECISTColorMapper from '../../../utils/mRECISTColorMapper';
import SunburstPlot from '../../Plots/SunburstPlot';

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

/**
 * 
 * @param {Object} totalResponsedata 
 * @param {Object} individualDrugResponseData 
 * @returns {Array} - array of labels, parents and values
 */
const createSunburstPlotData = (totalResponsedata, individualDrugResponseData) => {
    let labels = [' '];
    let parents = [''];
    let values = [0];
    let colors = [];

    // get the data from total response first
    Object.values(totalResponsedata).forEach(response => {
        labels.push(response.id);
        parents.push(labels[0]);
        values.push(response.value);
        colors.push(mRECISTColorMapper[response.id]);
    });

    // get the values from individual drug response data
    Object.values(individualDrugResponseData).forEach(response => {
        if (response.value > 0) {
            labels.push(`${response.id} `);
            parents.push(response.id);
            values.push(response.value);
        }
    });

    return [labels, parents, values, colors];
};


// main component
const ResponsePieSunburstChart = ({ totalResponsedata, individualDrugResponseData }) => {
    // transformed data
    const transformedTotalResponseData = transformData(totalResponsedata, mRECISTObject);
    const transformedIndividualDrugResponseData = transformData(individualDrugResponseData, mRECISTObject);
    const [labels, parents, values, colors] = createSunburstPlotData(transformedTotalResponseData, transformedIndividualDrugResponseData);


    return (
        <>
            <div>
                <div style={{ position: 'absolute' }}>
                    <DonutChart
                        data={transformedTotalResponseData}
                        tooltipMapper={mapper}
                        colorMapper={mRECISTColorMapper}
                        chartId='model-response-all-drugs'
                        arcRadius={{ outerRadius: 280, innerRadius: 180 }}
                        dimensions={{ width: 600, height: 250 }}
                        margin={{ top: 320, right: 100, bottom: 100, left: 380 }}
                        shouldDisplayLegend={false}
                        shouldDisplayTextLabels={true}
                        opacity={0.2}
                    />
                </div>
                <div>
                    <OverlayArcs
                        totalResponseData={transformedTotalResponseData}
                        individualDrugResponseData={transformedIndividualDrugResponseData}
                        dimensions={{ width: 600, height: 250 }}
                        arcRadius={{ outerRadius: 280, innerRadius: 180 }}
                        margin={{ top: 320, right: 100, bottom: 100, left: 380 }}
                    />
                </div>
            </div>
            <div>
                <SunburstPlot
                    labels={labels}
                    parents={parents}
                    values={values}
                    sunburstcolorway={colors}
                />
            </div>
        </ >
    );
};

export default ResponsePieSunburstChart;
