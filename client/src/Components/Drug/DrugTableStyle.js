import styled from 'styled-components';


const TableWrapper = styled.div`
    padding:10px 20px 30px 20px;
    font-family: 'Source Serif Pro', sans-serif;

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
        background: #EAEFF9
    }

    .ReactTable .rt-thead {
        color:  #3453b0;
        font-size: 18px;
        font-weight: 600;
        box-shadow:none !important;
    }

    .ReactTable .rt-tbody{
        color:  #3453b0;
        font-size: 16px;
        box-shadow:none !important;
    }

    .-previous, .-next, .-btn {
      background: #3453b0;
      color:white !important;
    }

    .-pagination, .pagination-bottom {
        box-shadow:none !important;
        border-top:1px solid rgba(0,0,0,0.1) !important;
    }

    .ReactTable .-pagination .-pageJump input, input{
        color: #3453b0;
        box-shadow:none !important;
        background: #EAEFF9 !important;
    }

    .ReactTable .-pagination select {
        color: #3453b0;
    }
`;


export default TableWrapper;
