import styled from 'styled-components';

const StyleComponent = styled.div`
    position: relative;

    img {
        margin-top: 50px;
        height: 750px;
        width: 625px;
        display: block;
        margin: auto;
    }

    div > img {
        height: 60px;
        width: 60px;
        margin: 20px;
        opacity: 0.5;
        position: absolute;
        top: 35%;
        left: 20%;
        :hover {
            opacity: 1.0;
            transform: scale(1.25)
        }
    }

    div:nth-child(1) {
        position: absolute;
        top: 25%;
        left: 25%;
        background-color: red;
    }

    div:nth-child(2) {
        position: absolute;
        top: 25%;
        left: 67.5%
    }

    div:nth-child(4) {
        position: absolute;
        top: 35%;
        left: 72.5%
    }

    div:nth-child(5) {
        position: absolute;
        top: 45%;
        left: 25%
    }

    div:nth-child(6) {
        position: absolute;
        top: 45%;
        left: 67.5%
    }
`;

export default StyleComponent;
