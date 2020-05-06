/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import PatientContext, { PatientConsumer } from '../Context/PatientContext';
import DensityPlot from '../DensityPlot/DensityPlot';
import BoxPlot from '../BoxPlot/BoxPlot';

class HeatMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modifiedPatients: [],
            responseValue: 'mRECIST',
        };
        this.HeatMap = this.HeatMap.bind(this);
        this.makeHeatmap = this.makeHeatmap.bind(this);
        this.rankHeatMap = this.rankHeatMap.bind(this);
        this.rankHeatMapBasedOnOncoprintChanges = this.rankHeatMapBasedOnOncoprintChanges.bind(this);
    }

    componentDidMount() {
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
        const { dataset } = this.props;
        const { responseValue: responseType } = this.state;
        this.makeHeatmap(data, patientId, drugId, dataset, className, dimensions, margin, node, responseType);
    }

    // main heatmap function taking parameters as data, all the patient ids and drugs.
    makeHeatmap(data, patient, drug, dataset, plotId, dimensions, margin, node, responseType) {
        // variable to get the function stored.
        const heatmap = this.makeHeatmap;
        const reference = this;
        this.node = node;

        // height and width for the SVG based on the number of drugs and patient/sample ids.
        // height and width of the rectangles in the main skeleton.
        const rectHeight = dimensions.height;
        const rectWidth = dimensions.width;

        // this height and width is used for setting the body.
        const height = drug.length * rectHeight + 100;
        const width = patient.length * rectWidth + 100;

        const targetEval = [
            { CR: '#0033CC' },
            { PR: '#1a9850' },
            { SD: '#fed976' },
            { PD: '#e41a1c' },
        ];

        const targetColor = {
            CR: '#0033CC',
            PR: '#1a9850',
            SD: '#fed976',
            PD: '#e41a1c',
            empty: 'lightgray',
            NA: 'lightgray',
        };

        // making tooltips
        const tooltip = d3.select('.heatmap-wrapper')
            .append('div')
            .attr('id', 'heatmap-tooltip')
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('border', 'solid')
            .style('border-width', '1px')
            .style('border-radius', '5px')
            .style('padding', '5px')
            // .style('min-width', '150px')
            // .style('min-height', '50px')
            .attr('top', 10)
            .attr('left', 20);


        // setting the query strings
        let drugUse = '';
        let drugIndex = 0;
        const patientUse = patient;

        // drug evaluations
        let maxDrug = 0;
        let drugEvaluations = {};
        if (responseType === 'mRECIST') {
            for (let i = 0; i < drug.length; i++) {
                drugEvaluations[drug[i]] = {
                    CR: 0, PR: 0, SD: 0, PD: 0, NA: 0, empty: 0,
                };
            }
        }

        // patient evaluations
        let patientEvaluations = {};
        if (responseType === 'mRECIST') {
            for (let j = 0; j < patient.length; j++) {
                patientEvaluations[patient[j]] = {
                    CR: 0, PR: 0, SD: 0, PD: 0, NA: 0, empty: 0, total: 0,
                };
            }
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
                drugEvaluations[drugAlt][key[1][responseType]]++;
                patientEvaluations[key[0]][key[1][responseType]]++;
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
            if ((d.length === 2 && d !== 'NA') || Number(d)) {
                return `/curve?patient=${patientUse[i]}&drug=${drugUse}`;
            }
        }

        // create a selection dropdown.
        function createSelection() {
            const options = ['mRECIST', 'Slope', 'Best Average Response', 'AUC'];

            d3.select('.select')
                .selectAll('option')
                .data(options)
                .enter()
                .append('option')
                .text((d) => d)
                .attr('value', (d) => d);

            d3.select('.select').on('change', () => {
                // recover the option that has been chosen
                const selectedOption = d3.select('select').property('value');
                let response = '';
                switch (selectedOption) {
                case 'Slope':
                    response = 'slope';
                    break;
                case 'Best Average Response':
                    response = 'best.average.response';
                    break;
                default:
                    response = selectedOption;
                }
                reference.setState({
                    responseValue: response,
                }, () => {
                    d3.select(`#heatmap-${plotId}`).remove();
                    d3.select('#heatmap-tooltip').remove();
                    heatmap(data, patient, drug, dataset, plotId, dimensions, margin, node, response);
                });
            });
        }

        // calculates the min and max value of the response type.
        function calculateMinMax() {
            let min = 0;
            let max = 0;
            data.forEach((row) => {
                const keys = Object.keys(row);
                keys.forEach((val) => {
                    if (Number(row[val][responseType]) > max) {
                        max = Number(row[val][responseType]);
                    }
                    if (Number(row[val][responseType]) < min) {
                        min = Number(row[val][responseType]);
                    }
                });
            });
            return [min, max];
        }

        // creating legend for the response type except for mRECIST.
        function createLegend(svg, height, width, min, max) {
            const defs = svg.append('defs');

            const linearGradient = defs.append('linearGradient')
                .attr('id', 'linear-gradient');

            // Vertical gradient
            linearGradient
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '0%')
                .attr('y2', '100%');

            // Set the color for the start (0%)
            linearGradient.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', '#d8b365');

            // Set the color for the start (50%)
            linearGradient.append('stop')
                .attr('offset', min < 0 ? '50%' : '100%')
                .attr('stop-color', '#f7f7f7');

            // Set the color for the end (100%)
            if (min < 0) {
                linearGradient.append('stop')
                    .attr('offset', '100%')
                    .attr('stop-color', '#5ab4ac');
            }

            // Draw the rectangle and fill with gradient
            svg.append('rect')
                .attr('x', width)
                .attr('y', height / 4)
                .attr('width', 28)
                .attr('height', 129)
                .style('fill', 'url(#linear-gradient)');

            // legend value.
            const targetRect = svg.append('g')
                .attr('id', 'small_rect');

            const legendValue = [max, min];
            targetRect.selectAll('text')
                .data(legendValue)
                .enter()
                .append('text')
                .attr('x', width + 30)
                .attr('y', (d, i) => [height / 4 + 15, height / 4 + 125][i])
                .text((d) => d)
                .attr('font-size', '15px')
                .style('text-anchor', 'start');
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
            .tickPadding(25);


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


        /** Appending Circle to the  Y-Axis */
        drug.forEach((val, i) => {
            svg
                .append('circle')
                .attr('cx', -12)
                .attr('cy', i)
                .attr('r', 6)
                .attr('id', `circle-${val.replace(/\s/g, '').replace(/\+/g, '')}`)
                .style('fill', '#5b8c85')
                .attr('transform', `translate(0,${yScale(val) + 15 - i})`)
                .style('visibility', 'hidden');
        });


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


        // this will append rect equivalent to number of patient ids.
        const drawrectangle = gskeleton.selectAll('rect.hmap-rect')
            .data((d, i) => {
                // calling the function and passing the data d as parameter.
                if (responseType === 'mRECIST') {
                    calculateEvaluations(d, i);
                }
                // this returns the object values to next chaining method.
                const rectValue = patient.map((value) => {
                    let val = '';
                    if (d[value].length === 0) {
                        val = 'empty';
                    } else if (typeof (d[value]) === 'object' && d[value] !== null) {
                        val = d[value][responseType];
                    }
                    return val;
                });
                return rectValue;
            })
            .enter()
            .append('a')
            .attr('xlink:href', (d, i) => querystringValue(d, i))
            .append('rect')
            .attr('class', (d, i) => `hmap-rect heatmap-${patient[i]}`)
            .attr('width', rectWidth - 2)
            .attr('height', rectHeight - 2)
            .attr('x', (d, i) => i * rectWidth)
            .attr('y', rectHeight);


        // grabbing the min and max value for the response type.
        const [min, max] = calculateMinMax();
        // scale for coloring.
        const linearColorScale = d3.scaleLinear()
            .domain([min, 0, max])
            .range(['#5ab4ac', '#f7f7f7', '#d8b365']);
        // this will fill the rectangles with different color based on the data.
        drawrectangle.attr('fill', (d) => {
            if (responseType === 'mRECIST') {
                return targetColor[d];
            } if (responseType !== 'mRECIST' && (d === 'empty' || d === 'NA')) {
                return 'lightgray';
            }
            return linearColorScale(d);
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

        // creating tooltip.
        const createToolTip = (x, y, patient, response) => {
            // tooltip on mousever setting the div to visible.
            tooltip
                .style('visibility', 'visible');

            // tooltip grabbing event.pageX and event.pageY
            // and set color according to the ordinal scale.
            const tooltipDiv = tooltip
                .style('left', `${x + 10}px`)
                .style('top', `${y + 10}px`)
                .style('color', '#000000')
                .style('background-color', '#ffffff');

            // tooltip data.
            const tooltipData = [
                `Patient: ${patient}`, `Response Evaluation: ${response}`,
            ];

            tooltipDiv.selectAll('textDiv')
                .data(tooltipData)
                .enter()
                .append('div')
                .attr('id', 'tooltiptextonco')
                .html((d) => {
                    const data = d.split(':');
                    return `<b>${data[0]}</b>: ${data[1]}`;
                })
                .attr('x', `${x + 10}px`)
                .attr('y', (d, i) => (`${y + 10 + i * 10}px`));
        };

        // hiding tooltip.
        const hideToolTip = () => {
            // tooltip on mousever setting the div to hidden.
            tooltip
                .style('visibility', 'hidden');
            // remove all the divs with id tooltiptext.
            d3.selectAll('#tooltiptextonco').remove();
        };

        let pCount = 0;
        drugIndex = 0;

        // let highlight =
        gskeleton.selectAll('rect.hmap-hlight')
            .data((d, i) => {
                // calling the function and passing the data d as parameter.
                if (responseType === 'mRECIST') {
                    calculateEvaluations(d, i);
                }
                // this returns the object values to next chaining method.
                const rectValue = patient.map((value) => {
                    let val = '';
                    if (d[value].length === 0) {
                        val = 'empty';
                    } else if (typeof (d[value]) === 'object' && d[value] !== null) {
                        val = d[value][responseType];
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
                const drugClass = drug[pCount].replace(/\s/g, '').replace(/[.]/g, '')
                    .replace(/[+]/g, '-');
                if (i === (patient.length - 1)) {
                    pCount++;
                }
                return `hmap-hlight-${patient[i]} hmap-hlight-${drugClass}`;
            })
            .attr('width', rectWidth - 2)
            .attr('height', rectHeight - 2)
            .attr('x', (d, i) => i * rectWidth)
            .attr('fill', 'rgb(0,0,0)')
            .attr('y', rectHeight)
            .style('opacity', 0)
            // eslint-disable-next-line func-names
            .on('mouseover', function (d, i) {
                // creating tooltip by calling createtooltip function.
                const patientToolTip = patient[i];
                createToolTip(d3.event.pageX, d3.event.pageY, patientToolTip, d);
                // highlight
                const drugClass = d3.select(this).attr('class').split(' ')[1];
                d3.selectAll(`.hmap-hlight-${patient[i]}`)
                    .style('opacity', 0.2);
                d3.selectAll(`.oprint-hlight-${patient[i]}`)
                    .style('opacity', 0.2);
                d3.selectAll(`.hlight-space-${patient[i]}`)
                    .style('opacity', 0.2);

                return drugClass;
            })
            // eslint-disable-next-line func-names
            .on('mouseout', function (d, i) {
                // hide tooltip
                hideToolTip();
                // highlight
                const drugClass = d3.select(this).attr('class').split(' ')[1];
                d3.selectAll(`.hmap-hlight-${patient[i]}`)
                    .style('opacity', 0);
                d3.selectAll(`.oprint-hlight-${patient[i]}`)
                    .style('opacity', 0);
                d3.selectAll(`.hlight-space-${patient[i]}`)
                    .style('opacity', 0);

                return drugClass;
            });

        // Creating lines.
        const lines = skeleton.append('g')
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
            .style('font-family', '\'Raleway\',sans-serif')
            .style('font-size', '12px')
            .attr('font-weight', '500')
            .call(yAxis)
            .selectAll('text')
            .attr('fill', (d) => {
                if (d === 'untreated' || d === 'WATER' || d === 'Control') { return '#3453b0'; }
                return 'black';
            })
            .attr('font-weight', (d) => {
                if (d === 'untreated' || d === 'WATER' || d === 'Control') { return '700'; }
                return '500';
            })
            .attr('id', (d) => `tick-${d.replace(/\s/g, '').replace(/\+/g, '')}`)
            // eslint-disable-next-line func-names
            .on('mouseover', function () {
                // tooltip on mousever setting the div to visible.
                d3.select('.heatmap-wrapper')
                    .append('div')
                    .style('position', 'absolute')
                    .style('border', 'solid')
                    .style('visibility', 'visible')
                    .style('border-width', '1px')
                    .style('border-radius', '5px')
                    .style('padding', '5px')
                    .style('left', `${d3.event.pageX - 100}px`)
                    .style('top', `${d3.event.pageY + 15}px`)
                    .attr('id', 'tooltiptextdrug')
                    .style('color', '#000000')
                    .style('background-color', '#ffffff')
                    .text('Click to Sort');

                const drugClass = d3.select(this).text().replace(/\s/g, '').replace(/[.]/g, '')
                    .replace(/[+]/g, '-');
                d3.selectAll(`.hmap-hlight-${drugClass}`)
                    .style('opacity', 0.2);
            })
            // eslint-disable-next-line func-names
            .on('mouseout', function () {
                // tooltip on mousever setting the div to hidden.
                tooltip
                    .style('visibility', 'hidden');
                // remove all the divs with id tooltiptext.
                d3.select('#tooltiptextdrug').remove();
                // highlight.
                const drugClass = d3.select(this).text().replace(/\s/g, '').replace(/[.]/g, '')
                    .replace(/[+]/g, '-');
                d3.selectAll(`.hmap-hlight-${drugClass}`)
                    .style('opacity', 0);
            })
            .on('click', (d, i) => {
                // tooltip on mousever setting the div to hidden.
                tooltip
                    .style('visibility', 'hidden');
                // remove all the divs with id tooltiptext.
                d3.select('#tooltiptextdrug').remove();
                // highlight.
                this.rankHeatMap(d, i, data, responseType);
            });

        // calling the x-axis to set the axis and we have also transformed the text.
        const patientId = skeleton.append('g')
            .attr('id', 'patient_id');

        patientId.attr('stroke-width', '0')
            .style('font-size', '12px')
            .style('font-family', '\'Raleway\',sans-serif')
            .style('text-anchor', (dataset === '7' ? 'start' : 'middle'))
            .call(xAxis)
            .selectAll('text')
            .attr('transform', 'rotate(-90)')
            .attr('font-weight', '500')
            .attr('x', (dataset === '7' ? '-2.4em' : '0.6em'))
            .attr('y', '.15em');


        /** SMALL RECTANGLES ON RIGHT SIDE OF HEATMAP * */

        // This will create four rectangles on right side for the Evaluation of target lesions.
        if (responseType === 'mRECIST') {
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
                .attr('fill', (d) => Object.values(d));

            targetRect.selectAll('text')
                .data(targetEval)
                .enter()
                .append('text')
                .attr('x', (patient.length * rectWidth + 140))
                .attr('y', (d, i) => (drug.length * 10 + 12) + i * 25)
                .text((d) => Object.keys(d))
                .attr('font-size', '14px');


            /** VERTICAL GRAPH ON RIGHT SIDE OF HEATMAP * */

            const strokeWidth = 0.75;

            // This will make a right side vertical graph.
            const drugEval = skeleton.append('g')
                .attr('id', 'drug_eval');

            const drugScale = d3.scaleLinear()
                .domain([0, maxDrug])
                .range([0, 70]);

            // This will set an x-axis for the vertical graph.
            const xAxisVertical = d3.axisTop()
                .scale(drugScale)
                .ticks(4)
                .tickSize(3)
                .tickFormat(d3.format('.0f'));

            skeleton.append('g')
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
                responseEvalTypes.forEach((type) => {
                    // x range for the rectangles.
                    xRange += width;
                    width = drugScale(drugEvaluations[drug[iterator]][type]);
                    drugEval.append('rect')
                        .attr('class', `drug_eval_${type}`)
                        .attr('height', 26)
                        .attr('width', width)
                        .attr('x', xRange)
                        .attr('y', drugHeightScale(42 + iterator * 40))
                        .attr('fill', targetColor[type])
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
                const patientEval = skeleton.append('g')
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

                    skeleton.append('g')
                        .attr('transform', 'translate(0,-130.5)')
                        .call(yAxis);
                }

                // function to calculate patient evaluations.
                const patientEvaluationRectangle = (iterator) => {
                    const responseEvalTypes = ['CR', 'PR', 'SD', 'PD'];
                    let height = 0;
                    let yRange = -130 + boxHeight;

                    responseEvalTypes.forEach((type) => {
                        height = patientScale(patientEvaluations[patient[iterator]][type]);
                        yRange -= height;
                        patientEval.append('rect')
                            .attr('class', 'patient_eval_cr')
                            .attr('height', height)
                            .attr('width', 16)
                            .attr('x', iterator * 20)
                            .attr('y', yRange)
                            .attr('fill', targetColor[type])
                            .style('stroke', 'black')
                            .style('stroke-width', strokeWidth);
                    });
                };

                for (let i = 0; i < patient.length; i++) {
                    patientEvaluationRectangle(i);
                }
            }
        }

        // calling selection function to create a dropdown selection.
        createSelection();

        // create legend if response type is not mRECIST.
        if (responseType !== 'mRECIST') {
            createLegend(svg, height, width, min, max);
        }
    }

    rankHeatMap(drug, i, dataset, responseType) {
        // grabbing the clicked data value.
        const data = dataset[i];
        const { node } = this;
        const { dimensions } = this.props;
        const { drugId } = this.props;
        const { margin } = this.props;
        const { className } = this.props;
        const { dataset: datasetId } = this.props;

        // responses.
        const responses = ['CR', 'PR', 'SD', 'PD', '', 'NA'];
        const newSortedPatients = [];

        // this produces the newSortedData.
        if (responseType === 'mRECIST') {
            responses.forEach((val) => {
                Object.keys(data).forEach((res) => {
                    if (data[res][responseType] === val || data[res] === val) {
                        newSortedPatients.push(res);
                    }
                });
            });
        } else {
            // grab the sortable data.
            const sortable = [];
            Object.keys(data).forEach((res) => {
                sortable.push([res, data[res][responseType]]);
            });

            sortable.sort((a, b) => a[1] - b[1]);
            // push the data to new sorted patients array.
            sortable.forEach((val) => {
                if (val[1] === undefined) {
                    newSortedPatients.push(val[0]);
                } else {
                    newSortedPatients.unshift(val[0]);
                }
            });
        }

        // setting the variables with new data.
        const newDataset = [];

        // sort the dataset or complete data according to the new sorted patient ids.
        dataset.forEach((val, i) => {
            newDataset.push({});
            newSortedPatients.forEach((patient) => {
                newDataset[i][patient] = val[patient];
            });
        });

        this.setState({
            modifiedPatients: newSortedPatients,
        }, () => {
            const { setPatients } = this.context;
            const { modifiedPatients } = this.state;
            // calling the context setPatients method.
            setPatients(modifiedPatients);
        });

        // removing the heatmap wrapper and tooltip from the DOM when clicked on drug.
        d3.select(`#heatmap-${className}`).remove();
        d3.select('#heatmap-tooltip').remove();

        // finally calling the makeHeatMap function in order passing
        // new dataset in order to make new heatmap based on ranking.
        this.makeHeatmap(newDataset, newSortedPatients, drugId, datasetId, className, dimensions, margin, node, responseType);

        // making the circle visible on click of the drug.
        d3.select(`#circle-${drug.replace(/\s/g, '').replace(/\+/g, '')}`)
            .style('visibility', 'visible');
    }

    rankHeatMapBasedOnOncoprintChanges(value) {
        const { node } = this;
        const { data } = this.props;
        const { drugId } = this.props;
        const { globalPatients } = value;
        const { dimensions } = this.props;
        const { margin } = this.props;
        const { className } = this.props;
        const { dataset } = this.props;
        const { responseValue: responseType } = this.state;
        const newDataset = [];

        // sort the complete data according to the globalPatients.
        data.forEach((val, i) => {
            newDataset.push({});
            globalPatients.forEach((patient) => {
                newDataset[i][patient] = val[patient];
            });
        });

        // removing the heatmap wrapper and tooltip from the DOM when clicked on drug.
        if (globalPatients.length > 0) {
            d3.select(`#heatmap-${className}`).remove();
            d3.select('#heatmap-tooltip').remove();
            this.makeHeatmap(newDataset, globalPatients, drugId, dataset, className, dimensions, margin, node, responseType);
        }
    }

    // static contextType = PatientContext;

    render() {
        const { responseValue } = this.state;
        const { data } = this.props;
        const { modifiedPatients } = this.state;
        return (
            <div>
                <div style={{ position: 'relative' }}>
                    <select
                        className="select"
                        id="selectButton"
                        style={{
                            display: 'block',
                            align: 'right',
                            height: '30px',
                            marginTop: '290px',
                            position: 'absolute',
                            right: '80px',
                        }}
                    />
                </div>
                <div ref={(node) => { this.node = node; }} className="heatmap-wrapper">
                    {
                        responseValue !== 'mRECIST' ? <DensityPlot response={responseValue} data={data} patients={modifiedPatients} /> : <div />
                    }
                </div>
                <PatientConsumer>{(value) => { this.rankHeatMapBasedOnOncoprintChanges(value); }}</PatientConsumer>
            </div>
        );
    }
}

HeatMap.contextType = PatientContext;

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
