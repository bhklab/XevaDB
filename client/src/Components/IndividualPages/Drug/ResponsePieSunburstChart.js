import React from 'react';
import styled from 'styled-components';
import DonutChart from '../../Plots/DonutChart';
import OverlayArcs from './OverlayArcs';
import mRECISTColorMapper from '../../../utils/mRECISTColorMapper';
import colors from '../../../styles/colors';
// import SunburstPlot from '../../Plots/SunburstPlot';

const NoteStyle = styled.div`
    font-size: 0.9em;
    font-style: italic;
    color: ${colors.red};
    margin: 0 0 70px 0;

    span {
        font-weight: 700;
    }
`;

// tooltip mapper to be passed as a Prop to the donut chart
const mapper = {
    Response: 'id',
    Models: 'value',
};

// initial mRECIST object
const mRECISTObject = {
    SD: { id: 'SD', value: 0 },
    PD: { id: 'PD', value: 0 },
    PR: { id: 'PR', value: 0 },
    CR: { id: 'CR', value: 0 },
};

/**
 *
 * @param {Object} data
 * @returns {Array} - an array of the transformed data
 */
const transformData = (data, mRECISTObject) => {
    // stores the final data
    const finalData = JSON.parse(JSON.stringify(mRECISTObject));

    // loops through data and prepare data based on the 'mRECIST' value
    data.forEach((element) => {
        Object.values(element).forEach((patientResponse) => {
            if (typeof (patientResponse) === 'object') {
                patientResponse.mRECIST.forEach((value) => {
                    if (value !== 'NA') {
                        finalData[value].value += 1;
                    }
                });
            }
        });
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
    const labels = [' '];
    const parents = [''];
    const values = [0];
    const colors = [];

    // get the data from total response first
    Object.values(totalResponsedata).forEach((response) => {
        labels.push(response.id);
        parents.push(labels[0]);
        values.push(response.value);
        colors.push(mRECISTColorMapper[response.id]);
    });

    // get the values from individual drug response data
    Object.values(individualDrugResponseData).forEach((response) => {
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
    // const [labels, parents, values, colors] = createSunburstPlotData(transformedTotalResponseData, transformedIndividualDrugResponseData);

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
                        dimensions={{ width: 500, height: 250 }}
                        margin={{
                            top: 320, right: 0, bottom: 50, left: 500,
                        }}
                        shouldDisplayLegend={false}
                        shouldDisplayTextLabels
                        opacity={0.2}
                    />
                </div>
                <div>
                    <OverlayArcs
                        totalResponseData={transformedTotalResponseData}
                        individualDrugResponseData={transformedIndividualDrugResponseData}
                        dimensions={{ width: 500, height: 250 }}
                        arcRadius={{ outerRadius: 280, innerRadius: 180 }}
                        margin={{
                            top: 320, right: 0, bottom: 50, left: 500,
                        }}
                    />
                </div>
                <NoteStyle>
                    <span> Note: </span>
                    {' '}
                    Light colored arcs represent the model responses in the complete database,
                    while the dark arcs represent the response model for the particular drug
                </NoteStyle>
            </div>
            {/* <div>
                <SunburstPlot
                    labels={labels}
                    parents={parents}
                    values={values}
                    sunburstcolorway={colors}
                />
            </div> */}
        </ >
    );
};

export default ResponsePieSunburstChart;
