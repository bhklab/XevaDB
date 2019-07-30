import styled from 'styled-components'

const StyleBar = styled.div`
    margin-top: 30vh;

    h1 {
      color: #bd0808;
      text-align: center;
      line-height: 0.4;
      font-size: 30px;
    }    

   .select-component {
      width: 45%;
      margin: auto;
      min-width: 500px;
      margin-top: 40px;
   }

   @media screen and (max-width: 1500px) {
       h1 {
           font-size: 28px;
       }
       .select-component {
          width: 55%
      }
   }

   @media screen and (max-width: 650px) {
       h1 {
           font-size: 18px;
       }
   }
`;


const customStyles = {
    placeholder: (provided) => ({
          ...provided,
          color: '#bd0808',
          fontSize: '20px'
    }),

    control: (provided) => ({
        ...provided,
        '&:hover': { borderColor: '#bd0808' },
        border: '1.5px solid #bd0808',
        boxShadow: 'none',
        padding: '20px',
        borderRadius: '18px'
    }),

    indicatorSeparator: (provided) => ({
        ...provided,
        background: '#bd0808',
        '&:hover': { background: '#bd0808'},
        height: '30px'
    }), 
    
    dropdownIndicator: (provided ) => ({
        ...provided,
        color: '#bd0808',
        '&:hover': {
          color: '#bd0808',
          cursor: 'pointer'
        }
    }),

    option: (provided) => ({
        ...provided,
        color: '#bd0808',
        background: '#ffffff',
        margin: '5px 0px',
        '&:hover': {
          background: '#fee8c8'
        },
        fontSize: '18px'
    }),

    singleValue: (provided) => ({
        ...provided,
        color: '#bd0808',
        fontSize: '20px'
    }),

    input: (provided) => ({
        ...provided,
        color: '#bd0808',
    }),

    clearIndicator: (provided) => ({
        ...provided,
        color: '#bd0808',
        '&:hover': {
          color: '#fee8c8',
        }
    })
}



export {
    StyleBar,
    customStyles
}