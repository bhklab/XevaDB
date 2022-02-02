import React from 'react';
import GlobalStyles from '../../GlobalStyles';
import Footer from '../Footer/Footer';
import ForestPlot from '../Plots/ForestPlot';
import styled from 'styled-components';
import data from './data';

// Biomarker styles
const StyledBiomarker = styled.div`
    h1 {
        margin: 5px 0 60px 0;
    }
`;


// Biomarker component
const Biomarker = () => {
    return (
        <StyledBiomarker>
            <GlobalStyles />
            <div className='wrapper'>
                <div className="donut-wrapper">
                    <h1> Biomarker </h1>
                    <ForestPlot data={data.gctd} />
                </div>
            </div>
            <Footer />
        </StyledBiomarker>
    )
};

export default Biomarker;
