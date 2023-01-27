import { select } from 'd3';

/**
 * creates a tooltip that can be used in different react components
 * @param {String} id - string to select the element using the id
 * @returns {Object}
 */
function createToolTip(id) {
    return select(`#${id}`)
        .append('div')
        .attr('id', 'tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('border', 'solid')
        .style('border-width', '1px')
        .style('border-radius', '5px')
        .style('padding', '5px')
        .attr('top', 0)
        .attr('left', 0);
}

export default createToolTip;
