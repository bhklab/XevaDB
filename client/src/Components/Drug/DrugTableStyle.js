import styled from 'styled-components';


const TableWrapper = styled.div`
    padding:10px 20px 30px 20px;

    .ReactTable * {
        box-sizing: border-box;
    }

    .ReactTable .rt-table {
        align-items: stretch;
        width: 100%;
        border-collapse: collapse;
        overflow: auto
    }

    .ReactTable .rt-thead {
        color:  #3453b0;
        font-size: 18px;
        font-weight: 600;
    }

    .ReactTable .rt-thead .rt-tr {
        text-align: center
    }

    .ReactTable .rt-tbody{
        color:  #3453b0;
        font-size: 16px;
    }

    .-previous, .-next, .-btn {
      background: #5676db;
      color:white !important;
    }

    .ReactTable .-pagination .-pageJump input{
        color: #3453b0;
    }
`;


export default TableWrapper;
