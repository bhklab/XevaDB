import styled from 'styled-components';
import colors from '../../styles/colors';


export const StyledLink = styled.div`
    font-weight: 300;
    margin-bottom: 5px;
    width: ${(props) => props.width || '800px'}
     
    h1 {
        font-size: 1.3em !important;
    }

    img {
        height: 13px;
        width: 25px;
        margin-left: 5px;
    }

    a:link {
        background-color: ${colors['--bg-color']} !important;
        color: ${colors.white} !important;
        border-radius: 6px;
        text-decoration: none;
        font-size: 1em;
    }

    a:hover {
        color: ${colors.moderate_blue} !important;
        background-color: ${colors.lightgray} !important;
    }
`;


export const StyleTable = styled.div`
    
    margin-bottom: 40px;
    max-width: 1900px;

    table, th, td {
        border: 1px solid silver;
    }

    #stats-table {
        text-align: left;
        border-collapse: collapse;
        width: 800px;
    }

    th {
        color: ${colors['--main-font-color']};
        text-align: left;
        padding: 10px;
        height: 40px;
        background-color: ${colors['--table-bg-color']};
    }

    td {
        color: ${colors['--main-font-color']};
        padding: 10px;
        white-space: normal;
        max-width: 200px;
        overflow: scroll;
        font-size: 0.9em;
    }
`;
