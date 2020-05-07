import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

// parsing the initial data.
const parseData = (data, response) => {
    const parsedData = {};

    data.forEach((element) => {
        Object.keys(element).forEach((patient) => {
            if (!parsedData[patient]) {
                parsedData[patient] = [];
            }
            parsedData[patient].push(Number(element[patient][response]));
        });
    });
    return parsedData;
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

// append svg to the div element.
const appendSvg = (width, height, margin) => {
    const svg = d3.select('#boxplot')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('transform', 'translate(250, 150)')
        .attr('id', 'boxplotsvg')
        .append('g')
        .attr('transform',
            `translate(${margin.left},${margin.top})`)
        .style('background-color', 'grey')
        .attr('id', 'boxplotbody');

    return svg;
};

// scale.
const yScale = (height) => d3.scaleLinear()
    .domain([-90, 90])
    .range([height, 0]);

// create y axis.
const yAxis = (scale, svg) => svg.call(d3.axisLeft(scale));


// Compute summary statistics used for the box:
const computeStats = (data) => {
    const sortedData = data.sort(d3.ascending);
    const q1 = d3.quantile(sortedData, 0.25);
    const median = d3.quantile(sortedData, 0.5);
    const q3 = d3.quantile(sortedData, 0.75);
    const interQuantileRange = q3 - q1;
    // const min = q1 - 1.5 * interQuantileRange;
    // const max = q1 + 1.5 * interQuantileRange;
    const min = d3.min(data);
    const max = d3.max(data);

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
    // initialize dimensions.
    const { width, height, margin } = initialize();
    // parsing the data.
    const parsedData = parseData(data, response);

    // use effect function once the component is mounted/updated.
    useEffect(() => {
        d3.selectAll('#boxplotsvg').remove();

        // create a box plot for each of the patient.
        Object.keys(parsedData).forEach((element, i) => {
            const total = parsedData[element].filter((val) => isNaN(val));
            // append svg //
            const svg = appendSvg(width, height, margin);
            // only plot the data if the number of NaN is less than 10.
            if (total.length < 10) {
                const plotData = parsedData[element];
                // scale //
                const scale = yScale(height);
                // create axis.
                // if (i === 0) {
                //     const axis = yAxis(scale, svg);
                // }
                // compute stats //
                const {
                    median, min, max,
                    q1, q3,
                } = computeStats(plotData);
                // create vertical line //
                verticalLine(width, min, max, svg, scale);
                // create box //
                createBox(svg, margin, width, q3, q1, scale, element);
                // create rest of the elements //
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
