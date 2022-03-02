/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import styled from 'styled-components';

// bar plot styles
const StyledBarPlot = styled.div`
    width: 90%;
    margin: auto;
    overflow-x: scroll;

    ::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 10px;
        height: 10px;
    }
      
    ::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-color: rgba(0, 0, 0, .5);
        box-shadow: 0 0 1px rgba(255, 255, 255, .5);
    }
`;

// color list
const colorList = [
    '#E64B35FF', '#4DBBD5FF', '#00A087FF', '#3C5488FF',
    '#F39B7FFF', '#8491B4FF', '#91D1C2FF', '#B09C85FF',
    '#0073C2FF', '#868686FF', '#CD534CFF', '#7AA6DCFF',
    '#003C67FF', '#3B3B3BFF', '#A73030FF', '#4A6990FF',
    '#00468BBF', '#42B540BF', '#0099B4BF', '#925E9FBF',
    '#FDAF91BF', '#AD002ABF', '#ADB6B6BF',
];

// defaul parameters.
const defaultMargin = {
    top: 50, right: 150, bottom: 200, left: 150,
};
const defaultDimensions = { width: 850, height: 400 };
const defaultArc = { outerRadius: 260, innerRadius: 150 };
const minBarWidth = 60;

// create the svg canvas.
const createSvg = (width, height, left, right, top, bottom) => {
    const svg = d3.select('#barplot')
        .append('svg')
        .attr('width', width + left + right)
        .attr('height', height + top + bottom)
        .attr('id', 'barplotsvg')
        .append('g')
        .attr('transform', `translate(${left},${top})`);

    return svg;
};

// x scale for the plot
const createXScale = (width, data) => {
    const scale = d3.scaleBand()
        .domain(data.map((d) => d.id))
        .range([0, width])
        .padding([0.3]);

    return scale;
};

// y scale for the plot
const createYScale = (height, max) => {
    const scale = d3.scaleLinear()
        .domain([0, max])
        .range([height, 0])
        .nice();

    return scale;
};

// color scale
const colorScale = (data, colors) => {
    const values = data.map((element) => element.id);

    const scale = d3.scaleOrdinal()
        .domain(values)
        .range(colors);

    return scale;
};

// create the x axis for the chart
const createXAxis = (svg, xScale, height) => {
    const axis = d3.axisBottom()
        .scale(xScale)
        .ticks(7);

    svg.append('g')
        .call(axis)
        .attr('transform', `translate(0,${height})`)
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end')
        .style('font-size', 13);
};

// create y axis for the plot
const createYAxis = (svg, yScale) => {
    const axis = d3.axisLeft()
        .scale(yScale)
        .ticks(7);

    svg.append('g')
        .call(axis)
        .style('font-size', 13);
};

// create bars
const createBars = (svg, data, xScale, yScale, height, color) => {
    svg.selectAll('bars')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d) => xScale(d.id))
        .attr('y', (d) => yScale(d.value))
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => height - yScale(d.value))
        .attr('id', (d) => `bar_${d.id}`)
        .attr('fill', (d) => d.color || color(d.id));
};

// append text with values on the top of bars
const appendBarText = (svg, data, xScale, yScale) => {
    data.forEach((element) => {
        svg.append('text')
            .attr('x', xScale(element.id) + (xScale.bandwidth() / 3))
            .attr('y', yScale(element.value) - 4)
            .attr('font-family', 'Open Sans')
            .attr('font-size', '12px')
            .style('text-anchor', 'start')
            .attr('fill', 'black')
            .text(element.value);
    });
};

// append label
const appendYAxisLabel = (svg, height, left, label) => {
    svg.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('font-family', 'Open Sans')
        .attr('transform', `translate(${-left / 2}, ${height / 1.5})rotate(270)`)
        .attr('font-size', '14px')
        .style('text-anchor', 'start')
        .attr('fill', 'black')
        .text(`${label}`);
};

// main component function for the bar plot
const BarPlot = (props) => {
    // getting the prop data.
    const margin = props.margin || defaultMargin;
    let { data } = props;
    const { left, right, top, bottom } = margin;
    const yAxisLabel = props.label;
    const dimensions = props.dimensions || defaultDimensions;

    // update dimensions
    if (minBarWidth * data.length > dimensions.width) {
        dimensions.width = minBarWidth * data.length;
    };
    const { width, height } = dimensions;

    // calulcates the max value in the data.
    let max = 0;
    data.forEach((val) => {
        if (val.value > max) {
            max = val.value;
        }
    });

    // sort data
    data = data.sort((b, a) => a.value - b.value);

    useEffect(() => {
        // remove the element if already present.
        d3.select('#barplotsvg').remove();

        // svg canvas.
        const svg = createSvg(width, height, left, right, top, bottom);

        // scales and axis.
        const xScale = createXScale(width, data);
        const yScale = createYScale(height, max);
        const color = colorScale(data, colorList);
        createXAxis(svg, xScale, height);
        createYAxis(svg, yScale);

        // append text.
        appendBarText(svg, data, xScale, yScale);

        // create bars.
        createBars(svg, data, xScale, yScale, height, color);

        // append y-axis test/label.
        appendYAxisLabel(svg, height, left, yAxisLabel);
    });

    return (
        <StyledBarPlot>
            <div
                id="barplot"
                style={{ textAlign: 'center' }}
            />
        </StyledBarPlot>
    );
};

// proptypes
BarPlot.propTypes = {
    dimensions: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number,
    }),
    margin: PropTypes.shape({
        top: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
        left: PropTypes.number,
    }),
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    label: PropTypes.string.isRequired,
};

export default BarPlot;
