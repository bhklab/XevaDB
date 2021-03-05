import styled from 'styled-components';
import colors from '../../styles/colors';

const StyleTable = styled.div`

    table, th, td {
        border: 1px solid ${colors.dark_gray};
    }

    #stats-table {
        text-align: left;
        font-family: 'Raleway', sans-serif;
        border-collapse: collapse;
        width: 800px;
    }

    th {
        color: ${colors.moderate_blue};
        text-align: left;
        font-family: 'Raleway', sans-serif;
        padding: 10px;
        height: 40px;
        background-color: ${colors.lightgray};
    }

    td {
        color: ${colors.pink_header};
        padding: 10px;
        white-space: normal;
        max-width: 200px;
        overflow: scroll;
    }

    tr:hover {
        background-color: ${colors.white_smoke};
    }

`;

export default StyleTable;
