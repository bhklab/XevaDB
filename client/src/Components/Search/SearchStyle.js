import styled from 'styled-components'

const StyleBar = styled.div`
   div {
        color: #bd0808;
        text-align: center;
        line-height: 0.4;
        margin-top: 30vh;
   } 

   input {
      width: 40%;
      padding: 30px;
      margin: 8px 0;
      box-sizing: border-box;
      border: 1.5px solid #bd0808;
      border-radius: 16px;
      outline: none;

        :focus {
            background-color: #f6eeee;
        }

        ::placeholder {
            color:  #bd0808;
            font-size: 14px;
        }   
   }

   @media screen and (max-width: 850px) {
       h1 {
           font-size: 26px;
       }
   }

   @media screen and (max-width: 650px) {
       h1 {
           font-size: 20px;
       }
   }

`


export default StyleBar