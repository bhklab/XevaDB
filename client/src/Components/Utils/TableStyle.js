import styled from 'styled-components';
import colors from '../../styles/colors';

const TableWrapper = styled.div`
    margin: auto !important;
    padding: 10px 20px 30px 20px;
    font-family: 'Raleway', sans-serif;

    .ReactTable * {
        box-sizing: border-box;
    }

    .ReactTable .rt-table {
        align-items: stretch;
        width: 100%;
        border-collapse: collapse;
        overflow: auto
    }

    .rt-thead.-header {
        border-bottom: 1px solid rgba(0,0,0,0.1);
    }

    .ReactTable.-highlight .rt-tbody .rt-tr:not(.-padRow):hover {
        background: ${colors.fade_blue}
    }

    .ReactTable .rt-thead {
        color:  ${colors.blue_header};
        font-size: 18px;
        font-weight: 600;
        box-shadow:none !important;
    }

    .ReactTable .rt-tbody{
        color:  ${colors.blue_header};
        font-size: 16px;
        box-shadow:none !important;
    }

    .-previous, .-next, .-btn {
      background: ${colors.blue_header};
      color:white !important;
    }

    .-pagination, .pagination-bottom {
        box-shadow:none !important;
        border-top:1px solid rgba(0,0,0,0.1) !important;
    }

    .ReactTable .-pagination .-pageJump input, input{
        color: ${colors.blue_header};
        box-shadow:none !important;
        background: ${colors.fade_blue} !important;
    }

    .ReactTable .-pagination select {
        color: ${colors.blue_header};
    }
`;


export default TableWrapper;
