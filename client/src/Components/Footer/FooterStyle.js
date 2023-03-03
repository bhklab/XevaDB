import styled from 'styled-components';
import colors from '../../styles/colors';

// setting the width of the div
const width = '80vw';

// footer styled component
const FooterStyle = styled.div`
    border-top: 1px solid ${colors['--main-font-color']};
    height: 60px;
    width: ${width};
    position: absolute;
    bottom: 0;
    left: calc((100vw - ${width}) / 2);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: ${colors['--bg-color']};
    font-size: 0.9em;
`;

export default FooterStyle;
