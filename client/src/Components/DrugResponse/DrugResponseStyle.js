import styled from 'styled-components';
import colors from '../../styles/colors';

const SelectWrapper = styled.div`
    margin-top: 40px;
    padding: 20px;
    width: 45vw;
    display: flex;
    gap: 40px;

    .dataset-select, .drug-select {
        width: 100%;
    }

    span {
        margin-bottom: 5px;
        color: ${colors['--main-font-color']};
        font-size: 1em;
        font-weight: 500;
        display: inline-block;
    }

    button {
        width: 110px;
        padding: 10px;
        background-color: ${colors['--bg-color']};
        border: 0;
        border-radius: 5px;
        font-size: 1rem;
        color: ${colors.white};
    }

    button:hover {
        cursor: pointer;
    }

    @media only screen and (max-width: 2100px) {
        width: 55vw;
    }

    @media only screen and (max-width: 1600px) {
        width: 60vw;
    }

    @media only screen and (max-width: 1400px) {
        width: 70vw;
    }
`;

export default SelectWrapper;
