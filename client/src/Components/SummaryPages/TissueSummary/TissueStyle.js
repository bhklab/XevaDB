import styled from 'styled-components';

const StyleComponent = styled.div`
    img {
        margin-top: 50px;
        height: 750px;
        width: 625px;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

    

    div > img {
        height: 60px;
        width: 60px;
        margin: 20px;
        opacity: 0.5;
        position: absolute;
        top: 35%;
        left: 25%
        :hover {
            opacity: 1.0;
            transform: scale(1.25)
        }
    }

    div:nth-child(1) {
        position: absolute;
        top: 25%;
        left: 30%;
    }

    div:nth-child(2) {
        position: absolute;
        top: 25%;
        left: 60%
    }

    div:nth-child(4) {
        position: absolute;
        top: 35%;
        left: 65%
    }

    div:nth-child(5) {
        position: absolute;
        top: 45%;
        left: 30%
    }

    div:nth-child(6) {
        position: absolute;
        top: 45%;
        left: 61%
    }
`;

export default StyleComponent;
