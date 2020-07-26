import React from 'react';
import styled from 'styled-components';
import CalculatorBody2 from './CalculatorBody-v2';

const Container = styled.div`
  width: 100% !important;
  display: flex !important;
  justify-content: center !important;
`

const Main = styled.div`
  display: flex !important;
  height: max-content !important;
  width: max-content !important;
  @media only screen and (min-width: 900px) {
    justify-content: center !important;
  };
  @media only screen and (max-width: 900px) {
    margin-top: 0 !important;
  };
`

const App = () => {
  return (
    <Container>
      <Main>
        <CalculatorBody2 />
      </Main>
    </Container>
  )
}

export default App; 