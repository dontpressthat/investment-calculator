import React from 'react';
import styled from 'styled-components';

const itemHeight = '30px';

const Container = styled.div`
  position: ${props => props.position} !important;
  width: ${props => props.width} !important;
  height: ${props => props.height} !important;
  display: ${props => props.display} !important;
  flex-flow: ${props => props.flow} !important;
  justify-content: ${props => props.justify} !important;
  align-items: ${props => props.align} !important;
  margin: ${props => props.margin} !important;
  background-color: ${props => props.bgColor} !important;
  label, span {
    text-align: center !important;
    height: 100% !important;
    line-height: ${itemHeight} !important;
    white-space: nowrap !important;
    font-family: 'Roboto Condensed', sans-serif !important;
    font-weight: 300 !important;
  };
`;

const StyledDropdown = styled.select`
  width: 100%;
  height: ${itemHeight};
  border: 1px solid #e0e0e0 !important;
  color: #333333 !important;
  border-radius: 0px !important;
  outline-color: #c3d4c7 !important;
  box-shadow: none !important;
  font-size: 16px !important;
  font-family: 'Roboto Condensed', sans-serif !important;
`

const Dropdown = ({ label, name, value, handleChange }) => {
  return (
    <Container display='flex' justify='space-between' width='100%'>
      <Container width='45%' margin='5px'>
        <label>
          {label}
        </label>
      </Container>
      <Container width='50%' margin='5px'>
        <StyledDropdown name={name} value={value} onChange={handleChange} width='100%'>
          <option value='perUnit'>Unit value</option>
          <option value='gross'>Gross income</option>
        </StyledDropdown>
      </Container>
    </Container>
  )
};

export default Dropdown;