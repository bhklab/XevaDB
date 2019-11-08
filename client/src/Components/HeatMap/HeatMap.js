/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
import React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

class HeatMap extends React.Component {
    constructor(props) {
        super(props);
        this.HeatMap = this.HeatMap.bind(this);
        this.makeHeatmap = this.makeHeatmap.bind(this);
    }

    componentDidMount() {
        // this.HeatMap()
    }

    componentDidUpdate() {
        this.HeatMap();
    }

    HeatMap() {
        const { node } = this;
        const { data } = this.props;
        const { drugId } = this.props;
        const { patientId } = this.props;
        const { dimensions } = this.props;
        const { margin } = this.props;
        const { className } = this.props;
        this.makeHeatmap(data, patientId, drugId, className, dimensions, margin, node);
    }

    // main heatmap function taking parameters as data, all the patient ids and drugs.
    makeHeatmap(data, patient, drug, plotId, dimensions, margin, node) {
        this.node = node;

        // height and width for the SVG based on the number of drugs and patient/sample ids.
        // height and width of the rectangles in the main skeleton.
        const rectHeight = dimensions.height;
        const rectWidth = dimensions.width;

        // this height and width is used for setting the body.
        const height = drug.length * rectHeight + 100;
        const width = patient.length * rectWidth + 100;

        const targetEval = [
            { value: 'CR', color: '#0033CC' },
            { value: 'PR', color: '#1a9850' },
            { value: 'SD', color: '#fed976' },
            { value: 'PD', color: '#e41a1c' },
        ];
        const targetColor = ['#0033CC', '#1a9850', '#fed976', '#e41a1c', 'lightgray'];

        // setting the query strings
        let drugUse = '';
        let drugIndex = 0;
        const patientUse = patient;

        // drug evaluations
        let maxDrug = 0;
        let drugEvaluations = {};
        for (let i = 0; i < drug.length; i++) {
            drugEvaluations[drug[i]] = {
                CR: 0, PR: 0, SD: 0, PD: 0, NA: 0, empty: 0,
            };
        }

        // patient evaluations
        let patientEvaluations = {};
        for (let j = 0; j < patient.length; j++) {
            patientEvaluations[patient[j]] = {
                CR: 0, PR: 0, SD: 0, PD: 0, NA: 0, empty: 0, total: 0,
            };
        }

        /* this code will add to the drugEvaluations  and
      patientEvaluations  object the values for PD,SD,PR,CR
      and also sets the value of the letiable maxDrug. */
        function calculateEvaluations(d, i) {
            const drugAlt = drug[i];
            const keys = Object.entries(d);
            let currentMaxDrug = 0;
            keys.forEach((key) => {
                if (key[1] === '') { key[1] = 'empty'; }
                drugEvaluations[drugAlt][key[1]]++;
                patientEvaluations[key[0]][key[1]]++;
                if (key[1] !== 'NA' || key[1] !== 'empty') {
                    currentMaxDrug++;
                    patientEvaluations[key[0]].total++;
                }
            });
            if (currentMaxDrug > maxDrug) { maxDrug = currentMaxDrug; }
        }


        /* This code is used to produce the query strings */
        // eslint-disable-next-line consistent-return
        function querystringValue(d, i) {
            if (i === 0) {
                drugUse = drug[drugIndex];
                drugIndex++;
            }
            if (d.length === 2 || d.length === 'empty') {
                return `/curve?patient=${patientUse[i]}&drug=${drugUse}`;
            }
        }


        /** SCALE FOR MAIN SKELETON * */

        // defining the scale that we will use for our x-axis and y-axis for the skeleton.
        const yScale = d3.scaleBand()
            .domain(drug)
            .rangeRound([rectHeight, drug.length * rectHeight + rectHeight]);

        const xScale = d3.scaleBand()
            .domain(patient)
            .rangeRound([0, patient.length * rectWidth]);

        // defining the x-axis for the main skeleton and
        // setting tick size to zero will remove the ticks.
        const yAxis = d3.axisLeft()
            .scale(yScale)
            .tickSize(0)
            .tickPadding(15);


        const xAxis = d3.axisTop()
            .scale(xScale)
            .tickSize(5);

        /** SETTING SVG ATTRIBUTES * */

        // make the SVG element.
        const svg = d3.select(node)
            .append('svg')
            .attr('id', `heatmap-${plotId}`)
            .attr('xmlns', 'http://wwww.w3.org/2000/svg')
            .attr('xmlns:xlink', 'http://wwww.w3.org/1999/xlink')
            .attr('height', height + margin.bottom + margin.top)
            .attr('width', width + margin.left + margin.right)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);


        /** HEATMAP SKELETON * */

        // structure of the heatmap
        const skeleton = svg.append('g')
            .attr('id', 'skeleton');


        // this will create g element for each of data row (equivalent to total number of row)
        const drugResponse = skeleton.append('g')
            .attr('id', 'targ_rect');


        const gskeleton = drugResponse.selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr('transform', (d, i) => `translate(0,${i * rectHeight})`);


        let rectKeys;
        // this will append rect equivalent to number of patient ids.
        const drawrectangle = gskeleton.selectAll('rect.hmap-rect')
            .data((d, i) => {
                // calling the function and passing the data d as parameter.
                calculateEvaluations(d, i);
                // this returns the object values to next chaining method.
                rectKeys = Object.keys(d);
                const rectValue = Object.values(d, i)
                    .map((value) => {
                        let val = '';
                        if (value.length === 2) {
                            val = value;
                        } else if (value.length === 0) {
                            val = 'empty';
                        }
                        return val;
                    });
                return rectValue;
            })
            .enter()
            .append('a')
            .attr('xlink:href', (d, i) => querystringValue(d, i))
            .append('rect')
            .attr('class', (d, i) => `hmap-rect heatmap-${rectKeys[i]}`)
            .attr('width', rectWidth - 2)
            .attr('height', rectHeight - 2)
            .attr('x', (d, i) => i * rectWidth)
            .attr('y', rectHeight);


        // this will fill the rectangles with different color based on the data.
        drawrectangle.attr('fill', (d) => {
            if (d === 'CR') {
                return targetColor[0];
            } if (d === 'PR') {
                return targetColor[1];
            } if (d === 'SD') {
                return targetColor[2];
            } if (d === 'PD') {
                return targetColor[3];
            }
            return targetColor[4];
        });

        // reset
        drugEvaluations = {};
        for (let i = 0; i < drug.length; i++) {
            drugEvaluations[drug[i]] = {
                CR: 0, PR: 0, SD: 0, PD: 0, NA: 0, empty: 0,
            };
        }

        // patient evaluations
        patientEvaluations = {};
        for (let j = 0; j < patient.length; j++) {
            patientEvaluations[patient[j]] = {
                CR: 0, PR: 0, SD: 0, PD: 0, NA: 0, empty: 0, total: 0,
            };
        }
        let pCount = 0;
        drugIndex = 0;

        // let highlight =
        gskeleton.selectAll('rect.hmap-hlight')
            .data((d, i) => {
                // console.log(d)
                // calling the function and passing the data d as parameter.
                calculateEvaluations(d, i);
                // this returns the object values to next chaining method.
                rectKeys = Object.keys(d);
                const rectValue = Object.values(d, i)
                    .map((value) => {
                        let val = '';
                        if (value.length === 2) {
                            val = value;
                        } else if (value.length === 0) {
                            val = 'empty';
                        }
                        return val;
                    });
                return rectValue;
            })
            .enter()
            .append('a')
            .attr('xlink:href', (d, i) => querystringValue(d, i))
            .append('rect')
            .attr('class', (d, i) => {
                const drugClass = drug[pCount].replace(/\s/g, '').replace(/[+]/, '-');
                if (i === (patient.length - 1)) {
                    pCount++;
                }
                return `hmap-hlight-${rectKeys[i]} hmap-hlight-${drugClass}`;
            })
            .attr('width', rectWidth - 2)
            .attr('height', rectHeight - 2)
            .attr('x', (d, i) => i * rectWidth)
            .attr('fill', 'rgb(0,0,0)')
            .attr('y', rectHeight)
            .style('opacity', 0)
            // eslint-disable-next-line func-names
            .on('mouseover', function (d, i) {
                const drugClass = d3.select(this).attr('class').split(' ')[1];
                d3.selectAll(`.hmap-hlight-${rectKeys[i]}`)
                    .style('opacity', 0.2);
                d3.selectAll(`.oprint-hlight-${rectKeys[i]}`)
                    .style('opacity', 0.2);
                d3.selectAll(`.hlight-space-${rectKeys[i]}`)
                    .style('opacity', 0.2);

                return drugClass;
            })
            // eslint-disable-next-line func-names
            .on('mouseout', function (d, i) {
                const drugClass = d3.select(this).attr('class').split(' ')[1];
                d3.selectAll(`.hmap-hlight-${rectKeys[i]}`)
                    .style('opacity', 0);
                d3.selectAll(`.oprint-hlight-${rectKeys[i]}`)
                    .style('opacity', 0);
                d3.selectAll(`.hlight-space-${rectKeys[i]}`)
                    .style('opacity', 0);

                return drugClass;
            });

        // Creating lines.
        const lines = svg.append('g')
            .attr('id', 'lines')
            .attr('transform', () => `translate(2,${height - 62})`);

        const temp = patient.slice(0);
        temp.push('');

        lines.selectAll('line.dashed-line')
            .data(temp)
            .enter()
            .append('line')
            .attr('class', 'dashed-line')
            .attr('x1', (d, i) => i * (rectWidth) - 3)
            .attr('x2', (d, i) => i * (rectWidth) - 3)
            .attr('y1', 2)
            .attr('y2', 200)
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .style('stroke-dasharray', '3 2')
            .style('opacity', 0.2);

        lines.selectAll('rect.hlight-space')
            .data(patient)
            .enter()
            .append('rect')
            .attr('class', (d) => `hlight-space-${d}`)
            .attr('width', rectWidth - 2)
            .attr('height', 200)
            .attr('x', (d, i) => i * rectWidth - 2)
            .attr('fill', 'rgb(0,0,0)')
            .attr('y', 0)
            .style('opacity', 0);

        /** X-AXIS AND Y-AXIS FOR THE SKELETON * */

        // calling the y-axis and removing the stroke.
        const drugName = skeleton.append('g')
            .attr('id', 'drugName');

        drugName.attr('stroke-width', '0')
            .style('font-size', '12px')
            .attr('font-weight', '500')
            .call(yAxis)
            .selectAll('text')
            .attr('fill', (d) => {
                if (d === 'untreated') { return '#3453b0'; }
                return 'black';
            })
            // eslint-disable-next-line func-names
            .on('mouseover', function () {
                const drugClass = d3.select(this).text().replace(/\s/g, '').replace(/[+]/, '-');
                d3.selectAll(`.hmap-hlight-${drugClass}`)
                    .style('opacity', 0.2);
            })
            // eslint-disable-next-line func-names
            .on('mouseout', function () {
                const drugClass = d3.select(this).text().replace(/\s/g, '').replace(/[+]/, '-');
                d3.selectAll(`.hmap-hlight-${drugClass}`)
                    .style('opacity', 0);
            });

        // calling the x-axis to set the axis and we have also transformed the text.
        const patientId = skeleton.append('g')
            .attr('id', 'patient_id');

        patientId.attr('stroke-width', '0')
            .style('font-size', '13px')
            .call(xAxis)
            .selectAll('text')
            .attr('transform', 'rotate(-90)')
            .attr('font-weight', '500')
            .attr('x', '0.5em')
            .attr('y', '.15em');


        /** SMALL RECTANGLES ON RIGHT SIDE OF HEATMAP * */

        // This will create four rectangles on right side for the Evaluation of target lesions.
        const targetRect = skeleton.append('g')
            .attr('id', 'small_rect');

        targetRect.selectAll('rect')
            .data(targetEval)
            .enter()
            .append('rect')
            .attr('x', (patient.length * rectWidth + 120))
            .attr('y', (d, i) => (drug.length * 10) + i * 25)
            .attr('height', '15')
            .attr('width', '15')
            .attr('fill', (d) => d.color);

        targetRect.selectAll('text')
            .data(targetEval)
            .enter()
            .append('text')
            .attr('x', (patient.length * rectWidth + 140))
            .attr('y', (d, i) => (drug.length * 10 + 12) + i * 25)
            .text((d) => d.value)
            .attr('font-size', '14px');


        /** VERTICAL GRAPH ON RIGHT SIDE OF HEATMAP * */

        const strokeWidth = 0.75;

        // This will make a right side vertical graph.
        const drugEval = svg.append('g')
            .attr('id', 'drug_eval');

        const drugScale = d3.scaleLinear()
            .domain([0, maxDrug])
            .range([0, 80]);

        // This will set an x-axis for the vertical graph.
        const xAxisVertical = d3.axisTop()
            .scale(drugScale)
            .ticks(4)
            .tickSize(3)
            .tickFormat(d3.format('.0f'));

        svg.append('g')
            .attr('transform', `translate(${patient.length * rectWidth + 20},${35})`)
            .call(xAxisVertical)
            .selectAll('text')
            .attr('fill', 'black')
            .style('font-size', 8)
            .attr('stroke', 'none');


        const drugHeightScale = d3.scaleLinear()
            .domain([0, (44 + (drug.length - 1) * 40)])
            .range([0, (rectHeight * drug.length) + 10]);

        drugEval.append('rect')
            .attr('class', 'drug_eval_rect')
            .attr('x', patient.length * rectWidth + 20)
            .attr('y', 35)
            .attr('height', rectHeight * drug.length)
            .attr('width', drugScale(maxDrug))
            .attr('fill', 'white')
            .style('stroke', 'black')
            .style('stroke-width', 1);


        // rectangle for vertical graph.
        const drugEvaluationRectangle = (iterator) => {
            const responseEvalTypes = ['CR', 'PR', 'SD', 'PD'];
            let xRange = patient.length * rectWidth + 20;
            let width = 0;
            responseEvalTypes.forEach((type, j) => {
            // x range for the rectangles.
                xRange += width;
                width = drugScale(drugEvaluations[drug[iterator]][type]);
                drugEval.append('rect')
                    .attr('class', `drug_eval_${type}`)
                    .attr('height', 26)
                    .attr('width', width)
                    .attr('x', xRange)
                    .attr('y', drugHeightScale(42 + iterator * 40))
                    .attr('fill', targetColor[j])
                    .style('stroke', 'black')
                    .style('stroke-width', strokeWidth);
            });
        };

        for (let i = 0; i < drug.length; i++) {
            drugEvaluationRectangle(i);
        }


        /** HORIZONTAL GRAPH AT THE TOP OF HEATMAP * */

        let maxPatientidTotal = 0;
        const boxHeight = 80;

        // This will set the maximum number of total letiants.
        const keys = Object.entries(patientEvaluations);
        keys.forEach((key) => {
            const curentMax = key[1].total;
            if (curentMax > maxPatientidTotal) {
                maxPatientidTotal = curentMax;
            }
        });

        // This will only run if the length of the drug
        // array is greater than 1 (it has more than one drug)
        if (drug.length > 1) {
        // appending 'g' element to the SVG.
            const patientEval = svg.append('g')
                .attr('id', 'patient_eval');

            // setting the outer rectangle.
            patientEval.append('rect')
                .attr('class', 'patient_eval_rect')
                .attr('x', 0)
                .attr('y', -130)
                .attr('height', boxHeight)
                .attr('width', patient.length * 20)
                .attr('fill', 'white')
                .style('stroke', 'black')
                .style('stroke-width', 1);

            // setting scale to map max patient_id value to range (height of the box.)
            const patientScale = d3.scaleLinear()
                .domain([0, maxPatientidTotal])
                .range([0, boxHeight]);

            // This code will set y-axis of the graph at top
            if (maxPatientidTotal !== 0) {
                const patientScales = d3.scaleLinear()
                    .domain([0, maxPatientidTotal])
                    .range([boxHeight, 0]);

                const yAxis = d3.axisLeft()
                    .scale(patientScales)
                    .ticks(2)
                    .tickSize(0)
                    .tickFormat(d3.format('.0f'));

                svg.append('g')
                    .attr('transform', 'translate(0,-130.5)')
                    .call(yAxis);
            }

            // function to calculate patient evaluations.
            const patientEvaluationRectangle = (iterator) => {
                const responseEvalTypes = ['CR', 'PR', 'SD', 'PD'];
                let height = 0;
                let yRange = -130 + boxHeight;

                responseEvalTypes.forEach((type, j) => {
                    height = patientScale(patientEvaluations[patient[iterator]][type]);
                    yRange -= height;
                    patientEval.append('rect')
                        .attr('class', 'patient_eval_cr')
                        .attr('height', height)
                        .attr('width', 16)
                        .attr('x', iterator * 20)
                        .attr('y', yRange)
                        .attr('fill', targetColor[j])
                        .style('stroke', 'black')
                        .style('stroke-width', strokeWidth);
                });
            };

            for (let i = 0; i < patient.length; i++) {
                patientEvaluationRectangle(i);
            }
        }
    }

    render() {
        return (
            // eslint-disable-next-line no-return-assign
            <div ref={(node) => this.node = node} className="heatmap-wrapper" />
        );
    }
}


HeatMap.propTypes = {
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
    drugId: PropTypes.arrayOf(PropTypes.string).isRequired,
    patientId: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    className: PropTypes.string.isRequired,
};


export default HeatMap;
