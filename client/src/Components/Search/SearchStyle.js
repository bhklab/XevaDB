import styled from 'styled-components';
import colors from '../../styles/colors';

const StyleBar = styled.div`
    margin-top: 30vh;
    font-family: 'Raleway', sans-serif;
    display: flex;
    margin: auto;

    h1 {
        color: ${colors.blue_header};
        text-align: center;
        font-size: 24px;
    }  
    
    .search-container {
        height: 550px;
        width: 750px;
        text-align: center;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
    }

    .select-component {
        background: ${colors.white};
        margin: 0px;
        display: flex;
        flex-wrap: wrap;
        padding: 10px 50px 20px 50px;
        justify-content: space-around;
        border-radius: 20px;

        .two-col {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            align-items: center;
            width: 100%
        }

        .div-dataset, .div-drug {
            min-width: 49%;
            max-width: 49%
            margin-bottom: 20px;
        }

        .div-dataset {
            margin-right: 1%
        }

        .div-drug {
            margin-left: 1%
        }

        .div-genomics, .div-gene {
            width: 100%;
            margin-bottom: 20px;
        }

        .div-rnaseq {
            text-align: left;
            width: 100%;
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
                margin-bottom: 20px;
            }
        }

        .div-gene-enter {
            width: 100%
            max-height: 150px;
            margin-bottom: 10px;
            textarea {
                width: 100%
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
            width: 100%;
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

   @media screen and (max-width: 1700px) {
        h1 {
            font-size: 22px;
        }

        .select-component {
            padding: 10px 50px 50px 50px;
            max-width: 80%;
            max-height: 400px;
        }

        .div-genomics, .div-gene, .div-dataset, .div-drug {
            margin-bottom: 15px !important;
        }

        div > input {
            margin-bottom: 15px !important;
        }

        .div-gene-enter {
            min-height: 80px !important;
            textarea {
                min-height: 90px !important;
                max-height: 90px;
            }
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
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 30px;
    font-family: 'Raleway', sans-serif;
    font-weight: 700;
    transition: .3s;
    outline-style: none;
    margin: 0px;
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
