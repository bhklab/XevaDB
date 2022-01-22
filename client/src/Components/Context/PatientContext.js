import React from 'react';

const PatientContext = React.createContext({
    globalPatients: [],
    setPatients: () => { },
});

const PatientProvider = PatientContext.Provider;
const PatientConsumer = PatientContext.Consumer;

export { PatientProvider, PatientConsumer };
export default PatientContext;
