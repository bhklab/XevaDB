/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes, { object } from 'prop-types';
import * as d3 from 'd3';

class DensityPlot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            response: '',
            data: '',
            patient: [],
        };
        this.makeDensityPlot = this.makeDensityPlot.bind(this);
        this.parseData = this.parseData.bind(this);
    }

    static getDerivedStateFromProps(props) {
        return {
            response: props.response,
            data: props.data,
            patient: props.patients,
        };
    }

    componentDidMount() {
        this.parseData();
    }

    componentDidUpdate() {
        d3.selectAll('#densityplotsvg').remove();
        this.parseData();
    }

    parseData() {
        const { data } = this.state;
        const { response } = this.state;
        const { patient } = this.state;
        const parsedData = {};
        // creating new data object.
        data.forEach((row) => {
            const keys = patient.length > 1 ? patient : Object.keys(row);
            keys.forEach((val) => {
                if (!parsedData[val]) {
                    parsedData[val] = [];
                }
                parsedData[val].push(row[val][response]);
            });
        });
        Object.keys(parsedData).forEach((val) => {
            this.makeDensityPlot(parsedData[val]);
        });
    }

    makeDensityPlot(data) {
        // calculate min and max value from data.
        const calculateMinMax = (dataArray) => {
            let min = 0;
            let max = 0;
            dataArray.forEach((val) => {
                if (Number(val) > max) {
                    max = Number(val);
                }
                if (Number(val) < min) {
                    min = Number(val);
                }
            });
            min = Math.ceil(min / 10 - 2) * 10;
            max = Math.ceil(max / 10 + 2) * 10;
            return [min, max];
        };

        // Function to compute density
        function kernelDensityEstimator(kernel, X) {
            return (V) => X.map((x) => [x, d3.mean(V, (v) => kernel(x - v))]);
        }
        function kernelEpanechnikov(k) {
            return (v) => (Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0);
        }

        // set the dimensions; and margins of the graph
        const margin = {
            top: 1, right: 1, bottom: 1, left: 1,
        };
        const width = 20 - margin.left - margin.right;
        const height = 20 - margin.top - margin.bottom;


        // append the svg object to the body of the page
        const svg = d3.select('#densityplot')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .attr('id', 'densityplotsvg')
            .attr('transform',
                'translate(255, 150) rotate(90)');

        // add the x Axis
        const x = d3.scaleLinear()
            .domain([...calculateMinMax(data)])
            .range([0, width]);
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).tickSize(0).tickFormat(''))
            .selectAll('path')
            .attr('stroke', '#ff2100')
            .attr('stroke-width', 0.25);

        // add the y Axis
        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 0.1]);
        // svg.append('g')
        //     .call(d3.axisLeft(y).tickSize(0).tickFormat(''));

        // Compute kernel density estimation
        const bandwidth = 7;
        const kde = kernelDensityEstimator(kernelEpanechnikov(bandwidth), x.ticks(20));
        const density = kde(data.map((d) => d));

        // Plot the area
        svg.append('path')
            .attr('class', 'mypath')
            .datum(density)
            .attr('fill', '#ffffff')
            .attr('opacity', '.8')
            .attr('stroke', '#ff2100')
            .attr('stroke-width', 0.25)
            .attr('stroke-linejoin', 'round')
            .attr('d', d3.line()
                .curve(d3.curveBasis)
                .x((d) => x(d[0]))
                .y((d) => y(d[1])));
    }

    render() {
        return (
            <div id="densityplot" />
        );
    }
}

DensityPlot.propTypes = {
    response: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(object).isRequired,
    patients: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DensityPlot;
