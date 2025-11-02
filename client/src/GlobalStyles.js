import { createGlobalStyle } from 'styled-components';
import colors from './styles/colors';

const GlobalStyles = createGlobalStyle`

  * {
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
    font-family: 'Open Sans', sans-serif;

    // font-family: 'Lato', sans-serif;
    // font-family: 'Merriweather', serif;
    // font-family: 'Montserrat', sans-serif;
    // font-family: 'Roboto', sans-serif;
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
      color: ${colors['--main-font-color']};
      font-size: 1.75em;
      font-weight: 700;
      padding: 1.5% 0 0.25% 1.5%;
    }

    h4 {
      font-weight: 300;
      color: ${colors['--main-font-color']};
      font-size: 0.95em;
      padding: 0 0 0.5% 1.5%;
    }
  }

  .component-wrapper {
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
    background: ${colors.white};
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    min-width: 80vw;
  }

  .heatmap-oncoprint-wrapper {
	min-width: 100%;
	overflow: hidden
  }

  .growth-curve-wrapper {
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
