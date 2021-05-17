/* eslint-disable react/destructuring-assignment */
import React, { useEffect } from 'react';
import * as d3 from 'd3';
import colors from '../../styles/colors';

// creating the default margin in case not passed as props.
const defaultMargin = {
    top: 50,
    right: 200,
    bottom: 50,
    left: 100,
};

// creating the default dimensions in case not passed as props.
const defaultDimensions = {
    width: 650 - defaultMargin.left - defaultMargin.right,
    height: 500 - defaultMargin.top - defaultMargin.bottom,
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

// creates a tree with the give height and width.
const createTree = (data, { height, width }) => {
    const root = d3.hierarchy(data);
    root.dx = 10;
    root.dy = width / (root.height + 1);
    // return the tree.
    return d3.tree()
        .nodeSize([root.dx, root.dy])
        .size([height, width])(root);
};

// create the links for the tree.
const createLinks = (svg, root) => {
    svg.append('g')
        .attr('fill', 'none')
        .attr('stroke', `${colors.pink_header}`)
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5)
        .selectAll('path')
        .data(root.links())
        .join('path')
        .attr('d', d3.linkHorizontal()
            .x((d) => d.y)
            .y((d) => d.x));
};

const createNodes = (svg, root) => {
    const node = svg.append('g')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-width', 3)
        .selectAll('g')
        .data(root.descendants())
        .join('g')
        .attr('transform', (d) => `translate(${d.y},${d.x})`);

    return node;
};

const createCircles = (node) => {
    node.append('circle')
        .attr('fill', (d) => (d.children ? `${colors.pink_header}` : `${colors.light_pink_header}`))
        .attr('r', 4.0);
};

const appendText = (node) => {
    node.append('text')
        .attr('dy', '0.31em')
        .attr('x', (d) => (d.children ? -10 : 10))
        .attr('text-anchor', (d) => (d.children ? 'end' : 'start'))
        .text((d) => d.data.data.name)
        .attr('fill', `${colors.blue_header}`)
        .clone(true)
        .lower()
        .attr('stroke', 'white');
};

// main function that creates the tree diagram.
const createTreeDiagram = (margin, dimensions, data) => {
    // create the svg body for the chart.
    const svg = createSVGBody(margin, dimensions);
    // create tree.
    const tree = createTree(data, dimensions);
    // const links.
    createLinks(svg, tree);
    // create nodes.
    const node = createNodes(svg, tree);
    // append text and create circles.
    createCircles(node);
    appendText(node);
};

// Tree Diagram component.
const TreeDiagram = (props) => {
    // margin and dimensions.
    const margin = props.margin || defaultMargin;
    const dimensions = props.dimensions || defaultDimensions;
    const { data } = props;

    // create the tree diagram.
    useEffect(() => {
        // creates the tree diagram.
        createTreeDiagram(margin, dimensions, data);
    }, []);

    return (
        <div className="curve-wrapper">
            <h1>
                Patient =
                {' '}
                <span style={{ color: `${colors.pink_header}` }}>
                    {data.data.name}
                </span>
            </h1>
            <div id="treediagram" />
        </div>
    );
};

export default TreeDiagram;
