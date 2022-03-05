import React from 'react';
import GlobalStyles from '../../GlobalStyles';
import Footer from '../Footer/Footer';
import ForestPlot from '../Plots/ForestPlot';
import styled from 'styled-components';
import BiomarkerSelect from './BiomarkerSelect';
import colors from '../../styles/colors';
import data from './data';


// Biomarker styles
const StyledBiomarker = styled.div`
    h1 {
        margin: 20px 0 30px 0;
    }

    @media screen and (min-height: 1200px) {
        margin-top: 250px;

        .biomarker-wrapper {
            min-width: 1500px;
        }
    }
`;


// Biomarker component
const Biomarker = (props) => {
    const { location } = props;
    // get genes param
    const params = new URLSearchParams(location.search);
    const genes = params.get('genes');

    return (
        <StyledBiomarker>
            <GlobalStyles />
            <div className='wrapper'>
                <div className='biomarker-wrapper'>
                    {/* <h1> Biomarker </h1> */}
                    <BiomarkerSelect genes={genes} />
                    <ForestPlot data={data.gctd} />
                </div>
            </div>
            <Footer />
        </StyledBiomarker>
    )
};

export default Biomarker;
