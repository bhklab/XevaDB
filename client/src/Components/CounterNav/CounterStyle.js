import styled from 'styled-components';
import colors from '../../styles/colors';

const CounterStyle = styled.div`
    display: flex;
    background-color: ${colors.white};
    min-height: 8vh;
    max-height: 8vh;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    font-family: 'Open Sans', 'Roboto';
    font-weight: 500;
    font-size: 1.2vw;
    a {
        color: ${colors.blue_header};
        letter-spacing: 2px;
        font-weight: bold;
        text-decoration: none;
        &:hover {
            color: ${colors.pink_header};
        }
        text-align:center;
    }
    h4 {
        margin: 0px;
    }
`;


export default CounterStyle;
