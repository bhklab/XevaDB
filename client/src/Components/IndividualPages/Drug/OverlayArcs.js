import React, { useEffect } from 'react';
import * as d3 from 'd3';
import createSvgCanvas from '../../../utils/CreateSvgCanvas';
import mRECISTColorMapper from '../../../utils/mRECISTColorMapper';

const PADDING = 0.01;

/**
 * 
 * @param {Array} totalResponseData 
 * @param {number} sumOfValues 
 * @returns {Object} - object of the transformed response data
 */
const updateTotalResponseData = (totalResponseData, sumOfValues) => {
    // stores the current end angle
    let currentStartAngle = PADDING;

    // update data
    let updatedTotalResponseData = {};
    totalResponseData.forEach(response => {
        const endAngle = currentStartAngle + (response.value / sumOfValues) * 2 * Math.PI;
        updatedTotalResponseData[response.id] = {
            ...response,
            startAngle: currentStartAngle,
            endAngle: endAngle,
        };
        currentStartAngle = endAngle;
    });

    return updatedTotalResponseData;
};

/**
 * 
 * @param {Array} individualDrugResponseData 
 * @param {Object} updatedTotalResponseData 
 * @param {number} sumOfValues 
 * @returns {Array} - an array of the transformed data
 */
const updateIndividualDrugResponseData = (
    individualDrugResponseData, updatedTotalResponseData, sumOfValues
) => {
    const updatedIndividualDrugResponseData = [];

    individualDrugResponseData.forEach(response => {
        if (response.value > 0) {
            const startAngle = updatedTotalResponseData[response.id]['startAngle'];
            const endAngle = startAngle + (response.value / sumOfValues) * 2 * Math.PI;
            updatedIndividualDrugResponseData.push({
                ...response,
                startAngle,
                endAngle,
            });
        }
    });

    return updatedIndividualDrugResponseData;
}

/**
 * function to create overlay arcs
 */
const createOverlayArcs = ({
    totalResponseData,
    individualDrugResponseData,
    height,
    width,
    arcRadius,
    margin,
}) => {
    // create svg canvas
    const svg = createSvgCanvas({ id: 'overlay-arcs-container', height, width, margin });

    // get the total of the values in totalResponse data
    const sumOfValues = totalResponseData.reduce(
        (previous, current) => previous + current.value, 0
    );

    // updated total response data
    const updatedTotalResponseData = updateTotalResponseData(totalResponseData, sumOfValues);

    // get the updated response data for individual drug
    const updatedIndividualDrugResponseData = updateIndividualDrugResponseData(
        individualDrugResponseData, updatedTotalResponseData, sumOfValues
    );

    // creates the arcs
    updatedIndividualDrugResponseData.forEach(response => {
        const arc = d3.arc()
            .innerRadius(arcRadius.innerRadius)
            .outerRadius(arcRadius.outerRadius)
            .startAngle(response.startAngle)
            .endAngle(response.endAngle);

        svg.append('path')
            .attr('class', 'arc')
            .attr('d', arc)
            .attr('fill', `${mRECISTColorMapper[response.id]}`);
    });
};


/**
 * OverlayArcs component creates arcs based on the input data
 * @returns {component} - returns an OverlayArcs component
 */
const OverlayArcs = (
    {
        totalResponseData,
        individualDrugResponseData,
        dimensions,
        arcRadius,
        margin,
    }
) => {
    // get height and width from the dimensions object
    const { height, width } = dimensions;

    // use effect hook, running on component mount
    useEffect(() => {
        createOverlayArcs({
            totalResponseData,
            individualDrugResponseData,
            height,
            width,
            arcRadius,
            margin,
        });
    }, []);


    return (
        <div id='overlay-arcs-container'></div>
    )
};

export default OverlayArcs;
