import styled from 'styled-components';
import colors from '../../styles/colors';

const HeaderStyle = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 70px;
    background-color: ${colors['--bg-color']};
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    a {
        color: ${colors['--white-text']};
        text-decoration: none;
        letter-spacing: 1px;
        font-size: 1.3rem; // fallback
        font-size: 18px;
        &:hover {
            ccolor: ${colors['--table-bg-color']};
            cursor: pointer;
        }
    }

    .logo {
        width: 25%;
        display: flex;
        justify-content: flex-end;
    }

    .nav-links {
        width: 30%;
        display: flex;
        justify-content: space-around;
        margin: 0 0 0 50px;
    }

    .login-button {
        width: 25%;
        display: flex;
        justify-content: center;
    }

    button {
        background-color: ${colors.white};
        color: ${colors['--bg-color']};
        &:hover {
            background-color: ${colors.pink_header} !important;
        }
        width: 80px;
        height: 40px;
        border: 0;
        border-radius: 5px;
        font-size: 16px;
    }

    // // when screen size is greater than 1800px
    // @media only screen and (min-width: 2000px) {
    //     a {
    //         font-size: 1vw;
    //     }
    // }

    // // when the height is greater than 1000px
    // @media only screen and (min-height: 1000px) {
    //     min-height: 7vh;
    //     max-height: 7vh;
    // }
`;

const LogoStyle = styled.img`
    z-index: 999;
    height: 45px;

    // // when the height is greater than 1000px
    // @media only screen and (min-height: 1000px) {
    //     height: 5vh;
    // }
`;

export {
    HeaderStyle,
    LogoStyle,
};
