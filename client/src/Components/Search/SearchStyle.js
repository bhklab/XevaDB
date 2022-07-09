import styled from 'styled-components';
import colors from '../../styles/colors';

const StyleBar = styled.div`
    height: 100%;

    h1 {
        color: ${colors['--bg-color']};
        text-align: center;
        padding: 15px 0;
        font-size: 1.85em;
    }  
    
    .search-container {
        height: 550px;
        width: 800px;
        text-align: center;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
    }

    .select-component {
        background: ${colors['--table-bg-color']};
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        border-radius: 20px;
        padding: 10px 40px 20px 40px;
        
        .dataset-drug-container {
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
            color: ${colors['--main-font-color']};
            
            input {
                color: ${colors['--main-font-color']};
                font-size: 0.9em;
                border: 1px solid ${colors['--main-font-color']};
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
                color: ${colors['--main-font-color']};
                font-size: 0.9em;
                border: 1px solid silver;
                padding: 10px;
                overflow-wrap: break-word;
                box-sizing: border-box;
                resize: none;
            }
        }

        .sample {
            width: 100%;
            font-size: 1em;
            text-align: left;
            font-weight: 700;
            a {
                color: ${colors['--bg-color']};
                text-decoration: none;
            }
            a:hover {
                color: ${colors['--main-font-color']};
                cursor: pointer;
            }
            font-style: italic;
            margin: 0px 0px -10px 10px !important;
        }
    }  

   @media screen and (max-width: 1700px) {
        h1 {
            font-size: 1.575em;
        }

        .select-component {
            padding: 20px 30px;
            max-width: 85%;
        }

        .div-genomics, .div-gene, .div-dataset, .div-drug {
            margin-bottom: 10px !important;
        }

        div > input {
            margin-bottom: 10px !important;
        }

        .div-gene-enter {
            min-height: 80px !important;
            textarea {
                min-height: 90px !important;
                max-height: 90px;
            }
        }

        .sample {
            font-size: 0.9em !important;
        }
        
        .stylebutton {
            font-size: 1.5em;
            padding: 8px 10px 8px 10px;
        }
   }

   @media screen and (max-width: 650px) {
       h1 {
           font-size: 18px;
       }
   }
`;

const StyleButton = styled.button`
    background-color: ${colors['--bg-color']};
    border-radius: 6px;
    color: ${colors['--white']};
    border: none;
    padding: 12px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 1.5em;
    font-weight: 700;
    transition: .3s;
    outline-style: none;
    margin: 0px;
    &:hover {
        opacity: 1;
        cursor: pointer;
        color: ${colors['--bg-color']};
        background-color: ${colors['--white']};
        border: 1px solid ${colors['--bg-color']};
    }
`;

const customStyles = {
    placeholder: (provided) => ({
        ...provided,
        color: `${colors['--main-font-color']}`,
        fontWeight: '400',
        fontSize: '15px',
    }),

    control: (provided) => ({
        ...provided,
        '&:hover': { borderColor: `${colors['--main-font-color']}` },
        // border: `1px solid ${colors['--main-font-color']}`,
        boxShadow: 'none',
        padding: '0px 5px',
        borderRadius: '5px',
        background: 'rgb(255,255,255,0.7)',
    }),

    indicatorSeparator: (provided) => ({
        ...provided,
        background: `${colors['--main-font-color']}`,
        '&:hover': { background: `${colors['--main-font-color']}` },
        height: '30px',
    }),

    dropdownIndicator: (provided) => ({
        ...provided,
        color: `${colors['--main-font-color']}`,
        '&:hover': {
            color: `${colors['--main-font-color']}`,
            cursor: 'pointer',
        },
    }),

    option: (provided) => ({
        ...provided,
        color: `${colors['--main-font-color']}`,
        background: `${colors.white}`,
        margin: '0px 0px',
        '&:hover': {
            background: `${colors['--table-bg-color']}`,
        },
        fontSize: '14px',
        textAlign: 'left',
    }),

    singleValue: (provided) => ({
        ...provided,
        color: `${colors['--main-font-color']}`,
        fontSize: '15px',
    }),

    multiValue: (provided) => ({
        ...provided,
        color: `${colors['--main-font-color']}`,
        fontSize: '15px',
    }),

    input: (provided) => ({
        ...provided,
        color: `${colors['--font-color']}`,
    }),

    clearIndicator: (provided) => ({
        ...provided,
        color: `${colors['--main-font-color']}`,
        '&:hover': {
            color: `${colors['--main-font-color']}`,
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
