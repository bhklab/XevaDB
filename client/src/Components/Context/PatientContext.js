import React from 'react';

const PatientContext = React.createContext({
    globalPatients: [],
    setPatients: () => { },
});

export default PatientContext;
