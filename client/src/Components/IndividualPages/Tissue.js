import React from 'react';
import GlobalStyles from '../../GlobalStyles';
import Footer from '../Footer/Footer';

// Tissue Component.
const Tissue = () => {
    return (
        <>
            <GlobalStyles />
            <div className="wrapper">
                <h1> Tissue Page </h1>
                <Footer />
            </div>
            <Footer />
        </>
    );
};

export default Tissue;
