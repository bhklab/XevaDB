import React from 'react';
import Plot from 'react-plotly.js';

const SunburstPlot = ({ labels, parents, values }) => {
    console.log(labels, parents, values);
    return (
        <Plot
            data={[{
                type: "sunburst",
                labels: labels,
                parents: parents,
                values: values,
                outsidetextfont: { size: 20, color: "#377eb8" },
                // leaf: { opacity: 0.4 },
                marker: { line: { width: 2 } },
            }]}
            layout={{
                margin: { l: 0, r: 0, b: 0, t: 0 },
                width: 800,
                height: 800
            }}
        />
    );
};

export default SunburstPlot;
