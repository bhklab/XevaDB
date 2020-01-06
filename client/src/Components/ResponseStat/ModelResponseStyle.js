import styled from 'styled-components';

const StyleTable = styled.div`

    table, th, td {
        border: 1px solid #999999;
    }

    #stats-table {
        text-align: left;
        font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 800px;
    }

    th {
        color: #5974c4;
        text-align: left;
        font-family: arial, sans-serif;
        padding: 10px;
        height: 40px;
        background-color: #ddd;
    }

    td {
        color: #cd5686;
        padding: 12px;
        white-space: normal;
        max-width: 200px;
        overflow: scroll;
    }

    tr:hover {
        background-color: #f5f5f5;
    }
`;

export default StyleTable;
