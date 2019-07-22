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
    min-height: 80px;
    font-family: 'Raleway', sans-serif;
    background-color: #f6eeee;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
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
        font-size: 20px;
        :hover {
            color: #393b79;
        }
    }

    a:nth-child(1) {
        margin-left : 200px;
    }

    @media screen and (max-width: 1300px) {
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