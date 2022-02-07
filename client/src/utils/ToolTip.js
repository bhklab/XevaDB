import { select } from 'd3';

const createToolTip = function (id) {
    return select(`#${id}`)
        .append('div')
        .attr('id', 'tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('border', 'solid')
        .style('border-width', '1px')
        .style('border-radius', '5px')
        .style('padding', '5px')
        .attr('top', 10)
        .attr('left', 10)
};

export default createToolTip;
