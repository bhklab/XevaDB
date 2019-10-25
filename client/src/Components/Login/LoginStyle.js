import styled from 'styled-components'


const Paper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
height: 300px;
width: 400px;
margin: auto;
margin-top: 20vh;
`

const PaperGradient = styled.div`
background-image: linear-gradient(
    to right,
    #CBC5EA,
    #EAEAEA
);
height: 400px;
width: 500px;
border-radius: 5px;
`

const SubmitStyle = styled.div`
margin-top: 2vh;
`

const LogoStyle = styled.img`
    width:calc(5em + 2vw);
    margin-top:2px;
    z-index:999;
    position: relative;
    margin-left: calc(100vw - (3vw + 5em))
`;

const LogoBack = styled.div `
background-image: linear-gradient(
    to right,
    #CBC5EA,
    #EAEAEA
);
`



export {
    Paper,
    SubmitStyle,
    LogoStyle,
    PaperGradient,
    LogoBack
}