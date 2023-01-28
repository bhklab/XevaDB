import colors from '../styles/colors';

// maps mRECIST response to values from 1 - 4
const mRECISTColorMapper = {
    PD: `${colors.red}`,
    SD: `${colors.yellow}`,
    PR: `${colors.green}`,
    CR: `${colors.blue}`,
    NA: 0,
};

export default mRECISTColorMapper;
