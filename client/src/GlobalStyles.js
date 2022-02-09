import { createGlobalStyle } from 'styled-components';
import colors from './styles/colors';

const GlobalStyles = createGlobalStyle`

  * {
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
    font-family: 'Open Sans', 'Roboto';
  }

  body {
    background: linear-gradient(
      to right top, 
      ${colors.fade_blue}, 
      ${colors.white_red}
    );
    background-size: cover;
    background-attachment: fixed;
    background-position: center;
    margin: auto;
    width: 100%;
    font-size: 16px;
  }

  #root {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    min-width: 100vw;
    width: auto;
    position: relative;
    font-size: 16px;
  }

  a {
    text-decoration: none;
    &:hover {
      cursor: pointer !important;
    }
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 8rem;

    h1 {
      font-weight: 700;
      text-align: center;
      color: ${colors.blue_header};
      font-size: 1.75rem;
    }
  }

  .heatmap-wrapper, .oprint-wrapper, .curve-wrapper,
  .donut-wrapper, .doc-wrapper, .tissue-wrapper, 
  .summary-table, .biomarker-wrapper {
    background: ${colors.white}
    padding-top: 20px;
  }

  .heatmap-wrapper, .oprint-wrapper {
    max-width: 1400px;
  }

  .oprint-wrapper {
    margin-bottom: 100px;
  }

  .donut-wrapper, .summary-table, 
  .tissue-wrapper, .biomarker-wrapper {
    margin-bottom: 30px;
    min-width: 1300px;
  }

  .tissue-wrapper {
    padding-bottom: 100px;
  }

  .biomarker-wrapper {
    margin-bottom: 160px;
    min-width: 1200px;
  }

  .summary-table, .stats-table {
    margin-bottom: 120px;
  }

  .curve-wrapper {
    min-width: 1300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    a {
      text-decoration: none;
      font-size: 16px;
      padding: 10px;
      color: ${colors.blue_header};
    }

    .no-graph {
      padding: 50px;
    }
  }
`;

export default GlobalStyles;
