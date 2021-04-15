import styled from 'styled-components';
import colors from '../../styles/colors';

const Paper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    margin-top: 20vh;

    a {
        color: ${colors.blue_header}
    }
`;

const PaperGradient = styled.div`
    background: ${colors.fade_blue}
    height: 50vh;
    width: 35vw;
    border-radius: 10px;
    margin: auto;
`;

const SubmitStyle = styled.div`
    margin-top: 2vh;
    button {
        background: ${colors.blue_header}
        &:hover {
            background: ${colors.pink_header}
        }
    }
`;

const LogoStyle = styled.img`
    width:calc(5em + 2vw);
    margin-top: 2px;
    z-index: 999;
    position: relative;
    margin-left: calc(100vw - (3vw + 5em))
`;

const LogoBack = styled.div`
    background-image: linear-gradient(
        to right,
        ${colors.fade_blue},
        ${colors.white_smoke}
    );
`;


export {
    Paper,
    SubmitStyle,
    LogoStyle,
    PaperGradient,
    LogoBack,
};
