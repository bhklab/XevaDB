import styled from 'styled-components';

const StyleComponent = styled.div`
    img {
        margin-top: 25px;
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
        position: absolute;
        top: 0px;
        opacity: 0.5;

        :hover {
            opacity: 1.0;
            transform: scale(1.25)
        }
    }

    img:nth-child(1) {
        top: 25%;
        left: 30%
    }

    img:nth-child(2) {
        top: 25%;
        left: 60%
    }

    img:nth-child(3) {
        top: 35%;
        left: 25%
    }

    img:nth-child(4) {
        top: 35%;
        left: 65%
    }

    img:nth-child(5) {
        top: 45%;
        left: 30%
    }

    img:nth-child(6) {
        top: 45%;
        left: 61%
    }
`;

export default StyleComponent;
