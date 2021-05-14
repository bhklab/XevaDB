/* eslint-disable react/destructuring-assignment */
import React, { useEffect } from 'react';
import * as d3 from 'd3';

// creating the default margin in case not passed as props.
const defaultMargin = {
    top: 10,
    right: 20,
    bottom: 20,
    left: 50,
};

// creating the default dimensions in case not passed as props.
const defaultDimensions = {
    width: 1200 - defaultMargin.left - defaultMargin.right,
    height: 120 - defaultMargin.top - defaultMargin.bottom,
};

// this will create the svg element for the chart
const createSVGBody = (margin, dimensions) => (
    // make the svg element
    d3.select('#treediagram')
        .append('svg')
        .attr('id', 'treediagramsvg')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
        .attr('width', dimensions.width + margin.left + margin.right)
        .attr('height', dimensions.height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
);

const createTreeDiagram = (margin, dimensions) => {
    // create the svg body for the chart.
    const svg = createSVGBody(margin, dimensions);
};

// Tree Diagram component.
const TreeDiagram = (props) => {
    // margin and dimensions.
    const margin = props.margin || defaultMargin;
    const dimensions = props.dimensions || defaultDimensions;

    // create the tree diagram.
    useEffect(() => {
        // creates the tree diagram.
        createTreeDiagram(margin, dimensions);
    }, []);

    return (
        <div className="curve-wrapper">
            <div id="treediagram" />
        </div>
    );
};

export default TreeDiagram;
