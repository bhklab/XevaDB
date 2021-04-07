import React from 'react';
import TopNav from '../../TopNav/TopNav';
import GlobalStyles from '../../../GlobalStyles';
import Footer from '../../Footer/Footer';

const PatientSummary = () => {
    return (
        <>
            <TopNav />
            <GlobalStyles />
            <div className="wrapper">
                Patient Summary Page!
            </div>
            <Footer />
        </>
    );
};

export default PatientSummary;
