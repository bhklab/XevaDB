import styled from 'styled-components';
import colors from '../../styles/colors';

const FormContainer = styled.div`
    height: 100%;
    margin-top: 16vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Form = styled.div`
    background: ${colors.fade_blue};
    height: 400px;
    width: 550px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    a {
        color: ${colors.blue_header}
    }
`;

const FormHeading = styled.div`
    color: ${colors.blue_header};
    font-size: 1.75rem;
    font-weight: 700;
`;

const SubmitStyle = styled.div`
    margin-top: 20px;
    button {
        background: ${colors.blue_header}
        &:hover {
            background: ${colors.pink_header}
        }
    }
`;

const LogoStyle = styled.img`
    width: calc(5em + 2vw);
    height: 60px;
    margin-top: 10px;
    z-index: 999;
    position: relative;
    margin-left: calc(100vw - (3vw + 5em));

    @media only screen and (min-height: 900px) {
        height: 70px;
    }
`;

const LogoBack = styled.div`
    height: 80px;
    background-image: linear-gradient(
        to right,
        ${colors.fade_blue},
        ${colors.white_smoke}
    );

    @media only screen and (min-height: 900px) {
        height: 90px;
    }
`;


export {
    Form,
    SubmitStyle,
    LogoStyle,
    FormContainer,
    LogoBack,
    FormHeading,
};
