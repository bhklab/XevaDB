import React, { useEffect } from 'react';
import * as d3 from 'd3';
import createSvgCanvas from '../../../utils/CreateSvgCanvas';

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
        // create svg canvas
        const svg = createSvgCanvas({ id: 'overlay-arcs-container', height, width, margin });

        const startAngleValue = 0;

        const arc1 = d3.arc()
            .innerRadius(180)
            .outerRadius(280)
            .startAngle(0)
            .endAngle((27 / 4515) * 2 * Math.PI);

        svg.append("path")
            .attr("class", "arc1")
            .attr("d", arc1)
            .attr("fill", "#fed976");

        const arc2 = d3.arc()
            .innerRadius(180)
            .outerRadius(280)
            .startAngle((2115 / 4515) * 2 * Math.PI)
            .endAngle((2131 / 4515) * 2 * Math.PI);

        svg.append("path")
            .attr("class", "arc1")
            .attr("d", arc2)
            .attr("fill", "#e41a1c");
    }, []);


    return (
        <div id='overlay-arcs-container'></div>
    )
};

export default OverlayArcs;
