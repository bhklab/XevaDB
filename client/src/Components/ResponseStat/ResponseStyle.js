import styled from 'styled-components';
import colors from '../../styles/colors';


export const StyledLink = styled.div`
    font-weight: 500;
    margin-bottom: 5px;
    width: ${(props) => props.width || '800px'}
     
    h1 {
        font-size: 1.5em;
    }
    img {
        height: 15px;
        width: 25px;
        margin-left: 5px;
    }
    a:link {
        background-color: ${colors.moderate_blue} !important;
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
    max-width: 800px;

    table, th, td {
        border: 1px solid ${colors.dark_gray};
    }

    #stats-table {
        text-align: left;
        border-collapse: collapse;
        width: 800px;
    }

    th {
        color: ${colors.moderate_blue};
        text-align: left;
        padding: 10px;
        height: 40px;
        background-color: ${colors.lightgray};
    }

    td {
        color: ${colors.jet_black};
        padding: 10px;
        white-space: normal;
        max-width: 200px;
        overflow: scroll;
    }

    tr:hover {
        background-color: ${colors.white_smoke};
    }
`;
