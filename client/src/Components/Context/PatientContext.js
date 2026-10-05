import React from 'react';

const PatientContext = React.createContext({
    globalPatients: [],
    setPatients: () => { },
    plotDimensions: null,
    setPlotDimensions: () => { },
    plotMargin: null,
    setPlotMargin: () => { },
});

export default PatientContext;
