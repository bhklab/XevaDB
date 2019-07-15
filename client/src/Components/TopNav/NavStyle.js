import styled from 'styled-components'

const HeaderStyle = styled.header`
    *{
        margin: 0px;
        padding: 0px;
        box-sizing: border-box;
    }

    display: flex;
    justify-content: space-around;
    align-items: center;
    min-height: 10vh;
    font-family: 'Raleway', sans-serif;
    background-color: #f6eeee;
`;

const LinkStyle = styled.a`
    display: flex;
    justify-content: space-around;
    width: 60%;

    a {
        color: #bd0808;
        text-decoration: none;
        letter-spacing: 2px;
        font-weight: bold;
        font-size: 18px;
        :hover {
            color: #393b79;
        }
    }

    a:nth-child(1) {
        margin-left : 200px;
    }
`

const LogoStyle = styled.div`
    a {
        color: #393b79;
        text-decoration: none;
        letter-spacing: 2px;
        font-weight: bold;
        font-size: 26px;
    }
`;


export {
    HeaderStyle,
    LogoStyle,
    LinkStyle
}