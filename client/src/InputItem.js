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

const Input = styled.input`
  width: ${props => props.width} !important;
  height: ${itemHeight} !important;
  ::-webkit-inner-spin-button{
    -webkit-appearance: none !important; 
    margin: 0 !important; 
  };
  ::-webkit-outer-spin-button{
    -webkit-appearance: none !important;
    margin: 0 !important; 
  };
  input[type=number] {
    -moz-appearance: textfield !important;
  };
  border: 1px solid #e0e0e0 !important;
  color: #333333 !important;
  background-color: #fff !important;
  padding-left: ${props => props.paddingLeft || '10px'} !important;
  -webkit-box-sizing: border-box !important;
  -moz-box-sizing: border-box !important;
  box-sizing: border-box !important;
  border-radius: 0px !important;
  font-size: 16px !important;
  &.readOnly {
    background-color: ${props => props.readOnlyBgColor} !important;
  };
  font-family: 'Roboto Condensed', sans-serif !important;
  outline: ${props => props.readOnly ? 'none' : null} !important;
  outline-color: #c3d4c7 !important;
  box-shadow: none !important;
`;

const DollarPrefix = styled.div`
  position: relative !important;
  width: ${props => props.width} !important;
  &::before {
    position: absolute !important;
    content: '$' !important;
    font-size: 16px !important;
    font-family: 'Roboto Condensed', sans-serif !important;
    color: #555555 !important;
    font-weight: 400 !important;
    left: 8px !important;
    top: 5px !important;
  };
`

const PercentSuffix = styled.div`
  position: relative !important;
  width: ${props => props.width} !important;
  &::after {
    position: absolute !important;
    content: '%' !important;
    font-size: 16px !important;
    font-family: 'Roboto Condensed', sans-serif !important;
    color: #555555 !important;
    font-weight: 400 !important;
    right: 7px !important;
    top: 5px !important;
  };
`

const InputItem = ({ label, name, name1, name2, value, value1, value2, handleChange, sign, readOnly, select }) => {
  let dollarPadding;
  let dollarSign;
  let percentSign;

  if (sign === 'dollar') {
    dollarPadding = '20px';
    dollarSign = <DollarPrefix />;
  } else if (sign === 'percent') {
    percentSign = <PercentSuffix />;
  } else if (name1 && name2) {
    dollarSign = <DollarPrefix />;
    percentSign = <PercentSuffix />;
  };

  const or = <Container><span>OR</span></Container>
  const select1 = (
    <Container>
      <input className='radio' type='radio' name='propertyMgmtRadio' value='1' onChange={handleChange} />
    </Container>
  );
  const select2 = (
    <Container>
      <input className='radio' type='radio' name='propertyMgmtRadio' value='2' onChange={handleChange} defaultChecked />
    </Container>
  );

  const readOnlyColor = () => {
    if (
      label === 'Cash on Cash Return' ||
      label === 'Net Income' ||
      label === 'Cap Rate'
      ) {
      return '#c3d4c7';
    } else {
      return '#f0f0f0'
    }
  };

  const singleInput = (
    <Container display='flex' justify='space-between' width='100%'>
      <Container width='45%' margin='5px'>
        <label>
          {label}
        </label>
      </Container>
      <Container width='50%' margin='5px'>
        {dollarSign}
        {percentSign}
        <Input type='number' name={name} value={value} onChange={handleChange} width='100%' paddingLeft={dollarPadding} readOnly={readOnly} className={readOnly ? 'readOnly' : null} readOnlyBgColor={readOnlyColor}></Input>
      </Container>
    </Container>
  );

  const doubleInput = (
    <Container display='flex' justify='space-between' width='100%'>
      <Container width='45%' margin='5px'>
        <label>
          {label}
        </label>
      </Container>
      <Container width='50%' margin='5px' display='flex' direction='row' justify='space-between'>
        <Container width={select ? '53%' : '45%'}>
          <Container display='flex' direction='row' align='center'>
            {select ? select1 : null}
            <Container margin={select ? '0 0 0 5px' : null}>
              {dollarSign}
              <Input type='number' name={name1} value={value1} onChange={handleChange} width='100%' paddingLeft='20px'></Input>
            </Container>
          </Container>
        </Container>
        {select ? null : or}
        <Container width={select ? '43%' : '35%'}>
          <Container display='flex' direction='row' align='center'>
            {select ? select2 : null}
            <Container margin={select ? '0 0 0 5px' : null}>
              {percentSign}
              <Input type='number' name={name2} value={value2} onChange={handleChange} width='100%'></Input>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
  return name1 && name2 ? doubleInput : singleInput;
};

export default InputItem;