import styled from 'styled-components';
import colors from '../../styles/colors';

const StyleBar = styled.div`
    margin-top: 30vh;
    font-family: 'Raleway', sans-serif;
    display:flex;
    margin:auto;
    
    .search-container {
        max-width: 1000px;
        text-align:center;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        border-radius: 25px;
        max-height: 700px;
    }

    .select-component {
        background: ${colors.white};
        width: 45%;
        min-width: 750px;
        margin-top: 0px;
        max-height: 550px;
        display: flex;
        flex-wrap: wrap;
        margin: 35px;
        padding: 10px 25px 50px 25px;
        
        justify-content: space-around;
        border-radius: 20px;

        .div-dataset, .div-drug {
            max-width: 49%;
            min-width: 295px;
        }
        .div-genomics, .div-gene {
            margin: 10px;
            min-width: 600px;
            max-width: 70%;
        }

        .div-rnaseq {
            text-align: left;
            padding-left: 5px;
            margin: 5px;
            min-width: 600px;
            max-width: 70%;
            font-size: 15px;
            color: ${colors.blue_header};
            
            input {
                color: ${colors.blue_header};
                font-size: 14px;
                border: 1px solid ${colors.blue_header};
                border-radius: 4px;
                outline-style: none;
                padding: 2px;
                margin-left: 4px;
            }
        }

        .div-gene-enter {
            margin-top: 15px;
            min-width: 620px;
            max-height: 150px;
            textarea {
                min-width: 600px;
                min-height: 120px;
                outline-style: none;
                border-radius: 10px;
                color: ${colors.blue_header};
                font-weight: 300;
                font-size: 15px;
                border: 1px solid ${colors.blue_header};
                padding: 10px;
                overflow-wrap: break-word;
                box-sizing: border-box;
                resize: none
            }
        }

        .sample {
            margin: 10px 0px 0px 15px;
            min-width: 600px;
            font-size: 16px;
            text-align: left;
            font-weight: 550;
            a {
                color: ${colors.blue_header};
                text-decoration: none;
            }
            a:hover {
                color: ${colors.pink_header};
                cursor: pointer;
            }
            font-style: italic;
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
      color: ${colors.blue_header};
      text-align: center;
      font-size: 36px;
    }    

   @media screen and (max-width: 1700px) {
        h1 {
            font-size: 22px;
        }
        .select-component {
            width: 55%;
            max-height: 400px;
            min-width: 650px;
        }
        .search-container {
            max-height: 500px;
        }
        .div-gene-enter {
            min-height: 100px !important;
            margin: 10px !important;
            textarea {
                min-height: 100px !important;
                max-height: 100px;
            }
        }
        .div-genomics, .div-gene {
            margin: 5px !important;
        }
        .sample {
            font-size: 14px !important;
            margin: 0px 0px -10px 10px !important;
        }
        .stylebutton {
            font-size: 28px;
            padding: 6px 10px 6px 10px;
        }
   }

   @media screen and (max-width: 650px) {
       h1 {
           font-size: 18px;
       }
   }
`;


const StyleButton = styled.button`
    background-color: ${colors.blue_header};
    border: none;
    border-radius: 6px;
    color: ${colors.white};
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 32px;
    font-family: 'Raleway', sans-serif;
    font-weight:700;
    margin: auto;
    transition: .3s;
    outline-style: none;
    margin-top: 0px;
    &:hover {
        opacity: 1;
        cursor: pointer;
        color:  ${colors.blue_header};
        background-color: ${colors.white};
        border: 1px solid ${colors.blue_header};
    }
`;


const customStyles = {
    placeholder: (provided) => ({
        ...provided,
        color: `${colors.blue_header}`,
        fontWeight: '400',
        fontSize: '15px',
    }),

    control: (provided) => ({
        ...provided,
        '&:hover': { borderColor: `${colors.blue_header}` },
        border: `1px solid ${colors.blue_header}`,
        boxShadow: 'none',
        padding: '0px 5px',
        borderRadius: '5px',
        background: 'rgb(255,255,255,0.7)',
    }),

    indicatorSeparator: (provided) => ({
        ...provided,
        background: `${colors.blue_header}`,
        '&:hover': { background: `${colors.blue_header}` },
        height: '30px',
    }),

    dropdownIndicator: (provided) => ({
        ...provided,
        color: `${colors.blue_header}`,
        '&:hover': {
            color: `${colors.blue_header}`,
            cursor: 'pointer',
        },
    }),

    option: (provided) => ({
        ...provided,
        color: `${colors.blue_header}`,
        background: `${colors.white}`,
        margin: '0px 0px',
        '&:hover': {
            background: `${colors.white_red}`,
        },
        fontSize: '14px',
        textAlign: 'left',
    }),

    singleValue: (provided) => ({
        ...provided,
        color: `${colors.blue_header}`,
        fontSize: '15px',
    }),

    multiValue: (provided) => ({
        ...provided,
        color: `${colors.blue_header}`,
        fontSize: '15px',
    }),

    input: (provided) => ({
        ...provided,
        color: `${colors.blue_header}`,
    }),

    clearIndicator: (provided) => ({
        ...provided,
        color: `${colors.blue_header}`,
        '&:hover': {
            color: `${colors.blue_header}`,
        },
    }),

    valueContainer: (provided) => ({
        ...provided,
        minHeight: '10px',
        height: '40px',
        paddingTop: '0',
        paddingBottom: '0',
        overflow: 'auto',
    }),
};


export {
    StyleBar,
    customStyles,
    StyleButton,
};
