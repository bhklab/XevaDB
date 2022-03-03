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

    @media only screen and (min-width: 2200px) {
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
    min-width: 80vw;
  }

  .heatmap-oncoprint-wrapper {
    background: ${colors.white};
    margin: 2vh;
    min-width: 95vw;
    max-width: 95vw;

    @media only screen and (min-width: 1600px) {
      min-width: 85vw;
      max-width: 85vw;
    }

    @media only screen and (min-width: 1800px) {
      min-width: 80vw;
      max-width: 80vw;
    }

    @media only screen and (min-width: 2000px) {
      min-width: 70vw;
      max-width: 70vw;
    }

    @media only screen and (min-width: 2200px) {
      min-width: 65vw;
      max-width: 65vw;
    }
  }

  .growth-curve-wrapper {
    background: ${colors.white};
    margin: 2vh;
    min-width: 1300px;
    max-width: 1300px;

    a {
      text-decoration: none;
      font-size: 16px;
      padding: 10px;
      color: ${colors.blue_header};
    }
  }
`;

export default GlobalStyles;
