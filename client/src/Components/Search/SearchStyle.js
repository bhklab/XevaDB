import styled from 'styled-components'

const StyleBar = styled.div`
    margin-top: 30vh;
    font-family: "Raleway", sans-serif;
    display:flex;
    margin:auto;
    
    .search-container {
        padding:20px 20px 60px 20px;
        max-width: 600px;
        text-align:center;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        border-radius:25px;
        max-height: 500px;
    }

    .select-component {
        background: rgb(255,255,255,0.6);
        width: 45%;
        min-width: 600px;
        margin-top: 0px;
        display: flex;
        flex-wrap: wrap;
        margin: 35px;
        padding: 25px;
        justify-content: space-around;
        border-radius: 35px;
        .div-1, .div-2 {
            max-width: 49%;
            min-width: 290px;
        }
        .div-3, .div-4 {
            margin: 10px;
            min-width: 400px;
            max-width: 70%
        }
    }

    h1 {
      color: #0e8a83;
      text-align: center;
      font-size: 50px;
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
          fontWeight:'400',
          fontSize: '15px'
    }),

    control: (provided) => ({
        ...provided,
        '&:hover': { borderColor: '#0e8a83' },
        border: '1px solid #0e8a83',
        boxShadow: 'none',
        padding: '10px 10px',
        borderRadius: '15px',
        background: 'rgb(255,255,255,0.7)',
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