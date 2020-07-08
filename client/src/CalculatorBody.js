import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: ${props => props.width}px;
  display: ${props => props.display};
  flex-direction: ${props => props.direction};
  justify-content: ${props => props.justify};
  margin: ${props => props.margin};
  position: relative;
`

const StyledInput = styled.input`
  width: ${props => props.width};
  height: 30px;
  ::-webkit-inner-spin-button{
    -webkit-appearance: none; 
    margin: 0; 
  };
  ::-webkit-outer-spin-button{
    -webkit-appearance: none;
    margin: 0; 
  };
  input[type=number] {
    -moz-appearance: textfield;
  };
  border: none;
  color: #111111;
  background-color: #f0f0f0;
  padding-left: ${props => props.paddingLeft || '10px'};
  -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
  -moz-box-sizing: border-box;    /* Firefox, other Gecko */
  box-sizing: border-box;         /* Opera/IE 8+ */
  border-radius: 3px;
  font-size: 18px;
`

const DollarPrefix = styled.div`
  position: relative;
  width: ${props => props.width};
  &::before {
    position: absolute;
    content: '$';
    font-size: 18px;
    color: #555555;
    font-weight: 700;
    left: 10px;
    top: 3px;
  };
`

const PercentSuffix = styled.div`
  position: relative;
  width: ${props => props.width};
  &::after {
    position: absolute;
    content: '%';
    font-size: 18px;
    color: #555555;
    font-weight: 700;
    right: 10px;
    top: 3px;
  };
`

class CalculatorBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      purchasePrice: 400000,
      downPayment: 80000,
      downPaymentPercentage: 20,
      loanTermYears: 30,
      interestRate: 5.5,
      numUnits: 2,
      loanOriginationFee: 1,
      closingCost: 1,
      taxRate: 1.13,
      propertyMgmtFee: 6,
      monthlyPayment: 1816.92
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.monthlyPayment = this.monthlyPayment.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    console.log(value)
    this.setState({
      [name]: value
    }, () => {
      if (name === 'downPayment') {
        this.setState({ downPaymentPercentage: (100 * (this.state.downPayment / this.state.purchasePrice)).toFixed(0) });
      };
      if (name === 'downPaymentPercentage' || name === 'purchasePrice') {
        this.setState({ downPayment: (this.state.purchasePrice * (this.state.downPaymentPercentage / 100)).toFixed(0) });
      };
    });
  }

  monthlyPayment(rate, nperiod, pv, fv, type) {
    if (!fv) fv = 0;
    if (!type) type = 0;

    if (rate == 0) return -(pv + fv) / nperiod;

    var pvif = Math.pow(1 + rate, nperiod);
    var pmt = rate / (pvif - 1) * -(pv * pvif + fv);

    if (type == 1) {
      pmt /= (1 + rate);
    };

    return pmt;
  };

  render() {
    let principal = this.state.purchasePrice - this.state.downPayment;

    let payment = this.monthlyPayment(
      (this.state.interestRate / 100) / 12,
      this.state.loanTermYears * 12,
      (-1 * this.state.purchasePrice) * (1 - (this.state.downPaymentPercentage / 100))
    )

    return (
      <Container width={200} margin='0px 0px 20px 20px'>
        <form>

          <Container display='flex' direction='column' margin='20px 0px 0px 0px'>
            <label>Purchase Price</label>
            <DollarPrefix>
              <StyledInput paddingLeft='25px' width='100%' name='purchasePrice' type='number' value={this.state.purchasePrice} onChange={this.handleInputChange}></StyledInput>
            </DollarPrefix>
          </Container>

          <Container display='flex' direction='column' margin='20px 0px 0px 0px' width='100%'>
            <label>Down Payment</label>
            <Container display='flex' justify='space-between'>
              <DollarPrefix width='65%'>
                <StyledInput width='100%' paddingLeft='25px' name='downPayment' type='number' value={this.state.downPayment} onChange={this.handleInputChange}></StyledInput>
              </DollarPrefix>
              <PercentSuffix width='33%'>
                <StyledInput width='100%' name='downPaymentPercentage' type='number' value={this.state.downPaymentPercentage} onChange={this.handleInputChange}></StyledInput>
              </PercentSuffix>
            </Container>
          </Container>

          <Container display='flex' direction='column' margin='20px 0px 0px 0px'>
            <label>Interest Rate</label>
            <PercentSuffix width='33%'>
              <StyledInput width='100%' name='interestRate' type='number' value={this.state.interestRate} onChange={this.handleInputChange}></StyledInput>
            </PercentSuffix>
          </Container>

          <Container display='flex' direction='column' margin='20px 0px 0px 0px'>
            <label>Loan Term (Years)</label>
            <StyledInput width='33%' name='loanTermYears' type='number' value={this.state.loanTermYears} onChange={this.handleInputChange}></StyledInput>
          </Container>

          <Container display='flex' direction='column' margin='20px 0px 0px 0px'>
            <label>Number of Units</label>
            <StyledInput width='33%' name='numUnits' type='number' value={this.state.numUnits} onChange={this.handleInputChange}></StyledInput>
          </Container>

          <Container display='flex' direction='column' margin='20px 0px 0px 0px'>
            <label>Principal</label>
            <DollarPrefix>
              <StyledInput readOnly paddingLeft='25px' width='100%' name='principal' type='number' value={principal} onChange={this.handleInputChange}></StyledInput>
            </DollarPrefix>
          </Container>

          <Container display='flex' direction='column' margin='20px 0px 0px 0px'>
            <label>Monthly Payment</label>
            <DollarPrefix>
              <StyledInput readOnly paddingLeft='25px' width='100%' name='monthlyPayment' type='number' value={payment.toFixed(2)} onChange={this.handleInputChange}></StyledInput>
            </DollarPrefix>
          </Container>

        </form>
      </Container>
    )
  }
}

export default CalculatorBody; 