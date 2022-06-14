import styled from 'styled-components';
import colors from '../../styles/colors';

const HeaderStyle = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    min-height: 8vh;
    max-height: 8vh;
    background-color: ${colors.white};
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    button {
        background-color: ${colors.blue_header};
        &:hover {
            background-color: ${colors.pink_header} !important;
        }
        width: 80px;
        height: 40px;
    }
    
    a {
        color: ${colors.blue_header};
        text-decoration: none;
        letter-spacing: 1px;
        font-weight: 700;
        font-size: 1.3rem; // fallback
        font-size: 1.35vw;
        &:hover {
            color: ${colors.pink_header};
            cursor: pointer;
        }
    }

    .logo {
        width: 40%;
    }

    .nav-links {
        width: 60%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-right: 2%;
    }

    .login-button {
        display: inline !important;
    }

    // when screen size is greater than 1800px
    @media only screen and (min-width: 1800px) {
        a {
            font-size: 1vw;
        }
    }

    // when the height is greater than 1000px
    @media only screen and (min-height: 1000px) {
        min-height: 7vh;
        max-height: 7vh;
    }
`;

const LogoStyle = styled.img`
    margin-left: 10%;
    z-index: 999;
    height: 6vh;

    // when the height is greater than 1000px
    @media only screen and (min-height: 1000px) {
        height: 5vh;
    }
`;

export {
    HeaderStyle,
    LogoStyle,
};
