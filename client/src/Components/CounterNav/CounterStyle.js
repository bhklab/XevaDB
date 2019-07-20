import styled from 'styled-components'


const DonutNav = styled.div`
    display: flex;
    justify-content: space-around;
    background-color: #f6eeee;
    font-family: 'Raleway', sans-serif;
    min-height: 80px;
    position: fixed;
    bottom:0;
    left:0;
    width: 100%;
    div {
        padding: 10px;
        color: #bd0808;
        letter-spacing: 2px;
        font-weight: bold;
        font-size: 18px;
        margin-top: 6px;
    }
    h4 {
        margin-top: 2px;
        margin-bottom: 0px;
        margin-left: -25px;
    }
`;


export default DonutNav