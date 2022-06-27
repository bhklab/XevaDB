import React from 'react';
import Plot from 'react-plotly.js';
import colors from '../../styles/colors';

const config = {
    responsive: true,
    displayModeBar: false,
};

const SunburstPlot = (
    { labels, parents, values, sunburstcolorway }
) => {
    return (
        <Plot
            data={[{
                type: "sunburst",
                labels,
                parents,
                values,
                outsidetextfont: { size: 20, color: colors.black },
                leaf: { opacity: 1 },
                marker: { line: { width: 3 } },
            }]}
            layout={{
                margin: { l: 0, r: 0, b: 0, t: 0 },
                sunburstcolorway,
                width: 800,
                height: 800,
                showlegend: false
            }}
            config={config}
        />
    );
};

export default SunburstPlot;
