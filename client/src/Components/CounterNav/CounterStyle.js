import styled from 'styled-components';
import colors from '../../styles/colors';

const CounterStyle = styled.div`
    display: flex;
    background-color: ${colors['--bg-color']};
    height: 60px;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    font-size: 0.8em;
    font-weight: 400;

    a {
        color: ${colors.white};
        letter-spacing: 2px;
        text-decoration: none;
        text-align: center;
    }

    h4 {
        margin: 0px;
    }

    .count {
        font-weight: 700;
    }
`;


export default CounterStyle;
