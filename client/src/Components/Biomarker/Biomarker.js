import React from 'react';
import GlobalStyles from '../../GlobalStyles';
import Footer from '../Footer/Footer';
import ForestPlot from '../Plots/ForestPlot';
import BiomarkerSelect from './BiomarkerSelect';
import data from './data';
import { StyledBiomarker } from './BiomarkerStyle';



/**
 * 
 * @param {Object} props 
 * @returns - Biomarker Component
 */
const Biomarker = (props) => {
    const { location } = props;

    // get gene and drug list from params
    // selected drug and selected gene from params also
    const params = new URLSearchParams(location.search);
    const geneList = params.get('geneList');
    const selectedGene = params.get('selectedGene');
    const drugList = params.get('drugList');
    const selectedDrug = params.get('selectedDrug');

    return (
        <StyledBiomarker>
            <GlobalStyles />
            <div className='wrapper'>
                <div className='biomarker-wrapper'>
                    <BiomarkerSelect
                        geneList={geneList}
                        selectedGene={selectedGene}
                        drugList={drugList}
                        selectedDrug={selectedDrug}
                    />
                    <ForestPlot data={data.gctd} />
                </div>
            </div>
            <Footer />
        </StyledBiomarker>
    )
};

export default Biomarker;
