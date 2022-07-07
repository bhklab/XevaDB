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
      text-align: left;
      color: ${colors['--font-color']};
      font-size: 1.5rem;
      padding: 1.5% 0 0.25% 1.5%;
    }

    h4 {
      font-weight: 100;
      color: ${colors['--font-color']};
      font-size: 1.05rem;
      padding: 0 0 0.5% 1.5%;
    }
  }

  .component-wrapper {
    background: ${colors.white};
    margin: 2vh;
    min-width: 75vw;
    max-width: 75vw;
    // border: 1px solid ${colors['--table-bg-color']};

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
    background: ${colors.white};
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
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
      color: ${colors['--link-color']};
    }
  }
`;

export default GlobalStyles;
