import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import colors from '../../styles/colors';

// parsing the initial data.
const parseData = (data, response, drugs) => {
    const parsedPatientData = {};
    const parsedDrugData = {};
    let minTotal = 0;
    let maxTotal = 0;

    data.forEach((element, i) => {
        // creates an array for each drug.
        parsedDrugData[drugs[i]] = [];

        Object.keys(element).forEach((patient) => {
            const value = element[patient][response];

            if (Number(value) > maxTotal) {
                maxTotal = Number(value);
            }

            if (Number(value) < minTotal) {
                minTotal = Number(value);
            }

            if (!parsedPatientData[patient]) {
                parsedPatientData[patient] = [];
            }

            if (value !== undefined && value !== 'NA' && value !== 'empty') {
                parsedPatientData[patient].push(Number(value));
                parsedDrugData[drugs[i]].push(Number(value));
            }
        });
    });

    return {
        parsedPatientData, minTotal, maxTotal, parsedDrugData,
    };
};

// initialize the dimensions and margins.
const initialize = () => {
    const margin = {
        top: 1, right: 1, bottom: 1, left: 1,
    };
    const patientWidth = 14 - margin.left - margin.right;
    const patientHeight = 100 - margin.top - margin.bottom;
    const drugWidth = 70 - margin.left - margin.right;
    const drugHeight = 30 - margin.top - margin.bottom;

    return {
        margin,
        patientHeight,
        patientWidth,
        drugHeight,
        drugWidth,
    };
};

// remove the elements before creating new ones.
const removeElements = (plotId) => {
    d3.select(`#${plotId}`).remove();
};

// scaling min and max values to 0 and 1 correspondingly.
const maxMinScale = (min, max) => d3.scaleLinear()
    .domain([min, max])
    .range([0, 1]);

// scale for y-axis. 0,1 mapped to height, 0.
const mapYScale = (height, min, max) => {
    const dataScale = maxMinScale(min, max);

    return d3.scaleLinear()
        .domain([dataScale(min), dataScale(max)])
        .range([height - 2, 3]);
};

// scale for x axis.
const mapXScale = (width, min, max) => {
    const dataScale = maxMinScale(min, max);

    return d3.scaleLinear()
        .domain([dataScale(min), dataScale(max)])
        .range([2, width - 2]);
};

// create y axis.
const yAxis = (groupElement, linearscale) => {
    const axis = d3.axisLeft()
        .scale(linearscale)
        .ticks(7)
        .tickSize(0);

    groupElement
        .append('g')
        .attr('transform', 'translate(0, -180)')
        .attr('id', 'y-axis-group')
        .call(axis);
};

// create x axis.
const xAxis = (groupElement, xscale, patientSvgWidth) => {
    const axis = d3.axisTop()
        .scale(xscale)
        .ticks(3)
        .tickSize(0);

    groupElement
        .append('g')
        .attr('transform', `translate(${patientSvgWidth + 20}, 0)`)
        .attr('id', 'x-axis-group')
        .call(axis);
};

// create a rectangle outside the box plots.
const createRectangle = (groupElement, width, height) => {
    const rect = groupElement
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('stroke', `${colors.black}`)
        .attr('stroke-width', 1.0)
        .style('fill', `${colors.white}`);

    return rect;
};

// append svg to the div element.
const appendGElementPatient = (svg, margin, width, i, patient) => svg
    .append('g')
    .attr('transform',
        `translate(${(width + margin.left + margin.right) * i},${margin.top})`)
    .style('background-color', 'grey')
    .attr('id', `boxplotbody-${patient}`);

// append svg for the drugs box plot.
const appendGElementDrug = (svg, margin, height, i, drug) => svg
    .append('g')
    .attr('transform', `translate(0, ${(height + margin.top + margin.bottom) * i})`)
    .attr('id', `boxplotbody-${drug}`);

// Compute summary statistics used for the box:
const computeStats = (data) => {
    const newData = data.map((element) => (Number.isNaN(element) ? 0 : element));
    const sortedData = newData.sort(d3.ascending);
    const q1 = d3.quantile(sortedData, 0.25);
    const median = d3.quantile(sortedData, 0.5);
    const q3 = d3.quantile(sortedData, 0.75);
    // const interQuantileRange = q3 - q1;
    // const min = q1 - 1.5 * interQuantileRange;
    // const max = q1 + 1.5 * interQuantileRange;
    const min = d3.min(sortedData);
    const max = d3.max(sortedData);

    return {
        sortedData,
        min,
        q1,
        median,
        q3,
        max,
    };
};

// create main vertical line patient box plot.
const verticalLine = (width, min, max, svg, y, scale) => {
    svg
        .append('line')
        .attr('x1', width / 2)
        .attr('x2', width / 2)
        .attr('y1', y(scale(min)))
        .attr('y2', y(scale(max)))
        .attr('stroke', `${colors.black}`)
        .attr('stroke-width', 0.50);
};

// creates the horizontal line for drug box plot.
const horizontalLine = (height, min, max, svg, x, scale) => {
    svg
        .append('line')
        .attr('y1', height / 2)
        .attr('y2', height / 2)
        .attr('x1', x(scale(min)))
        .attr('x2', x(scale(max)))
        .attr('stroke', `${colors.black}`)
        .attr('stroke-width', 0.50);
};

// create box for patients.
const createPatientBox = (svg, margin, width, q3, q1, y, element, scale) => {
    svg
        .append('rect')
        .attr('x', margin.left)
        .attr('y', y(scale(q3)) || 0)
        .attr('height', (y(scale(q1)) - y(scale(q3))) || 0)
        .attr('width', width)
        .attr('stroke', `${colors.black}`)
        .attr('stroke-width', 0.50)
        .style('fill', '#8CC0DE')
        .attr('id', `box${element}`);
};

// create box for drugs.
const createDrugBox = (svg, margin, height, q3, q1, x, element, scale) => {
    svg
        .append('rect')
        .attr('x', x(scale(q1)) || 0)
        .attr('y', margin.top)
        .attr('height', height)
        .attr('width', (x(scale(q3)) - x(scale(q1))) || 0)
        .attr('stroke', `${colors.black}`)
        .attr('stroke-width', 0.50)
        .style('fill', '#8CC0DE')
        .attr('id', `box${element}`);
};

// create median, min and max horizontal lines for patient box plot.
const createPatientRest = (svg, min, median, max, width, y, scale) => {
    svg
        .selectAll('total')
        .data([min, median, max])
        .enter()
        .append('line')
        .attr('x1', 1)
        .attr('x2', width + 1)
        .attr('y1', (d) => (y(scale(d))))
        .attr('y2', (d) => (y(scale(d))))
        .attr('stroke', `${colors.black}`)
        .attr('stroke-width', 0.50);
};

// create median, min and max vertical lines for drug box plot.
const createDrugRest = (svg, min, median, max, height, x, scale) => {
    svg
        .selectAll('total')
        .data([min, median, max])
        .enter()
        .append('line')
        .attr('x1', (d) => (x(scale(d))))
        .attr('x2', (d) => (x(scale(d))))
        .attr('y1', 1)
        .attr('y2', height + 1)
        .attr('stroke', `${colors.black}`)
        .attr('stroke-width', 0.50);
};

const BoxPlot = (props) => {
    const PLOT_ID = 'boxplot';

    // destructuring the props.
    const {
        data, response, patients, drugs, heatmapSvgGroupRef,
    } = props;

    // parsing the data.
    const {
        parsedPatientData, minTotal, maxTotal, parsedDrugData,
    } = parseData(data, response, drugs);

    // get number of patients.
    const totalPatients = Object.keys(parsedPatientData).length;

    // initialize dimensions.
    const {
        patientWidth, patientHeight, margin, drugHeight, drugWidth,
    } = initialize();

    // svg width.
    const patientSvgWidth = (patientWidth + margin.left + margin.right) * totalPatients;
    const patientSvgHeight = patientHeight + margin.bottom + margin.top;
    const drugSvgWidth = drugWidth + margin.left + margin.right;
    const drugSvgHeight = (drugHeight + margin.bottom + margin.top) * drugs.length;

    // use effect function once the component is mounted/updated.
    useEffect(() => {
        // to remove the elements.
        removeElements(PLOT_ID);

        // group element
        const groupElement = d3.select(heatmapSvgGroupRef.current)
            .append('g')
            .attr('id', `${PLOT_ID}`);

        // scale.
        const dataScale = maxMinScale(minTotal, maxTotal);
        const yScale = mapYScale(patientHeight, minTotal, maxTotal);
        const xScale = mapXScale(drugWidth, minTotal, maxTotal);

        // x and y axis.
        yAxis(groupElement, yScale);
        xAxis(groupElement, xScale, patientSvgWidth);

        // creating reactangle around the svgs.
        createRectangle(groupElement, patientSvgWidth, patientSvgHeight).attr('transform', 'translate(0, -180)');
        createRectangle(groupElement, drugSvgWidth, drugSvgHeight).attr('transform', `translate(${patientSvgWidth + 20}, 0)`);

        // create a box plot for each of the patient.
        const patientKeys = patients.length === 0 ? Object.keys(parsedPatientData) : patients;

        const patientPlotGroup = groupElement
            .append('g')
            .attr('id', 'patient-plot-group')
            .attr('transform', 'translate(0, -180)');

        patientKeys.forEach((patient, i) => {
            // append g element to svg for each patient.
            const svg = appendGElementPatient(patientPlotGroup, margin, patientWidth, i, patient);

            const plotData = parsedPatientData[patient];

            // compute stats.
            const {
                median, min, max,
                q1, q3,
            } = computeStats(plotData);

            // create vertical line.
            verticalLine(patientWidth, min, max, svg, yScale, dataScale);
            // create box.
            createPatientBox(svg, margin, patientWidth, q3, q1, yScale, patient, dataScale);
            // create rest of the elements.
            createPatientRest(svg, min, median, max, patientWidth, yScale, dataScale);
        });

        const drugPlotGroup = groupElement
            .append('g')
            .attr('id', 'patient-plot-group')
            .attr('transform', `translate(${patientSvgWidth + 20}, 0)`);

        // create a box plot for each of the drugs.
        drugs.forEach((drug, i) => {
            // append g element to svg for each patient.
            const svg = appendGElementDrug(drugPlotGroup, margin, drugHeight, i, drug);

            const plotData = parsedDrugData[drug];

            // compute stats.
            const {
                median, min, max,
                q1, q3,
            } = computeStats(plotData);

            // create vertical line.
            horizontalLine(drugHeight, min, max, svg, xScale, dataScale);
            // create box.
            createDrugBox(svg, margin, drugHeight, q3, q1, xScale, drug, dataScale);
            // create rest of the elements.
            createDrugRest(svg, min, median, max, drugHeight, xScale, dataScale);
        });
    });

    // return statement.
    return (
        <div />
    );
};

BoxPlot.propTypes = {
    response: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    patients: PropTypes.arrayOf(PropTypes.string).isRequired,
    drugs: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default BoxPlot;
