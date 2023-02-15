import React, {
    useState, useEffect, useContext, useRef,
} from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import Select from 'react-select';
import styled from 'styled-components';
import PatientContext from '../../Context/PatientContext';
import BoxPlot from '../BoxPlot';
import colors from '../../../styles/colors';
import createToolTip from '../../../utils/ToolTip';
import { customStyles } from '../../Search/SearchStyle';
import isObject from '../../../utils/CheckIfAnObject';
import removeSomeSpecialCharacters from '../../../utils/RemoveSomeSpecialCharacters';

// heatmap wrapper div
const HeatMapWrapper = styled.div`
    display: flex;
    flex-direction: column;

    .selection-div {
        width: 150px;
        align-self: flex-end;
    }
`;

// wrapper id for the div that contains the heatmap
const WRAPPER_ID = 'heatmap-wrapper-div';

// control data array
const controlDrugs = ['untreated', 'water', 'control', 'h20'];

// selection options
const options = [
    { value: 'mRECIST', label: 'mRECIST' },
    { value: 'Slope', label: 'Slope' },
    { value: 'Best Average Response', label: 'Best Average Response' },
    { value: 'AUC', label: 'AUC' },
];

const targetColor = {
    CR: `${colors.blue}`,
    PR: `${colors.green}`,
    SD: `${colors.yellow}`,
    PD: `${colors.red}`,
    NA: `${colors.lightgray}`,
};

// create link to growth curve component/page
const createGrowthCurveRedirection = (response, responseList, patient, drug, dataset) => {
    if ((responseList.includes(response) && response !== 'NA') || Number(response)) {
        return `/curve?patient=${patient}&drug=${drug}&dataset=${dataset}`;
    }
    return '/';
};

// calculates the min and max value of the response type.
const calculateMinMax = (data, responseType) => {
    let min = 0;
    let max = 0;
    data.forEach((row) => {
        const keys = Object.keys(row);
        keys.forEach((val) => {
            if (Number(row[val][responseType]) > max) {
                max = Number(row[val][responseType]);
            }
            if (Number(row[val][responseType]) < min) {
                min = Number(row[val][responseType]);
            }
        });
    });
    return [min, max];
};

// updates/make the tooltip visible
const makeToolTipVisible = (tooltip) => tooltip
    .style('left', `${d3.event.pageX + 10}px`)
    .style('top', `${d3.event.pageY + 10}px`)
    .style('visibility', 'visible');

const addDataToTooltip = (tooltip, data) => {
    let tooltipData = [];
    let tooltipHTML = '';

    if (isObject(data)) {
        tooltipData = Object.keys(data);
        tooltipHTML = (d) => `<b>${d}</b> : ${data[d]}`;
    } else if (Array.isArray(data)) {
        tooltipData = data;
        tooltipHTML = (d) => d;
    }

    tooltip
        .selectAll('div')
        .data(tooltipData)
        .join('div')
        .html(tooltipHTML)
        .style('font-size', '12px');
};

// scale for heatmap rectangle or legends
const createLinearColorScale = (min, max) => d3.scaleLinear()
    .domain([min, 0, max])
    .range([`${colors.green_gradient}`, `${colors.white_gradient}`, `${colors.amber_gradient}`]);

// function to color the rectangles based on the
const fillRectangleColor = (response, responseType, scale) => {
    // this is when the response type is mRECIST
    // and response is 'CR', 'PR', 'SD', 'PD'
    if (responseType === 'mRECIST' || response === 'NA') {
        return targetColor[response];
    }

    // if the response type is slope, BAR or AUC
    return scale(response);
};

// function creates the basic skeleton of the heatmap
const createHeatMapSkeleton = (
    skeleton, drugNameList, patientNameList, datasetId, responseType, responseData,
    rectHeight, rectWidth, colorScale, tooltip, targetColorObject,
) => {
    for (let drugIndex = 0; drugIndex < drugNameList.length; drugIndex++) {
        const drug = drugNameList[drugIndex];

        const drugGroup = skeleton
            .append('g')
            .attr('id', `rectangle-drug-group-${removeSomeSpecialCharacters(drug)}`);

        const drugHighlightGroup = skeleton
            .append('g')
            .attr('id', `drug-highlight-group-${removeSomeSpecialCharacters(drug)}`);

        for (let patientIndex = 0; patientIndex < patientNameList.length; patientIndex++) {
            const patient = patientNameList[patientIndex];
            const response = responseData[drug][patient][responseType];

            // creates the main rectangles for the plot
            drugGroup
                .append('a')
                .attr('xlink:href', () => createGrowthCurveRedirection(
                    response, Object.keys(targetColorObject), patient, drug, datasetId,
                ))
                .append('rect')
                .attr('x', patientIndex * rectWidth)
                .attr('y', drugIndex * rectHeight)
                .attr('width', rectWidth - 2)
                .attr('height', rectHeight - 2)
                .attr('fill', fillRectangleColor(response, responseType, colorScale))
                .attr('id', `rectangle-${removeSomeSpecialCharacters(drug)}-${patient}`);

            // creates the highlight to be displayed when the user
            // hovers over the drug (make the selection visible)
            drugHighlightGroup
                .append('rect')
                .attr('x', patientIndex * rectWidth)
                .attr('y', drugIndex * rectHeight)
                .attr('width', rectWidth - 2)
                .attr('height', rectHeight - 2)
                .attr('fill', 'grey')
                .attr('opacity', '0.0')
                .attr('id', `rectangle-highlight-${removeSomeSpecialCharacters(drug)}-${patient}`)
                .on('mouseover', () => {
                    // text for the tooltip
                    const tooltipText = {
                        Patient: patient,
                        Drug: drug,
                        Response: response,
                    };
                    // updates the tooltip to set the position and make it visible
                    const updatedTooltip = makeToolTipVisible(tooltip);
                    // add the tooltip data
                    addDataToTooltip(updatedTooltip, tooltipText);

                    d3.selectAll(`rect[id^='rectangle-highlight'][id$='${patient}']`)
                        .attr('opacity', '0.5');
                })
                .on('mouseout', () => {
                    tooltip
                        .style('visibility', 'hidden');

                    // set the visibility to visible.
                    d3.selectAll(`rect[id^='rectangle-highlight'][id$='${patient}']`)
                        .attr('opacity', '0.0');
                });
        }
    }
};

// scales for patient label/axis on the top of the heatmap
const createPatientLabelScale = (patientList, canvasWidth) => (
    d3.scaleBand()
        .domain(patientList)
        .range([0, canvasWidth])
);

const createPatientXAxis = (svg, patientScale, datasetId) => {
    const axis = d3.axisTop(patientScale);

    svg.append('g')
        .attr('id', 'patient-axis-group')
        .attr('stroke-width', '0')
        .style('text-anchor', (Number(datasetId) === 7 ? 'start' : 'middle'))
        .call(axis)
        .selectAll('text')
        .style('font-size', '11px')
        .attr('transform', 'rotate(-90)')
        .attr('font-weight', '550')
        .attr('fill', `${colors['--main-font-color']}`)
        .attr('x', (Number(datasetId) === 7 ? '10px' : '40px'))
        .attr('y', '.15em');
};

// scales for patient label/axis on the top of the heatmap
const createDrugLabelScale = (drugNameList, canvasHeight) => (
    d3.scaleBand()
        .domain(drugNameList)
        .range([0, canvasHeight])
);

const createDrugYAxis = (svg, drugScale) => {
    const axis = d3.axisLeft(drugScale);

    svg.append('g')
        .attr('id', 'drug-axis-group')
        .attr('stroke-width', '0')
        .call(axis)
        .selectAll('text')
        .style('font-size', '11px')
        .attr('font-weight', (drug) => {
            if (controlDrugs.includes(drug.toLowerCase())) {
                return '700';
            }
            return '500';
        })
        .attr('fill', (drug) => {
            if (controlDrugs.includes(drug.toLowerCase())) {
                return `${colors.pink_header}`;
            }
            return `${colors['--main-font-color']}`;
        })
        .on('mouseover', (drug) => {
            // remove the biomarker and sorting labels
            // that are already selected (selected class!)
            d3.selectAll('text[id*="sorting-label"][class="selected"]')
                .style('visibility', 'hidden')
                .classed('selected', false);

            d3.selectAll('[id*="biomarker-label"][class="selected"]')
                .style('visibility', 'hidden')
                .classed('selected', false);

            // transforms the drug label group
            d3.select('#drug-axis-group')
                .attr('transform', 'translate(-40, 0)');

            // change the visibility for the corresponding
            // biomarker and sorting label to visible.
            d3.select(`#biomarker-label-for-${removeSomeSpecialCharacters(drug)}`)
                .style('visibility', 'visible')
                .classed('selected', true);

            d3.select(`#sorting-label-for-${removeSomeSpecialCharacters(drug)}`)
                .style('visibility', 'visible')
                .classed('selected', true);

            // select the rectangles with highlight as hidden for the
            // corresponding drug highlight group
            d3
                .selectAll(`rect[id*='rectangle-highlight-${removeSomeSpecialCharacters(drug)}-']`)
                .attr('opacity', '0.5');
        })
        .on('mouseout', (drug) => {
            // hides the group again
            d3
                .selectAll(`rect[id*='rectangle-highlight-${removeSomeSpecialCharacters(drug)}-']`)
                .attr('opacity', '0.0');
        });
};

// biomarker label to redirect to the biomarker page.
const createBiomarkerLabel = (svg, drugNameList, geneList, rectHeight, tooltip) => {
    svg.append('g')
        .attr('id', 'biomarker-label-group')
        .selectAll('a')
        .data(drugNameList)
        .join('a')
        .attr('xlink:href', (d) => (
            geneList.length > 0
                ? `/biomarker?geneList=${geneList.join(',')}&drugList=${drugNameList}&selectedDrug=${d}`
                : `/biomarker?selectedDrug=${d}`
        ))
        .append('text')
        .text('⭕️')
        .attr('font-size', '0.8em')
        .attr('x', -20)
        .attr('y', (_, i) => (i + 0.70) * rectHeight)
        .attr('id', (d) => `biomarker-label-for-${removeSomeSpecialCharacters(d)}`)
        .style('visibility', 'hidden')
        .on('mouseover', () => {
            // add a tooltip on mouseover
            const tooltipData = ['Redirect to biomarker page'];
            const biomarkerToolTip = makeToolTipVisible(tooltip);
            addDataToTooltip(biomarkerToolTip, tooltipData);
        })
        .on('mouseout', () => {
            tooltip
                .style('visibility', 'hidden');
        });
};

// creates the label/triangle to sort the row based on the recist value
const createSortingLabel = (svg, drugNameList, rectHeight, tooltip) => {
    svg
        .append('g')
        .attr('id', 'sorting-label-group')
        .selectAll('text')
        .data(drugNameList)
        .join('text')
        .text('🔺')
        .attr('font-size', '1em')
        .attr('x', -45)
        .attr('y', (_, i) => (i + 0.70) * rectHeight)
        .attr('id', (d) => `sorting-label-for-${removeSomeSpecialCharacters(d)}`)
        .style('visibility', 'hidden')
        .on('mouseover', () => {
            // add a tooltip on mouseover
            const tooltipData = ['Click to sort'];
            const sortingToolTip = makeToolTipVisible(tooltip);
            addDataToTooltip(sortingToolTip, tooltipData);
        })
        .on('mouseout', () => {
            tooltip
                .style('visibility', 'hidden');
        }); // TODO: add event listener to sort
};

// creating legend for the response type except for mRECIST.
function createLegend(svg, height, width, rectHeight, rectWidth, min, max, drug) {
    const defs = svg.append('defs');

    const linearGradient = defs.append('linearGradient')
        .attr('id', 'linear-gradient');

    // Vertical gradient
    linearGradient
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

    // Set the color for the start (0%)
    linearGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', `${colors.amber_gradient}`);

    // Set the color for the start (50%)
    linearGradient.append('stop')
        .attr('offset', min < 0 ? '50%' : '100%')
        .attr('stop-color', `${colors.white_gradient}`);

    // Set the color for the end (100%)
    if (min < 0) {
        linearGradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', `${colors.green_gradient}`);
    }

    // Draw the rectangle and fill with gradient
    const heightConstant = drug.length > 4 ? 3 : 2.5;
    svg.append('rect')
        .attr('x', width + (rectWidth * 8))
        .attr('y', height / 3)
        .attr('width', rectHeight)
        .attr('height', rectHeight * heightConstant)
        .style('fill', 'url(#linear-gradient)');

    // legend value.
    const targetRect = svg.append('g')
        .attr('id', 'linear-gradient-label-group');

    const legendValue = [max, min];
    targetRect.selectAll('text')
        .data(legendValue)
        .enter()
        .append('text')
        .attr('x', width + (rectWidth * 8))
        .attr('y', (d, i) => [height / 3 - 5, height / 3 + (rectHeight * heightConstant) + 12][i])
        .text((d) => d)
        .attr('font-size', '12px')
        .style('text-anchor', 'start');
}

// create mRECIST legend
const createmRECISTLegend = (
    svg, targetColorObject, rectHeight, rectWidth,
    canvasHeight, canvasWidth, margin,
) => {
    const mRECISTArray = Object.keys(targetColorObject);
    const targetRect = svg.append('g')
        .attr('id', 'mrecist-legend-group');

    targetRect
        .selectAll('rect')
        .data(mRECISTArray)
        .join('rect')
        .attr('x', canvasWidth + margin.right / 2)
        .attr('y', (d, i) => (
            canvasHeight > rectHeight * 3
                ? (canvasHeight / 3 + i * rectHeight * 0.75)
                : (canvasHeight / 6 + i * rectHeight * 0.75)
        ))
        .attr('height', rectWidth)
        .attr('width', rectWidth)
        .attr('fill', (d) => targetColorObject[d]);

    targetRect
        .selectAll('text')
        .data(mRECISTArray)
        .join('text')
        .attr('x', canvasWidth + margin.right / 2 + 20)
        .attr('y', (d, i) => (
            canvasHeight > rectHeight * 3
                ? (canvasHeight / 3 + i * rectHeight * 0.75 + 12)
                : (canvasHeight / 6 + i * rectHeight * 0.75 + 12)
        ))
        .text((d) => d)
        .attr('fill', `${colors['--main-font-color']}`)
        .attr('font-size', '12px');
};

// creates the data to plot bar charts on the right of the heatmap
const createDrugBarChartData = (data) => {
    const chartData = {};

    Object.entries(data).forEach(([drug, patientInformationObject]) => {
        // creates a drug object for each drug
        chartData[drug] = {
            CR: 0, PR: 0, SD: 0, PD: 0, NA: 0, total: 0,
        };
        // grab the response values and update the corresponding drug object
        Object.values(patientInformationObject).forEach((patientResponse) => {
            const mRECISTResponse = patientResponse.mRECIST;
            chartData[drug][mRECISTResponse] += 1;

            if (mRECISTResponse !== 'NA') {
                chartData[drug].total += 1;
            }
        });
    });

    return chartData;
};

// creates the data to plot bar charts on the top of the heatmap
const createPatientBarChartData = (data) => {
    const chartData = {};

    Object.values(data).forEach((patientInformation) => {
        Object.entries(patientInformation).forEach(([patient, responseObject]) => {
            const mRECISTResponse = responseObject.mRECIST;

            if (!(patient in chartData)) {
                chartData[patient] = {
                    CR: 0, PR: 0, SD: 0, PD: 0, NA: 0, total: 0,
                };
            }
            chartData[patient][mRECISTResponse] += 1;

            if (mRECISTResponse !== 'NA') {
                chartData[patient].total += 1;
            }
        });
    });

    return chartData;
};

// finds the maximum total count of the response for a particular type either drug or patient
const calculateMaximumTotalValue = (data) => data.reduce((max, current) => (
    current.total > max
        ? current.total
        : max
), 0);

// creates the axes for the drug bar plot
const createDrugBarPlotAxes = (heatmapGroupingElement, mainPlotWidth, scale) => {
    const canvas = heatmapGroupingElement
        .append('g')
        .attr('transform', `translate(${mainPlotWidth + 10}, 0)`);

    const axis = d3
        .axisTop(scale)
        .ticks(4);

    canvas.call(axis);
};

// functions to create sidebar plots for drug and patient evaluations
const drugStackedBarplots = (
    heatmapGroupingElement, drugBarChartData, responseEnteries,
    mainPlotWidth, mainPlotHeight, rectHeight,
) => {
    const maxTotalValueInDataObject = calculateMaximumTotalValue(
        Object.values(drugBarChartData),
    );

    const barplotWidth = 60;

    const scale = d3.scaleLinear()
        .domain([0, maxTotalValueInDataObject])
        .range([0, barplotWidth]);

    const plotGroupElement = heatmapGroupingElement.append('g')
        .attr('id', 'drug-barplot-group');

    // creates the outer box for the plot
    heatmapGroupingElement
        .append('g')
        .attr('id', 'drug-barplots-outliner')
        .append('rect')
        .attr('x', mainPlotWidth + 10)
        .attr('y', 0)
        .attr('width', barplotWidth + 1)
        .attr('height', mainPlotHeight)
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .style('fill', 'none');

    // creates the individual stacked bar plot for each drug
    Object
        .values(drugBarChartData)
        .forEach((drugResponseObject, drugObjectIndex) => {
            let currentX = mainPlotWidth + 10;
            responseEnteries.forEach((response) => {
                plotGroupElement
                    .append('rect')
                    .attr('x', currentX)
                    .attr('y', rectHeight * drugObjectIndex)
                    .attr('width', scale(drugResponseObject[response]))
                    .attr('height', rectHeight - 4)
                    .attr('fill', targetColor[response]);

                currentX += scale(drugResponseObject[response]);
            });
        });

    // creates an axis for the plot
    createDrugBarPlotAxes(heatmapGroupingElement, mainPlotWidth, scale);
};

// creates the axes for the drug bar plot
const createPatientBarPlotAxes = (
    heatmapGroupingElement, maxTotalValueInDataObject, barplotHeight,
) => {
    const scale = d3.scaleLinear()
        .domain([0, maxTotalValueInDataObject])
        .range([barplotHeight, 0]);

    const canvas = heatmapGroupingElement
        .append('g')
        .attr('transform', `translate(-2, -160)`);

    const axis = d3
        .axisLeft(scale)
        .ticks(3);

    canvas.call(axis);
};

const patientStackedBarplots = (
    heatmapGroupingElement, patientBarChartData, responseEnteries, rectWidth, mainPlotWidth,
) => {
    const maxTotalValueInDataObject = calculateMaximumTotalValue(
        Object.values(patientBarChartData),
    );

    const barplotHeight = 80;

    const scale = d3.scaleLinear()
        .domain([0, maxTotalValueInDataObject])
        .range([0, barplotHeight]);

    const plotGroupElement = heatmapGroupingElement.append('g')
        .attr('id', 'patient-barplot-group');

    // creates the outer box for the plot
    heatmapGroupingElement
        .append('g')
        .attr('id', 'drug-barplots-outliner')
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', mainPlotWidth)
        .attr('height', barplotHeight)
        .style('fill', 'none')
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .attr('transform', 'translate(-2, -160)');

    // creates the individual stacked bar plot for each patient
    Object
        .values(patientBarChartData)
        .forEach((patientResponseObject, patientObjectIndex) => {
            let currentY = 0;

            responseEnteries.forEach((response) => {
                const responseValue = patientResponseObject[response];

                plotGroupElement
                    .append('rect')
                    .attr('x', (patientObjectIndex * rectWidth) - 2)
                    .attr('y', currentY - scale(responseValue))
                    .attr('width', rectWidth - 2)
                    .attr('height', scale(responseValue))
                    .attr('fill', targetColor[response])
                    .attr('transform', 'translate(0, -80)');

                currentY -= scale(responseValue);
            });
        });

    // creates an axes for the plot
    createPatientBarPlotAxes(heatmapGroupingElement, maxTotalValueInDataObject, barplotHeight);
};

// creates dotted lines
const createDottedLinesPerPatient = (
    heatmapGroupingElement, patientNameList, plotHeight, rectWidth,
) => {
    const dottedLinesGroup = heatmapGroupingElement
        .append('g')
        .attr('id', 'dotted-lines-group');

    for (let patientIndex = 0; patientIndex <= patientNameList.length; patientIndex++) {
        dottedLinesGroup
            .append('line')
            .style('stroke', `${colors.lightgray}`)
            .style('stroke-dasharray', '3 2')
            .style('stroke-width', 1)
            .attr('x1', patientIndex * rectWidth - 1)
            .attr('y1', plotHeight - 1)
            .attr('x2', patientIndex * rectWidth - 1)
            .attr('y2', plotHeight + 50 - 1)
            .attr('id', `dotted-line-${patientNameList[patientIndex]}`);
    }
};

/**
 * the function creates the heatmap structure, labels, axes etc.
 * @param {Object} props - props object
 * @param {String} responseType - response type string
 */
const createHeatMap = (props, responseType) => {
    const {
        margin,
        dimensions,
        data: responseData,
        dataset: datasetId,
        drugId: drugNameList,
        geneList,
        patientId: patientNameList,
        className: plotId,
        isResponseComponent,
    } = props;

    const responseDataValues = Object.values(responseData);

    // rectangle height and width
    const rectHeight = dimensions.height;
    const rectWidth = dimensions.width;

    // plot height and width
    const plotHeight = rectHeight * drugNameList.length;
    const plotWidth = rectWidth * patientNameList.length;

    // create SVG element for the heatmap
    // remove if the svg is element is already there
    if (!d3.select(`#${plotId}`).empty()) {
        d3.select(`#${plotId}`).remove();
    }

    d3.select(`#heatmap-svg`)
        .attr('width', plotWidth + margin.left + margin.right)
        .attr('height', plotHeight + margin.top + margin.bottom);

    const svgGroupElement = d3.select('#heatmap-svg-group')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const heatmapGroupingElement = svgGroupElement
        .append('g')
        .attr('id', `${plotId}`);

    // creates the skeleton and add a grouping element
    const skeleton = heatmapGroupingElement
        .append('g')
        .attr('id', 'skeleton');

    // initialize the tooltip
    const tooltip = createToolTip(WRAPPER_ID);

    // grabs the min and max value for a response type in the response data
    const [min, max] = calculateMinMax(responseDataValues, responseType);

    // color scale
    const linearColorScale = createLinearColorScale(min, max);

    // creates the rectangles for the heatmap
    createHeatMapSkeleton(
        skeleton, drugNameList, patientNameList, datasetId, responseType,
        responseData, rectHeight, rectWidth, linearColorScale,
        tooltip, targetColor,
    );

    // patient scale and axis
    const patientLabelScale = createPatientLabelScale(patientNameList, plotWidth);
    createPatientXAxis(heatmapGroupingElement, patientLabelScale, datasetId);

    // drug scale and axis
    const drugLabelScale = createDrugLabelScale(drugNameList, plotHeight);
    createDrugYAxis(heatmapGroupingElement, drugLabelScale);

    // create biomarker label/circle to redirect to the biomarker page.
    createBiomarkerLabel(heatmapGroupingElement, drugNameList, geneList, rectHeight, tooltip);

    // create sorting label/triangle to sort the respective row for the drug.
    createSortingLabel(heatmapGroupingElement, drugNameList, rectHeight, tooltip);

    // creates the legend
    if (responseType === 'mRECIST') {
        createmRECISTLegend(
            heatmapGroupingElement, targetColor, rectHeight,
            rectWidth, plotHeight, plotWidth, margin,
        );
    } else {
        createLegend(
            heatmapGroupingElement, plotHeight, plotWidth,
            rectHeight, rectWidth, min, max, drugNameList,
        );
    }

    if (responseType === 'mRECIST') {
        // create data for the barplot on the top and right of the heatmap.
        // barplots depict the total number of responses (mRECIST) for a drug/patient.
        const drugBarChartData = createDrugBarChartData(responseData);
        const patientBarChartData = createPatientBarChartData(responseData);
        const responseEnteries = Object.keys(targetColor).filter((el) => el !== 'NA');

        // plots the patient and drug bar plots
        patientStackedBarplots(
            heatmapGroupingElement, patientBarChartData,
            responseEnteries, rectWidth, plotWidth,
        );
        drugStackedBarplots(
            heatmapGroupingElement, drugBarChartData, responseEnteries,
            plotWidth, plotHeight, rectHeight,
        );
    }

    // create dotted lines at the end of the heatmap
    // that connects dotted lines present at the start of oncoprint lines.
    if (!isResponseComponent) {
        createDottedLinesPerPatient(heatmapGroupingElement, patientNameList, plotHeight, rectWidth);
    }
};

/**
 * **************************************************************************************
 * ****************************** Main Component (Heatmap) ******************************
 * **************************************************************************************
 */
const HeatMap = (props) => {
    const [responseType, setResponseType] = useState('mRECIST');
    const { drugId: drugNameList, data, patientId: patientNameList } = props;
    const patientContext = useContext(PatientContext);
    const heatmapSvgGroupRef = useRef(null);

    // also removes boxplot if it's present
    if (!d3.select(`#boxplot`).empty()) {
        d3.select(`#boxplot`).remove();
    }

    useEffect(() => {
        createHeatMap(props, responseType);
    }, [props, responseType]);

    return (
        <HeatMapWrapper>
            <Select
                options={options}
                styles={customStyles}
                onChange={(d) => setResponseType(d.value)}
                className='selection-div'
                defaultValue={{ value: 'mRECIST', label: 'mRECIST' }}
            />
            <div id={WRAPPER_ID}>
                <svg id='heatmap-svg'>
                    <g id='heatmap-svg-group' ref={heatmapSvgGroupRef}> </g>
                </svg>
            </div>
            {
                responseType !== 'mRECIST'
                    ? (
                        <BoxPlot
                            response={responseType}
                            data={Object.values(data)}
                            patients={patientNameList}
                            drugs={drugNameList}
                            heatmapSvgGroupRef={heatmapSvgGroupRef}
                        />
                    )
                    : <div />
            }
        </HeatMapWrapper>
    );
};

HeatMap.propTypes = {
    className: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    dataset: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    dimensions: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number,
    }).isRequired,
    drugId: PropTypes.arrayOf(PropTypes.string).isRequired,
    geneList: PropTypes.arrayOf(PropTypes.string).isRequired,
    margin: PropTypes.shape({
        top: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
        left: PropTypes.number,
    }).isRequired,
    patientId: PropTypes.arrayOf(PropTypes.string).isRequired,
    isResponseComponent: PropTypes.bool,
};

export default HeatMap;
