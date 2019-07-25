import styled from 'styled-components'

const StyleBar = styled.div`
        margin-top: 30vh;

    h1 {
        color: #bd0808;
        text-align: center;
        line-height: 0.4;
    }    

   @media screen and (max-width: 1500px) {
       h1 {
           font-size: 24px;
       }
   }

   @media screen and (max-width: 650px) {
       h1 {
           font-size: 18px;
       }
   }

   @media screen and (max-height: 950px) {
           margin-top: 20vh;
   }
`


export default StyleBar