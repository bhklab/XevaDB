import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';


const createSvg = (width, height, left, right, top, bottom) => {
    const svg = d3.select('#barplot')
        .append('svg')
        .attr('width', width + left + right)
        .attr('height', height + top + bottom)
        .append('g')
        .attr('transform', `translate(${left},${top})`)
        .attr('id', 'barplotsvg');

    return svg;
};


const createXScale = (width, data) => {
    const scale = d3.scaleBand()
        .domain(data.map((d) => d.id))
        .range([0, width])
        .padding([0.3]);

    return scale;
};


const createYScale = (height) => {
    const scale = d3.scaleLinear()
        .domain([0, 1700])
        .range([height, 0])
        .nice();

    return scale;
};


const colorScale = (data, colors) => {
    const values = data.map((element) => element.id);

    const scale = d3.scaleOrdinal()
        .domain(values)
        .range(colors);

    return scale;
};


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


const createYAxis = (svg, yScale) => {
    const axis = d3.axisLeft()
        .scale(yScale)
        .ticks(7);

    svg.append('g')
        .call(axis)
        .style('font-size', 13);
};


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
        .attr('fill', (d) => color(d.id));
};


const appendBarText = (svg, data, xScale, yScale) => {
    data.forEach((element) => {
        svg.append('text')
            .attr('x', xScale(element.id) + 14)
            .attr('y', yScale(element.value) - 4)
            .attr('font-family', 'sans-serif')
            .attr('font-size', '12px')
            .style('text-anchor', 'start')
            .attr('fill', 'black')
            .text(element.value);
    });
};


const BarPlot = (props) => {
    // getting the prop data.
    const { dimensions, margin } = props;
    let { data } = props;
    const { width, height } = dimensions;
    const {
        left, right, top, bottom,
    } = margin;

    // sort data
    data = data.sort((b, a) => a.value - b.value);

    const colorList = [
        '#E64B35FF', '#4DBBD5FF', '#00A087FF', '#3C5488FF',
        '#F39B7FFF', '#8491B4FF', '#91D1C2FF', '#B09C85FF',
        '#0073C2FF', '#868686FF', '#CD534CFF', '#7AA6DCFF',
        '#003C67FF', '#3B3B3BFF', '#A73030FF', '#4A6990FF',
        '#00468BBF', '#42B540BF', '#0099B4BF', '#925E9FBF',
        '#FDAF91BF', '#AD002ABF', '#ADB6B6BF',
    ];

    useEffect(() => {
        // remove the element if already present.
        d3.selectAll('#barplotsvg').remove();

        // svg canvas.
        const svg = createSvg(width, height, left, right, top, bottom);

        // scales and axis.
        const xScale = createXScale(width, data);
        const yScale = createYScale(height);
        const color = colorScale(data, colorList);
        createXAxis(svg, xScale, height);
        createYAxis(svg, yScale);

        // append text.
        appendBarText(svg, data, xScale, yScale);

        // create bars.
        createBars(svg, data, xScale, yScale, height, color);
    }, []);


    return (
        <div
            id="barplot"
            style={{ textAlign: 'center' }}
        />
    );
};


BarPlot.propTypes = {
    dimensions: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number,
    }).isRequired,
    margin: PropTypes.shape({
        top: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
        left: PropTypes.number,
    }).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
};


export default BarPlot;
