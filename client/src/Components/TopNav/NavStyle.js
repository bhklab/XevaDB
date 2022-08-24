import styled from 'styled-components';
import colors from '../../styles/colors';

const MainConatiner = styled.div`
    height: 60px;
    width: 100%;
    background-color: ${colors['--bg-color']};
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9em;

    // when screen size is greater than 2000px
    @media only screen and (min-width: 2000px) {
        height: 70px;
    }
`;

const TopNavContainer = styled.div`
    height: inherit;
    width: 95%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    // when screen size is greater than 2000px
    @media only screen and (min-width: 2000px) {
        width: 60%;
    }
`;

const LogoNavLinksContainer = styled.div`
    height: inherit;
    display: flex;
    align-items: center;
    justify-content: space-between;

    div.logo > a {
        margin-right: 75px;
    }

    div.nav-links-container {
        height: 100%;
        display: flex;
    }

    div.nav-links-container > div {
        height: 100%;
    }

    div.nav-link > a {
        height: 100%;
        margin-right: 20px;
        padding: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${colors.white};
        text-decoration: none;
        letter-spacing: 1px;

        &:hover {
            cursor: pointer;
            opacity: 0.75;
        }
    }

    img {
        height: 45px;
        z-index: 999;
    }

    // when screen size is greater than 2000px
    @media only screen and (min-width: 2000px) {
        img {
            height: 55px;
        }

        a {
            font-size: 1.1em;
        }
    }
`;

const ButtonStyle = styled.div`
    button {
        background-color: ${colors.white};
        width: 70px;
        height: 35px;
        border: 0;
        border-radius: 5px;
        font-size: 0.9em;
    }

    button:hover {
        background-color: ${colors['--table-bg-color']} !important;
        cursor: pointer;
    }

    // when screen size is greater than 2000px
    @media only screen and (min-width: 2000px) {
        button {
            width: 80px;
            height: 40px;
        }
    }
`;

export {
    MainConatiner,
    TopNavContainer,
    LogoNavLinksContainer,
    ButtonStyle,
};
