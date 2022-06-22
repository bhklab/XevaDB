import styled from 'styled-components';
import colors from '../../styles/colors';

const CounterStyle = styled.div`
    display: flex;
    background-color: ${colors.white};
    min-height: 7.5vh;
    max-height: 7.5vh;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    font-weight: 500;
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
    // when screen size is greater than 1800px
    @media only screen and (min-width: 1800px) {
        a {
            font-size: 0.9vw;
        }
    }
`;


export default CounterStyle;
