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
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin: 4% 5% 7.5% 10%;
    
    .drug-select, .gene-select, .genomics-select, .metric-select {
        width: 19%;
        margin: 15px;
    }

    // .dataset-select, .drug-select, .gene-select, .genomics-select, .metric-select {
    //     width: 15%;
    //     margin: 10px;
    // }

    .display-button {
        button {
            padding: 12px;
            margin: 0 0 0 15px;
            background-color: ${colors['--bg-color']};
            border: 0;
            border-radius: 5px;
            font-size: 1.08rem;
            color: ${colors.white};
        }

        button:hover {
            cursor: pointer;
        }
    }

    span {
        margin-bottom: 5px;
        color: ${colors['--main-font-color']};
        font-size: 1em;
        font-weight: 500;
        display: inline-block;
    }

    .hidden {
        font-size: 0.75rem;
        visibility: hidden;
    }

    .visible {
        font-size: 0.75rem;
        visibility: visible;
    }
`;

export {
    StyledBiomarker,
    StyledSelect,
};
