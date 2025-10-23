import styled from 'styled-components';
import colors from '../../styles/colors';

export const StyledLink = styled.div`
    width: ${(props) => props.width || '800px'};
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 300;
    margin-bottom: 8px;

    .export-button {
        border: 1px solid ${colors['--bg-color']};
        border-radius: 5px;
        padding: 5px;
        display: flex;
        align-items: center;
    }
     
    h1 {
        font-size: 1.2em !important;
        font-weight: 700;
        margin: 0;
        padding: 0;
    }

    img {
        height: inherit;
        width: 25px;
        margin-left: 5px;
    }

    a:link {
        /* background-color: ${colors['--bg-color']} !important; */
        color: ${colors['--bg-color']} !important;
        border-radius: 6px;
        text-decoration: none;
        font-size: 1em;
    }

    a:hover {
       opacity: 0.75;
    }
`;

export const StyleTable = styled.div`
    margin-bottom: 40px;

    table, th, td {
        border: 1px solid silver;
    }

    table {
        text-align: left;
        border-collapse: collapse;
        width: 1000px;
    }

    th {
        color: ${colors['--main-font-color']};
        text-align: left;
        padding: 10px;
        height: 40px;
        background-color: ${colors['--table-bg-color']};
        font-weight: 600;
        font-size: 0.95em;
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
