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
    margin-top: 12vh;
    margin-bottom: 12vh;

    h1 {
      font-weight: 700;
      text-align: center;
      color: ${colors.blue_header};
      font-size: 1.75rem;
      padding: 25px;
    }
  }

  .component-wrapper {
    background: ${colors.white};
    margin: 2vh;
    min-width: 75vw;
    max-width: 75vw;

    @media only screen and (min-width: 1800px) {
      min-width: 70vw;
      max-width: 70vw;
    }

    @media only screen and (min-width: 2000px) {
      min-width: 65vw;
      max-width: 65vw;
    }

    @media only screen and (min-width: 2000px) {
      min-width: 60vw;
      max-width: 60vw;
    }
  }

  .center-component {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .biomarker-wrapper {
    background: ${colors.white}
    min-width: 1200px;
  }

  .heatmap-wrapper, .oprint-wrapper, .curve-wrapper,
  .donut-wrapper, .doc-wrapper, .tissue-wrapper, 
  .summary-table {
    background: ${colors.white}
    padding-top: 20px;
  }

  .heatmap-wrapper, .oprint-wrapper {
    max-width: 1400px;
  }

  .oprint-wrapper {
    margin-bottom: 200px;
  }

  .donut-wrapper, .summary-table, 
  .tissue-wrapper {
    margin-bottom: 30px;
    min-width: 1300px;
  }

  .tissue-wrapper {
    padding-bottom: 100px;
  }

  .summary-table, .stats-table {
    margin-bottom: 120px;
  }

  .curve-wrapper {
    // max-width: 90%;
    min-width: 1300px;
    max-width: 1300px;
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
