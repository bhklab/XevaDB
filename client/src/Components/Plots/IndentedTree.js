/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
import React, { useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';

// creating the default margin in case not passed as props.
const defaultMargin = {
    top: 100,
    right: 100,
    bottom: 100,
    left: 100,
};

// creating the default dimensions in case not passed as props.
const defaultDimensions = {
    width: 600 - defaultMargin.left - defaultMargin.right,
    height: 600 - defaultMargin.top - defaultMargin.bottom,
};

// node size.
const nodeSize = 17;
const format = d3.format(',');

// create columns.
const columns = [
    {
        label: 'Count',
        value: (d) => (d.children ? 0 : 1),
        format: (value, d) => (d.children ? format(value) : ''),
        x: 340,
    },
];

// this will create the svg element for the chart
const createSVGBody = (margin, dimensions, nodes) => (
    // make the svg element
    d3.select('#indentedtree')
        .append('svg')
        .attr('id', 'indentedtreesvg')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
        .attr('width', dimensions.width + margin.left + margin.right)
        .attr('height', (nodes.length) * nodeSize)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
);

// create the root of the indented tree.
const createRoot = (data) => {
    let i = 0;
    return d3.hierarchy(data).eachBefore((d) => d.index = i++);
};

// create links for the tree.
const createLinks = (svg, root) => (
    svg.append('g')
        .attr('fill', 'none')
        .attr('stroke', `${colors.pink_header}`)
        .selectAll('path')
        .data(root.links())
        .join('path')
        .attr('d', (d) => `
        M${d.source.depth * nodeSize},${d.source.index * nodeSize}
        V${d.target.index * nodeSize}
        h${nodeSize}
      `)
);

// create nodes.
const createNodes = (svg, nodes) => (
    svg.append('g')
        .selectAll('g')
        .data(nodes)
        .join('g')
        .attr('transform', (d) => `translate(0,${d.index * nodeSize})`)
);

// create circles.
const appendCircles = (node) => {
    node.append('circle')
        .attr('cx', (d) => d.depth * nodeSize)
        .attr('r', 2.5)
        .attr('fill', (d) => (d.children ? null : `${colors.pink_header}`));
};

const appendText = (node) => {
    node.append('text')
        .attr('dy', '0.32em')
        .attr('x', (d) => d.depth * nodeSize + 6)
        .text((d) => d.data.name)
        .attr('fill', `${colors.blue_header}`);

    node.append('title')
        .text((d) => d.ancestors().reverse().map((d) => d.data.name).join('/'))
        .attr('fill', `${colors.blue_header}`);
};

const appendData = (svg, root, node) => {
    columns.forEach((data) => {
        const { label, value, format, x } = data;
        svg.append('text')
            .attr('dy', '0.32em')
            .attr('y', -nodeSize)
            .attr('x', x)
            .attr('text-anchor', 'end')
            .attr('font-weight', 'bold')
            .attr('fill', `${colors.blue_header}`)
            .text(label);

        node.append('text')
            .attr('dy', '0.32em')
            .attr('x', x)
            .attr('text-anchor', 'end')
            .attr('fill', (d) => (d.children ? null : `${colors.blue_header}`))
            .data(root.copy().sum(value).descendants())
            .text((d) => format(d.value, d));
    });
};

// main function that creates the indented tree.
const createIndetedTree = (margin, dimensions, data) => {
    console.log(data);
    // creating the root.
    const root = createRoot(data);
    // nodes.
    const nodes = root.descendants();
    // create the svg body for the chart.
    const svg = createSVGBody(margin, dimensions, nodes);
    // links.
    createLinks(svg, root);
    // create nodes.
    const node = createNodes(svg, nodes);
    // append circles.
    appendCircles(node);
    // append text and title.
    appendText(node);
    // append data.
    appendData(svg, root, node);
};

// Intented Tree component.
const IdentedTree = (props) => {
    // margin and dimensions.
    const margin = props.margin || defaultMargin;
    const dimensions = props.dimensions || defaultDimensions;
    const { data } = props;

    // create the tree diagram.
    useEffect(() => {
        // creates the tree diagram.
        createIndetedTree(margin, dimensions, data);
    });

    return (
        <div className="curve-wrapper">
            <div id="indentedtree" />
        </div>
    );
};

IdentedTree.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    margin: PropTypes.shape({
        top: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
        left: PropTypes.number,
    }),
    dimensions: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
    }),
};

export default IdentedTree;
