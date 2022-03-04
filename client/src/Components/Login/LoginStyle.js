import styled from 'styled-components';
import colors from '../../styles/colors';

const Paper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 16vh;

    a {
        color: ${colors.blue_header}
    }
`;

const PaperGradient = styled.div`
    background: ${colors.fade_blue}
    height: 400px;
    width: 550px;
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
    width: calc(5em + 2vw);
    height: 7vh;
    margin-top: 1vh;
    z-index: 999;
    position: relative;
    margin-left: calc(100vw - (3vw + 5em))
`;

const LogoBack = styled.div`
    height: 9vh;
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
