import styled from 'styled-components';
import colors from '../../styles/colors';

const HeaderStyle = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    min-height: 10vh;
    max-height: 10vh;
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
        font-size: 1.5vw;
        &:hover {
            color: ${colors.pink_header};
            cursor: pointer;
        }
    }

    .logo {
        width: 35%;
    }

    .nav-links {
        width: 65%;
        display: flex;
        justify-content: space-around;
        margin-right: 2%;
    }

    .login-button {
        display: inline !important;
    }
`;

const LogoStyle = styled.img`
    margin-left: 20%;
    z-index: 999;
    height: 8vh;
`;

export {
    HeaderStyle,
    LogoStyle,
};
