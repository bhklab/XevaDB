import styled from 'styled-components'
import bgImg from '../../images/bgImg5.jpg';


const Container = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background: linear-gradient(
    to right top,
    rgba(255, 255, 255, 0.4), 
    rgba(255, 255, 255, 0.4)
  ),url('${bgImg}');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
`

export default Container