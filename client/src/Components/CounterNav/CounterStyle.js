import styled from 'styled-components';
import colors from '../../styles/colors';

const DonutNav = styled.div`
    display: flex;
    background-color: ${colors.white_red};
    min-height: 9vh;
    max-height: 9vh;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    align-items: flex-end;
    justify-content: space-around;
    flex-wrap: wrap;
    font-family: 'Raleway', sans-serif;
    font-weight: 500;
    font-size: 1.4em;
    padding-bottom: 5px;
    a {
        padding: 10px;
        color: ${colors.blue_header};
        letter-spacing: 2px;
        font-weight: bold;
        font-size: 0.9em;
        text-decoration: none;
        &:hover {
            color: ${colors.pink_header};
        }
        text-align:center;
    }
    h4 {
        margin-top: 3px;
        margin-bottom: 0px;
    }

    @media screen and (max-width: 1500px) {
        a {
            font-size: 0.85em;
        }

        a:nth-child(1) {
            margin-left : 100px;
        }
    }

    @media screen and (max-width: 1300px) {
        a {
            font-size: 0.75em;
        }
        
        a:nth-child(1) {
            margin-left : 10px;
        }
    }

    @media screen and (max-width: 1000px) {
        a {
           font-size: 0.65em;
        }

        a:nth-child(1) {
            margin-left: 0px;
        }
    }

    @media screen and (max-width: 700px) {
        a {
           font-size: 0.55em;
        }

        a:nth-child(1) {
            margin-left : 0px;
        }
    }
`;


export default DonutNav;
