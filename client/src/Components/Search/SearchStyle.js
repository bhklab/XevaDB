import styled from 'styled-components'

const StyleBar = styled.div`
    margin-top: 30vh;
    font-family: "Raleway", sans-serif;
    display:flex;
    margin:auto;
    
    .search-container {
        max-width: 1000px;
        text-align:center;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        border-radius:25px;
        max-height: 500px;
    }

    .select-component {
        background: rgb(255,255,255,0.7);
        width: 45%;
        min-width: 750px;
        margin-top: 0px;
        display: flex;
        flex-wrap: wrap;
        margin: 35px;
        padding: 15px 25px 50px 25px;
        justify-content: space-around;
        border-radius: 20px;

        .div-1, .div-2 {
            max-width: 49%;
            min-width: 295px;
        }
        .div-1 {

        }
        .div-2 {

        }
        .div-3, .div-4 {
            margin: 10px;
            min-width: 600px;
            max-width: 70%;
        }
    }

    .two-col {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: flex-end;
        min-width: 610px;
        max-width: 70%;
        margin-bottom:10px;
    }

    h1 {
      color: #3453b0; //#3453b0
      text-align: center;
      font-size: 50px;
    //   span {
    //       color: #AA4C45;
    //   }
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
          color: '#3453b0',
          fontWeight:'400',
          fontSize: '15px'
    }),

    control: (provided) => ({
        ...provided,
        '&:hover': { borderColor: '#3453b0' },
        border: '1px solid #3453b0',
        boxShadow: 'none',
        padding: '0px 5px',
        borderRadius: '15px',
        background: 'rgb(255,255,255,0.7)',
    }),

    indicatorSeparator: (provided) => ({
        ...provided,
        background: '#3453b0',
        '&:hover': { background: '#3453b0'},
        height: '30px'
    }), 
    
    dropdownIndicator: (provided ) => ({
        ...provided,
        color: '#3453b0',
        '&:hover': {
          color: '#3453b0',
          cursor: 'pointer'
        }
    }),

    option: (provided) => ({
        ...provided,
        color: '#3453b0',
        background: '#ffffff',
        margin: '5px 0px',
        '&:hover': {
          background: '#fee8c8'
        },
        fontSize: '18px'
    }),

    singleValue: (provided) => ({
        ...provided,
        color: '#3453b0',
        fontSize: '20px'
    }),

    input: (provided) => ({
        ...provided,
        color: '#3453b0',
    }),

    clearIndicator: (provided) => ({
        ...provided,
        color: '#3453b0',
        '&:hover': {
          color: '#fee8c8',
        }
    })
}



export {
    StyleBar,
    customStyles
}