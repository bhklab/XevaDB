import { createGlobalStyle } from 'styled-components';
import bgImg from './images/bgImg7.png';
import colors from './styles/colors';

const GlobalStyles = createGlobalStyle`

  body {
    background: linear-gradient(
      to right top,
      rgba(255, 255, 255, 0.3), 
      rgba(255, 255, 255, 0.3)
    ),url('${bgImg}');
    background-size: cover;
    background-attachment: fixed;
    background-position: center;
    margin: auto;
    width: 100%;
  }

  #root {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    min-width: 100vw;
    width: auto;
    position: relative;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 150px;

    h1 {
      font-family:'Raleway', sans-serif;
      font-weight: 700;
      text-align: center;
      color: ${colors.blue_header};
    }
  }

  .heatmap-wrapper, .oprint-wrapper, .curve-wrapper,
  .donut-wrapper, .doc-wrapper {
    background: ${colors.white}
    font-family: 'Raleway', sans-serif;
  }

  .heatmap-wrapper, .oprint-wrapper {
    max-width: 1400px;
  }

  .oprint-wrapper {
    margin-bottom: 100px;
  }

  .donut-wrapper {
    margin-bottom: 20px;
    min-width: 1300px;
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
      padding: 20px;
      font-family: 'Raleway', sans-serif;
      color: ${colors.blue_header};
    }

    .no-graph {
      padding: 50px;
    }
  }
`;


export default GlobalStyles;
