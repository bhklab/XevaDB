import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

// parsing the initial data.
const parseData = (data, response) => {
    const parsedData = {};
    let minTotal = 0;
    let maxTotal = 0;

    data.forEach((element) => {
        Object.keys(element).forEach((patient) => {
            const value = element[patient][response];
            if (Number(value) > maxTotal) {
                maxTotal = value;
            }

            if (Number(value) < minTotal) {
                minTotal = value;
            }

            if (!parsedData[patient]) {
                parsedData[patient] = [];
            }
            parsedData[patient].push((value === undefined || value === 'NA' || value === 'empty') ? 0 : Number(value));
        });
    });
    return { parsedData, minTotal, maxTotal };
};


// checks for column data and checks for the number of NaN/enpty.
// if there are atleast 10 numbers in the array/list return true, else false.
const isDataPlotable = (data) => {
    // get the total number of numbers.
    const total = data.filter((element) => element !== 0);
    return total.length > 10;
};


// initialize the dimensions and margins.
const initialize = () => {
    const margin = {
        // top: 10, right: 10, bottom: 10, left: 20,
        top: 1, right: 1, bottom: 1, left: 1,
    };
    const width = 20 - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;

    return {
        margin,
        height,
        width,
    };
};

// create an svg.
const createSvg = (width, height) => {
    const svg = d3.select('#boxplot')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('transform', 'translate(220, 150)')
        .attr('id', 'boxplotsvg');

    return svg;
};


// create a rectangle outside the box plots.
const createRectangle = (svg, width, height) => {
    const rect = svg
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('stroke', 'black')
        .attr('stroke-width', 1.0)
        .style('fill', 'white');

    return rect;
};

// append svg to the div element.
const appendGElement = (svg, margin, width, i) => svg
    .append('g')
    .attr('transform',
        `translate(${(width + margin.left + margin.right) * i},${margin.top})`)
    .style('background-color', 'grey')
    .attr('id', 'boxplotbody');


// scale.
const yScale = (height, min, max) => d3.scaleLinear()
    .domain([min, max])
    .range([height, 0]);


// create y axis.
const yAxis = (scale, width, height, margin) => {
    const svg = d3.select('#boxplot')
        .append('svg')
        .attr('width', width + margin.left + margin.right + 10)
        .attr('height', height + margin.top + margin.bottom)
        .attr('transform', 'translate(220, 150)')
        .attr('id', 'boxplotsvg');

    const axis = d3.axisLeft()
        .scale(scale)
        .ticks(7)
        .tickSize(0);

    svg.append('g')
        .attr('transform', 'translate(30, 0)')
        .call(axis);
};


// Compute summary statistics used for the box:
const computeStats = (data) => {
    const newData = data.map((element) => (Number.isNaN(element) ? 0 : element));
    const sortedData = newData.sort(d3.ascending);
    const q1 = d3.quantile(sortedData, 0.25);
    const median = d3.quantile(sortedData, 0.5);
    const q3 = d3.quantile(sortedData, 0.75);
    const interQuantileRange = q3 - q1;
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


// create main vertical line.
const verticalLine = (width, min, max, svg, y) => {
    svg
        .append('line')
        .attr('x1', width / 2)
        .attr('x2', width / 2)
        .attr('y1', y(min))
        .attr('y2', y(max))
        .attr('stroke', 'black')
        .attr('stroke-width', 0.50);
};


// create box.
const createBox = (svg, margin, width, q3, q1, y, element) => {
    svg
        .append('rect')
        .attr('x', margin.left)
        .attr('y', y(q3))
        .attr('height', (y(q1) - y(q3)))
        .attr('width', width)
        .attr('stroke', 'black')
        .attr('stroke-width', 0.50)
        .style('fill', '#69b3a2')
        .attr('id', `box${element}`);
};


// create median, min and max horizontal lines
const createRest = (svg, min, median, max, width, y) => {
    svg
        .selectAll('total')
        .data([min, median, max])
        .enter()
        .append('line')
        .attr('x1', 1)
        .attr('x2', width)
        .attr('y1', (d) => (y(d)))
        .attr('y2', (d) => (y(d)))
        .attr('stroke', 'black')
        .attr('stroke-width', 0.50);
};


const BoxPlot = (props) => {
    // destructuring the props.
    const { data, response, patients } = props;

    // parsing the data.
    const { parsedData, minTotal, maxTotal } = parseData(data, response);

    // get number of patients.
    const totalPatients = Object.keys(parsedData).length;

    // initialize dimensions.
    const { width, height, margin } = initialize();

    // svg width.
    const svgWidth = (width + margin.left + margin.right) * totalPatients;
    const svgHeight = height + margin.bottom + margin.top;


    // use effect function once the component is mounted/updated.
    useEffect(() => {
        // remove the element if already present.
        d3.selectAll('#boxplotsvg').remove();

        // scale.
        const scale = yScale(height, minTotal, maxTotal);

        // y-axis.
        yAxis(scale, width, height, margin);

        // create an svg element.
        const svgCanvas = createSvg(svgWidth, svgHeight);

        // creating reactangle around the svgs.
        createRectangle(svgCanvas, svgWidth, svgHeight);

        // create a box plot for each of the patient.
        Object.keys(parsedData).forEach((element, i) => {
            // append g element to svg for each patient.
            const svg = appendGElement(svgCanvas, margin, width, i);

            // only plot the data if the number of NaN is less than 10.
            if (isDataPlotable(parsedData[element])) {
                const plotData = parsedData[element];

                // compute stats.
                const {
                    median, min, max,
                    q1, q3,
                } = computeStats(plotData);

                // create vertical line.
                verticalLine(width, min, max, svg, scale);
                // create box.
                createBox(svg, margin, width, q3, q1, scale, element);
                // create rest of the elements.
                createRest(svg, min, median, max, width, scale);
            }
        });
    });

    // return statement.
    return (
        <div>
            <div id="boxplot" />
        </div>
    );
};


BoxPlot.propTypes = {
    response: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    patients: PropTypes.arrayOf(PropTypes.string).isRequired,
};


export default BoxPlot;
