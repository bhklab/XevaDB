/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import PatientContext, { PatientConsumer } from '../../Context/PatientContext';
// import DensityPlot from '../DensityPlot/DensityPlot';
import BoxPlot from '../BoxPlot';
import colors from '../../../styles/colors';
import createToolTip from '../../../utils/ToolTip';

class HeatMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modifiedPatients: [],
            responseValue: 'mRECIST',
        };
        this.makeHeatMap = this.makeHeatMap.bind(this);
        this.rankHeatMap = this.rankHeatMap.bind(this);
        this.rankHeatMapBasedOnOncoprintChanges = this.rankHeatMapBasedOnOncoprintChanges.bind(this);
        this.calcMargin = this.calcMargin.bind(this);
        // adding tool tip function 
        this.createToolTip = createToolTip.bind(this);
    }

    componentDidMount() {
        this.makeHeatMap();
    }

    // calculates the new margin for the heatmap.
    calcMargin(selectedOption) {
        let margin = '';
        if (selectedOption === 'mRECIST') {
            margin = {
                top: 200, right: 250, bottom: 50, left: 250,
            };
        } else {
            margin = {
                top: 100, right: 250, bottom: 50, left: 250,
            };
        }
        return margin;
    };

    // main heatmap function taking parameters as data, all the patient ids and drugs.
    makeHeatMap(data = this.props.data, patient = this.props.patientId, margin = this.props.margin) {
        // props data
        const { drugId: drug } = this.props;
        const { dimensions } = this.props;
        const { className: plotId } = this.props;
        const { dataset } = this.props;
        const { responseValue: responseType } = this.state;
        const { geneList } = this.props;

        // height and width for the SVG based on the number of drugs and patient/sample ids.
        // height and width of the rectangles in the main skeleton.
        const rectHeight = dimensions.height;
        const rectWidth = dimensions.width;

        // this height and width is used for setting the body.
        const height = drug.length * rectHeight;
        const width = patient.length * rectWidth;

        const targetEval = [
            { CR: `${colors.blue}` },
            { PR: `${colors.green}` },
            { SD: `${colors.yellow}` },
            { PD: `${colors.red}` },
        ];

        const targetColor = {
            CR: `${colors.blue}`,
            PR: `${colors.green}`,
            SD: `${colors.yellow}`,
            PD: `${colors.red}`,
            NA: `${colors.lightgray}`,
        };

        // initializing the tooltip
        const tooltip = this.createToolTip('heatmap');

        // setting the query strings
        let drugUse = '';
        let drugIndex = 0;
        const patientUse = patient;

        // ********************************************************************* //
        // ********************* drug and patient evaluations ****************** //
        // ********************************************************************* //
        let maxDrug = 0;
        let drugEvaluations = {};
        if (responseType === 'mRECIST') {
            for (let i = 0; i < drug.length; i++) {
                drugEvaluations[drug[i]] = {
                    CR: 0, PR: 0, SD: 0, PD: 0, NA: 0,
                };
            }
        }

        let patientEvaluations = {};
        if (responseType === 'mRECIST') {
            for (let j = 0; j < patient.length; j++) {
                patientEvaluations[patient[j]] = {
                    CR: 0, PR: 0, SD: 0, PD: 0, NA: 0, total: 0,
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
                drugEvaluations[drugAlt][key[1][responseType]]++;
                patientEvaluations[key[0]][key[1][responseType]]++;
                if (key[1] !== 'NA') {
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
                return `/curve?patient=${patientUse[i]}&drug=${drugUse}&dataset=${dataset}`;
            }
        }

        // reference to this
        const reference = this;

        // ********************************************************************* //
        // **************************** selection dropdown *********************** //
        // ********************************************************************* //
        // create a selection dropdown.
        function createSelection() {
            const options = ['mRECIST', 'Slope', 'Best Average Response', 'AUC'];

            d3.select('.select')
                .selectAll('option')
                .data(options)
                .enter()
                .append('option')
                .text((d) => d)
                .attr('value', (d) => d)
                .attr('selected', (d) => {
                    if (d === 'mRECIST') {
                        return 'selected';
                    }
                });


            d3.select('.select').on('change', function () {
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
                }, function () {
                    d3.select(`#heatmap-${plotId}`).remove();
                    d3.select('#heatmap-tooltip').remove();

                    let margin = this.calcMargin(selectedOption);

                    this.makeHeatMap(data, patient, margin);
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

        // ********************************************************************* //
        // ********************* legends (Except for mRECIST) ****************** //
        // ********************************************************************* //
        // creating legend for the response type except for mRECIST.
        function createLegend(svg, height, width, min, max, drug) {
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
                .attr('stop-color', `${colors.amber_gradient}`);

            // Set the color for the start (50%)
            linearGradient.append('stop')
                .attr('offset', min < 0 ? '50%' : '100%')
                .attr('stop-color', `${colors.white_gradient}`);

            // Set the color for the end (100%)
            if (min < 0) {
                linearGradient.append('stop')
                    .attr('offset', '100%')
                    .attr('stop-color', `${colors.green_gradient}`);
            }

            // Draw the rectangle and fill with gradient
            const heightConstant = drug.length > 4 ? 4 : 2.5;
            svg.append('rect')
                .attr('x', width + (rectWidth * 8))
                .attr('y', height / 3)
                .attr('width', rectHeight)
                .attr('height', rectHeight * heightConstant)
                .style('fill', 'url(#linear-gradient)');

            // legend value.
            const targetRect = svg.append('g')
                .attr('id', 'small_rect');

            const legendValue = [max, min];
            targetRect.selectAll('text')
                .data(legendValue)
                .enter()
                .append('text')
                .attr('x', width + (rectWidth * 8))
                .attr('y', (d, i) => [height / 3 - 5, height / 3 + (rectHeight * heightConstant) + 12][i])
                .text((d) => d)
                .attr('font-size', '14px')
                .style('text-anchor', 'start');
        }

        // ********************************************************************* //
        // *********************** scale for the main skeleton ***************** //
        // ********************************************************************* //
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

        // ********************************************************************* //
        // **************************** SVG Canvas ***************************** //
        // ********************************************************************* //
        // make the SVG element.
        const svg = d3.select('#heatmap')
            .append('svg')
            .attr('id', `heatmap-${plotId}`)
            .attr('xmlns', 'http://wwww.w3.org/2000/svg')
            .attr('xmlns:xlink', 'http://wwww.w3.org/1999/xlink')
            .attr('height', height + margin.bottom + margin.top)
            .attr('width', width + margin.left + margin.right)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .attr('id', `heatmap-${plotId}-g`);

        /** HEATMAP SKELETON * */

        // structure of the heatmap
        const skeleton = svg.append('g')
            .attr('id', 'skeleton');


        // ********************************************************************* //
        // ******************* Circles on y-axis (for sorting) ***************** //
        // ********************************************************************* //
        /** Appending Circle to the  Y-Axis */
        const circles = skeleton
            .append('g')
            .attr('id', 'circle-group');

        drug.forEach((val, i) => {
            circles
                .append('circle')
                .attr('cx', -10)
                .attr('cy', i)
                .attr('r', 6)
                .attr('id', `circle-${val.replace(/\s/g, '').replace(/\+/g, '')}`)
                .style('fill', `${colors.green_gradient}`)
                .attr('transform', `translate(0,${yScale(val) + rectWidth - i})`)
                .style('visibility', 'hidden');
        });

        // this will create g element for each of data row (equivalent to total number of row)
        const drugResponse = skeleton.append('g')
            .attr('id', 'targ_rect');

        const gskeleton = drugResponse.selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr('transform', (d, i) => `translate(0,${i * rectHeight})`);


        // ********************************************************************* //
        // **************************** drug evaluations *********************** //
        // ********************************************************************* //
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
                        val = 'NA';
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
            .range([`${colors.green_gradient}`, `${colors.white_gradient}`, `${colors.amber_gradient}`]);
        // this will fill the rectangles with different color based on the data.
        drawrectangle.attr('fill', (d) => {
            if (responseType === 'mRECIST') {
                return targetColor[d];
            } if (responseType !== 'mRECIST' && d === 'NA') {
                return 'lightgray';
            }
            return linearColorScale(d);
        });

        // reset
        drugEvaluations = {};
        for (let i = 0; i < drug.length; i++) {
            drugEvaluations[drug[i]] = {
                CR: 0, PR: 0, SD: 0, PD: 0, NA: 0,
            };
        }

        // patient evaluations
        patientEvaluations = {};
        for (let j = 0; j < patient.length; j++) {
            patientEvaluations[patient[j]] = {
                CR: 0, PR: 0, SD: 0, PD: 0, NA: 0, total: 0,
            };
        }

        // ********************************************************************* //
        // **************************** tooltip *********************** //
        // ********************************************************************* //
        const createToolTip = (x, y, patient, response) => {
            // tooltip on mousever setting the div to visible.
            tooltip
                .style('visibility', 'visible');

            // tooltip grabbing event.pageX and event.pageY
            // and set color according to the ordinal scale.
            const tooltipDiv = tooltip
                .style('left', `${x + 10}px`)
                .style('top', `${y + 10}px`)
                .style('color', `${colors.black}`)
                .style('background-color', `${colors.white}`);

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

        // ********************************************************************* //
        // ********************* event listener to rectangles ****************** //
        // ********************************************************************* //
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
                        val = 'NA';
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
            .attr('fill', `${colors.black}`)
            .attr('y', rectHeight)
            .style('opacity', 0)
            // eslint-disable-next-line func-names
            .on('mouseover', function (d, i) {
                // creating tooltip by calling createtooltip function.
                const patientToolTip = patient[i];
                createToolTip(d3.event.pageX, d3.event.pageY, patientToolTip, d);
                // highlight
                const drugClass = d3.select(this).attr('class').split(' ')[1];
                d3.selectAll(`.hmap-hlight-${patient[i].replace('.', '')}`)
                    .style('opacity', 0.2);
                d3.selectAll(`.oprint-hlight-${patient[i].replace('.', '')}`)
                    .style('opacity', 0.2);
                d3.selectAll(`.hlight-space-${patient[i].replace('.', '')}`)
                    .style('opacity', 0.2);

                return drugClass;
            })
            // eslint-disable-next-line func-names
            .on('mouseout', function (d, i) {
                // hide tooltip
                hideToolTip();
                // highlight
                const drugClass = d3.select(this).attr('class').split(' ')[1];
                d3.selectAll(`.hmap-hlight-${patient[i].replace('.', '')}`)
                    .style('opacity', 0);
                d3.selectAll(`.oprint-hlight-${patient[i].replace('.', '')}`)
                    .style('opacity', 0);
                d3.selectAll(`.hlight-space-${patient[i].replace('.', '')}`)
                    .style('opacity', 0);

                return drugClass;
            });

        // Creating lines.
        const lines = skeleton.append('g')
            .attr('id', 'lines')
            .attr('transform', () => `translate(2,${height + rectHeight})`);

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
            .attr('y2', rectHeight * 3)
            .attr('stroke', `${colors.black}`)
            .attr('stroke-width', 1)
            .style('stroke-dasharray', '3 2')
            .style('opacity', 0.2);

        lines.selectAll('rect.hlight-space')
            .data(patient)
            .enter()
            .append('rect')
            .attr('class', (d) => `hlight-space-${d}`)
            .attr('width', rectWidth - 2)
            .attr('height', rectHeight)
            .attr('x', (d, i) => i * rectWidth - 2)
            .attr('fill', `${colors.black}`)
            .attr('y', 0)
            .style('opacity', 0);


        // ********************************************************************* //
        // **************************** biomarker Image *********************** //
        // ********************************************************************* //
        const biomarkerImage = skeleton
            .append('g')
            .attr('id', 'biomarker-image')


        biomarkerImage.selectAll('div')
            .data(drug)
            .join('a')
            .attr('xlink:href', (d) => geneList ? `/biomarker?genes=${geneList.join(',')}&drug=${d}` : `/biomarker?drug=${d}`)
            .append('text')
            .text('🧬')
            .attr('x', -40)
            .attr('y', (d, i) => (i + 1.75) * rectHeight)
            .on('mouseover', function (d) {
                const tooltipDiv = tooltip
                    .style('visibility', 'visible')
                    .style('left', `${d3.event.pageX - 100}px`)
                    .style('top', `${d3.event.pageY + 15}px`)
                    .style('color', `${colors.black}`)
                    .style('background-color', `${colors.white}`)

                // add text to tooltip
                tooltipDiv
                    .append('text')
                    .attr('id', 'tooltip-biomarker')
                    .text('Redirect to Biomarker Page');
            })
            .on('mouseout', function () {
                // hide the tooltip
                tooltip
                    .style('visibility', 'hidden');

                // remove the biomarker tooltip data
                d3.select('#tooltip-biomarker').remove();
            });

        // ********************************************************************* //
        // *************** X-AXIS AND Y-AXIS FOR THE SKELETONs ****************** //
        // ********************************************************************* //
        // calling the y-axis and removing the stroke.
        const drugName = skeleton.append('g')
            .attr('id', 'drugName')
            .attr('transform', 'translate(-20, 0)');

        drugName.attr('stroke-width', '0')
            .style('font-family', 'Open Sans')
            .style('font-size', '11px')
            .call(yAxis)
            .selectAll('text')
            .attr('fill', (d) => {
                if (d.match(/(^untreated$|^water$|^control$|^h2o$)/i)) { return `${colors.pink_header}`; }
                return `${colors.blue_header}`;
            })
            .attr('font-weight', (d) => {
                if (d.match(/(^untreated$|^water$|^control$|^h2o$)/i)) { return '700'; }
                return '550';
            })
            .attr('id', (d) => `tick-${d.replace(/\s/g, '').replace(/\+/g, '')}`)
            // eslint-disable-next-line func-names
            .on('mouseover', function () {
                // tooltip on mousever setting the div to visible.
                d3.select('#heatmap')
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
                    .style('color', `${colors.black}`)
                    .style('background-color', `${colors.white}`)
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
                // margin
                let margin = this.calcMargin(responseType);
                // highlight.
                this.rankHeatMap(d, i, data, responseType, margin);
            });

        // calling the x-axis to set the axis and we have also transformed the text.
        const patientId = skeleton.append('g')
            .attr('id', 'patient_id');

        patientId.attr('stroke-width', '0')
            .style('font-size', '11px')
            .style('font-family', 'Open Sans')
            .style('text-anchor', (dataset === '7' ? 'start' : 'middle'))
            .call(xAxis)
            .selectAll('text')
            .attr('transform', 'rotate(-90)')
            .attr('font-weight', '550')
            .attr('fill', `${colors.blue_header}`)
            .attr('x', (dataset === '7' ? '-2.4em' : '0.6em'))
            .attr('y', '.15em');


        // ********************************************************************* //
        // ********** SMALL RECTANGLES ON RIGHT SIDE OF HEATMAP  *************** //
        // ********************************************************************* //
        // This will create four rectangles on right side for the Evaluation of target lesions.
        if (responseType === 'mRECIST') {
            const targetRect = skeleton.append('g')
                .attr('id', 'small_rect');

            targetRect.selectAll('rect')
                .data(targetEval)
                .enter()
                .append('rect')
                .attr('x', width * 1.20)
                .attr('y', (d, i) => height > rectHeight * 3 ? (height / 3 + i * rectHeight * 0.75) : (height / 6 + i * rectHeight * 0.75))
                .attr('height', rectWidth)
                .attr('width', rectWidth)
                .attr('fill', (d) => Object.values(d));

            targetRect.selectAll('text')
                .data(targetEval)
                .enter()
                .append('text')
                .attr('x', width * 1.23)
                .attr('y', (d, i) => height > rectHeight * 3 ? (height / 3 + i * rectHeight * 0.75 + 12) : (height / 6 + i * rectHeight * 0.75 + 12))
                .text((d) => Object.keys(d))
                .attr('fill', `${colors.blue_header}`)
                .attr('font-size', '14px');


            // ********************************************************************* //
            // ********** VERTICAL GRAPH ON RIGHT SIDE OF HEATMAP  *************** //
            // ********************************************************************* //
            const strokeWidth = 0.75;

            // This will make a right side vertical graph.
            const drugEval = skeleton.append('g')
                .attr('id', 'drug_eval');

            const drugScale = d3.scaleLinear()
                .domain([0, maxDrug])
                .range([0, rectWidth * 5]);

            // This will set an x-axis for the vertical graph.
            const xAxisVertical = d3.axisTop()
                .scale(drugScale)
                .ticks(4)
                .tickSize(3)
                .tickFormat(d3.format('.0f'));

            skeleton.append('g')
                .attr('transform', `translate(${patient.length * rectWidth + rectWidth},${rectHeight})`)
                .call(xAxisVertical)
                .selectAll('text')
                .attr('fill', `${colors.black}`)
                .style('font-size', 8)
                .attr('stroke', 'none');

            drugEval.append('rect')
                .attr('class', 'drug_eval_rect')
                .attr('x', patient.length * rectWidth + rectWidth)
                .attr('y', `${rectHeight}`)
                .attr('height', rectHeight * drug.length)
                .attr('width', drugScale(maxDrug))
                .attr('fill', `${colors.white}`)
                .style('stroke', `${colors.black}`)
                .style('stroke-width', 1);

            // rectangle for vertical graph.
            const drugEvaluationRectangle = (iterator) => {
                const responseEvalTypes = ['CR', 'PR', 'SD', 'PD'];
                let xRange = patient.length * rectWidth + rectWidth;
                let width = 0;
                responseEvalTypes.forEach((type) => {
                    // x range for the rectangles.
                    xRange += width;
                    width = drugScale(drugEvaluations[drug[iterator]][type]);
                    drugEval.append('rect')
                        .attr('class', `drug_eval_${type}`)
                        .attr('height', rectHeight - 4)
                        .attr('width', width)
                        .attr('x', xRange)
                        .attr('y', rectHeight * (iterator + 1))
                        .attr('fill', targetColor[type])
                        .style('stroke', `${colors.black}`)
                        .style('stroke-width', strokeWidth);
                });
            };

            for (let i = 0; i < drug.length; i++) {
                drugEvaluationRectangle(i);
            }


            // ********************************************************************* //
            // ********** HORIZONTAL GRAPH AT THE TOP OF HEATMAP  *************** //
            // ********************************************************************* //
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
                    .attr('width', patient.length * `${rectWidth}`)
                    .attr('fill', `${colors.white}`)
                    .style('stroke', `${colors.black}`)
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
                            .attr('width', `${rectWidth - 4}`)
                            .attr('x', iterator * `${rectWidth}`)
                            .attr('y', yRange)
                            .attr('fill', targetColor[type])
                            .style('stroke', `${colors.black}`)
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
            createLegend(svg, height, width, min, max, drug);
        }
    }

    rankHeatMap(drug, i, dataset, responseType, margin = this.props, { dimensions } = this.props,
        { drugId } = this.props, { className } = this.props, { dataset: datasetId } = this.props) {
        // grabbing the clicked data value.
        const data = dataset[i];

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
        this.makeHeatMap(newDataset, newSortedPatients, margin);

        // making the circle visible on click of the drug.
        d3.select(`#circle-${drug.replace(/\s/g, '').replace(/\+/g, '')}`)
            .style('visibility', 'visible');
    }

    rankHeatMapBasedOnOncoprintChanges(value) {
        const { data } = this.props;
        const { globalPatients } = value;
        const { className } = this.props;

        // recover the option that has been chosen
        const selectedOption = d3.select('select').property('value');

        // margin
        const margin = this.calcMargin(selectedOption);

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
            this.makeHeatMap(newDataset, globalPatients, margin);
        }
    }

    render() {
        const { responseValue } = this.state;
        const { data } = this.props;
        const { modifiedPatients } = this.state;
        const { drugId: drugs } = this.props;

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
                            marginTop: '90px',
                            position: 'absolute',
                            right: '20px',
                            width: '140px',
                        }}
                    />
                </div>
                <div id="heatmap">
                    {
                        responseValue !== 'mRECIST' ? <BoxPlot response={responseValue} data={data} patients={modifiedPatients} drugs={drugs} /> : <div />
                    }
                </div>
                <PatientConsumer>{(value) => { value.globalPatients.length > 0 && this.rankHeatMapBasedOnOncoprintChanges(value); }}</PatientConsumer>
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
    geneList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default HeatMap;
