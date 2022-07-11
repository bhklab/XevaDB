import styled from 'styled-components';
import colors from '../../styles/colors';

const TableWrapper = styled.div`
    padding: 1.5%;
    width: 100%;

    a {
        color: ${colors['--link-color']} !important;
    }

    .ReactTable * {
        box-sizing: border-box;
    }

    .ReactTable .rt-table {
        align-items: stretch;
        width: 100%;
        border-collapse: collapse;
        overflow: auto;
    }

    .rt-thead.-header {
        border-bottom: 1px solid rgba(0,0,0,0.1);
    }

    .ReactTable.-highlight .rt-tbody .rt-tr:not(.-padRow):hover {
        background: ${colors['--table-bg-color']};
    }

    .ReactTable .rt-thead {
        color: ${colors['--main-font-color']};
        font-size: 1em;
        font-weight: 500;
        box-shadow: none !important;
    }

    .ReactTable .rt-thead .rt-th {
        text-align: left;
    }

    .ReactTable .rt-tbody {
        color: ${colors['--main-font-color']};
        font-weight: 400;
        font-size: 0.85em;
    }

    .-previous, .-next, .-btn {
        background: ${colors['--table-bg-color']};
        color: ${colors['--main-font-color']}
    }

    .-pagination, .pagination-bottom {
        box-shadow: none !important;
        border-top: 1px solid rgba(0,0,0,0.1) !important;
    }

    .ReactTable .rt-thead.-filters input{
        box-shadow: none !important;
        background: ${colors['--table-bg-color']};
    }
`;

export default TableWrapper;
