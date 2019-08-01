import styled from 'styled-components'
import bgImg from '../../images/bgImg.jpg';


const Container = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background: linear-gradient(
    to right top,
    rgba(255, 255, 255, 0.6), 
    rgba(255, 255, 255, 0.6)
  ),url('${bgImg}');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
`

export default Container