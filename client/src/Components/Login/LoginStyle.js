import styled from 'styled-components';
import colors from '../../styles/colors';

const FormContainer = styled.div`
    height: 100%;
    margin-top: 16vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Lato', sans-serif;
`;

const Form = styled.div`
    background: ${colors['--table-bg-color']};
    height: 400px;
    width: 550px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    a {
        color: ${colors['--link-color']}
    }
`;

const FormHeading = styled.div`
    color: ${colors['--main-font-color']};
    font-size: 1.85em;
    font-weight: 700;
`;

const SubmitStyle = styled.div`
    margin-top: 20px;
    button {
        background: ${colors['--main-font-color']};

        &:hover {
            background: ${colors['--table-bg-color']};
            color: ${colors['--main-font-color']};
        }
    }
`;

const LogoStyle = styled.img`
    width: calc(5em + 1vw);
    height: 50px;
    margin-left: calc(100vw - (3vw + 5em));

    // @media only screen and (min-height: 900px) {
    //     height: 70px;
    // }
`;

const LogoBack = styled.div`
    height: 70px;
    background:  #0d76bd;
    display: flex;
    justify-content: center;
    align-items: center;
    
    // background-image: linear-gradient(
    //     to right,
    //     ${colors['--bg-color']},
    //     #0d76bd,
    //     ${colors.white_smoke}
    // );

    // @media only screen and (min-height: 900px) {
    //     height: 90px;
    // }
`;


export {
    Form,
    SubmitStyle,
    LogoStyle,
    FormContainer,
    LogoBack,
    FormHeading,
};
