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
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin: 2% 5% 7.5% 10%;
    
    .drug-select, .gene-select, .genomics-select {
        width: 26%;
        margin: 15px;
    }

    .display-button {
        button {
            padding: 12px;
            margin: 20px 0 0 15px;
            // background-color: ${colors.pink_header};
            border: 0;
            border-radius: 5px;
            font-size: 1.05rem;
        }

        button:hover {
            cursor: pointer;
        }
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
