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

/**
 * 
 * @param {Array} data - array of input data
 */
const getAllDataTypes = (data) => {
    // variable to store the different data types.
    const dataTypes = [];
    // looping through and storing the data type if it's not already present.
    data.forEach(el => {
        if (!dataTypes.includes(el.mDataType)) {
            dataTypes.push(el.mDataType);
        }
    });
    return dataTypes;
};


// Biomarker component
const Biomarker = (props) => {
    const { location } = props;
    // get genes param
    const params = new URLSearchParams(location.search);
    const genes = params.get('genes');
    const drug = params.get('drug');
    const mDataTypes = getAllDataTypes(data.gctd);

    return (
        <StyledBiomarker>
            <GlobalStyles />
            <div className='wrapper'>
                <div className='biomarker-wrapper'>
                    {/* <h1> Biomarker </h1> */}
                    <BiomarkerSelect genes={genes} drug={drug} dataTypes={mDataTypes} />
                    <ForestPlot data={data.gctd} />
                </div>
            </div>
            <Footer />
        </StyledBiomarker>
    )
};

export default Biomarker;
