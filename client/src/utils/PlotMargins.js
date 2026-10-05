/**
 * Calculates responsive margins for HeatMap and Oncoprint plots.
 * Dynamically computes left margin based on the longest drug name so combination
 * drugs (e.g. "BGJ398_CRIZOTINIB", "PACLITAXEL + TRASTUZUMAB") do not bleed off
 * the left edge of the page, while maintaining horizontal alignment between plots.
 *
 * @param {Array|string} drugList - array of drug names or comma-separated string
 * @returns {Object} margin object { top, right, bottom, left }
 */
export const computePlotMargins = (drugList) => {
    let maxLen = 0;
    if (Array.isArray(drugList)) {
        drugList.forEach((d) => {
            if (d && typeof d === 'string' && d.length > maxLen) {
                maxLen = d.length;
            }
        });
    } else if (typeof drugList === 'string' && drugList.length > 0) {
        drugList.split(',').forEach((d) => {
            const trimmed = d.trim();
            if (trimmed.length > maxLen) {
                maxLen = trimmed.length;
            }
        });
    }

    // Each character at 11px font in Arial/sans-serif averages ~7.5px.
    // Add 40px buffer for tick lines, label padding, and canvas edge margin.
    const calculatedLeft = Math.ceil(maxLen * 7.5) + 40;

    // Minimum 140px, maximum 340px
    const left = Math.max(140, Math.min(340, calculatedLeft));

    return {
        top: 250,
        right: 25,
        bottom: 50,
        left,
    };
};

export default computePlotMargins;
