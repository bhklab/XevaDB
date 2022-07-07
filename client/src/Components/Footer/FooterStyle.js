import colors from '../../styles/colors';
import styled from 'styled-components';

const FooterStyle = styled.div`
    color: ${colors['--bg-color']};
    font-size:  1.10em;
    min-height: 7vh;
    max-height: 7vh;
    min-width: 100vw;
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    hr {
        width: 80vw;
        color: ${colors['--bg-color']};
    }
`;

export default FooterStyle;
