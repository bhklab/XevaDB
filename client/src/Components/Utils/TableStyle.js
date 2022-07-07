import styled from 'styled-components';
import colors from '../../styles/colors';

const TableWrapper = styled.div`
    padding: 1.5%;
    width: 100%;

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
        color: ${colors['--font-color']};
        font-size: 18px;
        box-shadow: none !important;
    }

    .ReactTable .rt-thead .rt-th {
        text-align: left;
    }

    .ReactTable .rt-tbody {
        color: ${colors['--font-color']};
        font-size: 16px;
    }

    .-previous, .-next, .-btn {
        background: ${colors['--table-bg-color']};
        color: ${colors['--font-color']}
    }

    .-pagination, .pagination-bottom {
        box-shadow: none !important;
        border-top: 1px solid rgba(0,0,0,0.1) !important;
    }

`;

export default TableWrapper;
