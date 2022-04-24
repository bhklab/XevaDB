import styled from 'styled-components';
import colors from '../../styles/colors';


// Biomarker Component Styles
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

// Selection Styles
const StyledSelect = styled.div`
    width: 80%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin: 2% 5% 7.5% 10%;
    
    .drug-select, .gene-select, .genomics-select {
        width: 30%;
        margin: 15px;
    }

    span {
        margin-bottom: 5px;
        color: ${colors.pink_header};
        font-size: 1.15rem;
        font-weight: 600;
        display: inline-block;
    }
`;

export {
    StyledBiomarker,
    StyledSelect,
};
