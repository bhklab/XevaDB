import styled from 'styled-components';


const DonutNav = styled.div`
    display: flex;
    background-color: rgb(255,255,255,0.8);
    min-height: 70px;
    max-height: 70px;
    position: fixed;
    bottom:0;
    left:0;
    width: 100%;
    align-items: flex-end;
    justify-content: space-around;
    flex-wrap: wrap;
    font-family: 'Montserrat', sans-serif;
    font-weight:500;
    font-size: 1.4em;
    padding-bottom:5px;
    a{
        padding: 10px;
        color: #3453b0;
        letter-spacing: 2px;
        font-weight: bold;
        font-size: 20px;
        text-decoration: none;
        &:hover {
            color: #cd5686;
        }
        text-align:center;
    }
    h4 {
        margin-top: 3px;
        margin-bottom: 0px;
    }

    @media screen and (max-width: 1500px) {
        a {
            font-size: 18px;
        }

        a:nth-child(1) {
            margin-left : 100px;
        }
    }

    @media screen and (max-width: 1300px) {
        a {
            font-size: 18px;
        }
        
        a:nth-child(1) {
            margin-left : 10px;
        }
    }

    @media screen and (max-width: 1000px) {
        a {
           font-size: 14px;
        }

        a:nth-child(1) {
            margin-left : 0px;
        }
    }

    @media screen and (max-width: 700px) {
        a {
           font-size: 10px;
        }

        a:nth-child(1) {
            margin-left : 0px;
        }
    }
`;


export default DonutNav;
