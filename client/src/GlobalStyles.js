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
    width:100%;
  }

  #root {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    
    min-width: 100vw;
    width: auto;
    position: relative;
    margin: 0px;
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

  .oprint-wrapper {
    margin-bottom: 100px;
  }

  .heatmap-wrapper, .oprint-wrapper {
    min-width: 1417px;
  }

  .heatmap-wrapper, .oprint-wrapper, .curve-wrapper,
  .donut-wrapper, .doc-wrapper { //put all wrappers here and wrap them with wrapper
    background: ${colors.white}
    font-family: 'Raleway', sans-serif;
  }

  .donut-wrapper {
    margin-bottom: 20px;
    min-width: 1300px;
  }

  .heatmap, .oprint {
    height: 700px;
    overflow: auto;
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
