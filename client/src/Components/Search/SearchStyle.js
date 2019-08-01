import styled from 'styled-components'

const StyleBar = styled.div`
    margin-top: 30vh;
    font-family: "Raleway", sans-serif;
    background: rgb(255,255,255,0.4);
    padding-bottom:50px;

    h1 {
      color: #0e8a83;
      text-align: center;

      font-size: 50px;
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
          color: '#0e8a83',
          fontSize: '20px'
    }),

    control: (provided) => ({
        ...provided,
        '&:hover': { borderColor: '#0e8a83' },
        border: '1.5px solid #0e8a83',
        boxShadow: 'none',
        padding: '20px',
        borderRadius: '18px'
    }),

    indicatorSeparator: (provided) => ({
        ...provided,
        background: '#0e8a83',
        '&:hover': { background: '#0e8a83'},
        height: '30px'
    }), 
    
    dropdownIndicator: (provided ) => ({
        ...provided,
        color: '#0e8a83',
        '&:hover': {
          color: '#0e8a83',
          cursor: 'pointer'
        }
    }),

    option: (provided) => ({
        ...provided,
        color: '#0e8a83',
        background: '#ffffff',
        margin: '5px 0px',
        '&:hover': {
          background: '#fee8c8'
        },
        fontSize: '18px'
    }),

    singleValue: (provided) => ({
        ...provided,
        color: '#0e8a83',
        fontSize: '20px'
    }),

    input: (provided) => ({
        ...provided,
        color: '#0e8a83',
    }),

    clearIndicator: (provided) => ({
        ...provided,
        color: '#0e8a83',
        '&:hover': {
          color: '#fee8c8',
        }
    })
}



export {
    StyleBar,
    customStyles
}