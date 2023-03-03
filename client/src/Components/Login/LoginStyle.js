import styled from 'styled-components';
import colors from '../../styles/colors';

const FormContainer = styled.div`
    height: 100%;
    margin-top: 16vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Open Sans', sans-serif;
`;

const Form = styled.div`
    background: ${colors['--table-bg-color']};
    height: 375px;
    width: 525px;
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
    color: ${colors['--bg-color']};
    font-size: 1.85em;
    font-weight: 700;
`;

const SubmitStyle = styled.div`
    margin-top: 20px;
    button {
        background: ${colors['--bg-color']};

        &:hover {
            background: ${colors['--table-bg-color']};
            color: ${colors['--bg-color']};
        }
    }
`;

const LogoStyle = styled.img`
    width: calc(5em + 1vw);
    height: 50px;
    margin-left: calc(100vw - (3vw + 5em));
`;

const LogoBack = styled.div`
    height: 60px;
    background: ${colors['--bg-color']};
    display: flex;
    justify-content: center;
    align-items: center;

    // when screen size is greater than 2000px
    @media only screen and (min-width: 2000px) {
        height: 70px;
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
