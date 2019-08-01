import styled from 'styled-components'


const DonutNav = styled.div`
    display: flex;
    justify-content: space-around;
    background-color: rgb(255,255,255,0.6);
    min-height: 90px;
    position: fixed;
    bottom:0;
    left:0;
    width: 100%;
    align-items: flex-end;
    font-family: 'Montserrat', sans-serif;
    font-weight:500;
    font-size: 1.4em;
    padding-bottom:10px;
    a{
        padding: 10px;
        color: #0e8a83;
        letter-spacing: 2px;
        font-weight: bold;
        font-size: 20px;
        text-decoration: none;
        &:hover {
            color: #fdbb84;
        }
    }
    h4 {
        margin-top: 3px;
        margin-bottom: 0px;
        margin-left: -30px;
    }
`;


export default DonutNav