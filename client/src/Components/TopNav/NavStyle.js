import styled from 'styled-components';
import colors from '../../styles/colors';

const HeaderStyle = styled.header`
    *{
        margin: 0px;
        padding: 0px;
        box-sizing: border-box;
    }
    button {
        background-color: ${colors.blue_header}
    }
    display: flex;
    justify-content: space-around;
    align-items: center;
    min-height: 10vh;
    max-height: 10vh;
    font-family: 'Raleway', sans-serif;
    background-color: ${colors.white_red};
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
`;

const LinkStyle = styled.div`
    display: flex;
    justify-content: space-around;
    width: 60%;

    a {
        color: ${colors.blue_header};
        text-decoration: none;
        letter-spacing:1px;
        font-family: 'Raleway', sans-serif;
        font-weight: 700;
        font-size: 1.20em;
        &:hover {
            color: ${colors.pink_header};
            cursor: pointer;
        }
    }

    a:nth-child(1) {
        margin-left: 600px;
    }

    a:nth-child(6) {
        margin-right: -200px;
    }

    @media screen and (max-width: 2100px) {
        a {
            font-size: 1.20em;
        }

        a:nth-child(1) {
            margin-left: 100px;
        }

        a:nth-child(6) {
        margin-right: -100px;
        }
    }

    @media screen and (max-width: 1300px) {
        a {
            font-size: 1.15em;
        }
        
        a:nth-child(1) {
            margin-left: 10px;
        }
    }

    @media screen and (max-width: 1000px) {
        a {
           font-size: 1.05em;
        }

        a:nth-child(1) {
            margin-left: 0px;
        }
    }

    @media screen and (max-width: 700px) {
        a {
           font-size: 0.9em;
        }

        a:nth-child(1) {
            margin-left: 0px;
        }
    }
`;

const LogoStyle = styled.img`
    width: calc(5em + 2vw);
    margin-top: 2px;
    z-index: 999;
`;


export {
    HeaderStyle,
    LogoStyle,
    LinkStyle,
};
