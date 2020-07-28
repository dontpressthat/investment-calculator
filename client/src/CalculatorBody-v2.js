import React from 'react';
import styled from 'styled-components';
import InputItem from './InputItem';

const Container = styled.div`
  width: ${props => props.width} !important;
  max-width: ${props => props.maxWidth} !important;
  min-width: ${props => props.minWidth} !important;
  display: ${props => props.display} !important;
  flex-direction: ${props => props.direction} !important;
  flex-wrap: ${props => props.flexWrap} !important;
  justify-content: ${props => props.justify} !important;
  margin: ${props => props.margin} !important;
  position: relative !important;
  background-color: ${props => props.bgColor} !important;
  padding: ${props => props.padding} !important;
  border: ${props => props.border} !important;
  border-radius: 5px !important;
  &.col {
    width: 48.5% !important;
    border: 1px solid #c0c0c0 !important;
    margin: 5px !important;
    background-color: #fff !important;
  };
  @media only screen and (min-width: 420px) {
    &.col {
      min-width: 400px !important;
      box-shadow: 3px 3px 15px #f0f0f0 !important;
    };
  };
  @media only screen and (max-width: 420px) {
    &.col {
      min-width: 95vw !important;
    };
    label {
    font-size: 10pt !important;
    };
  };
  span {
    &.heading {
      font-family: 'Roboto Condensed', sans-serif !important;
      text-align: center !important;
      height: 100% !important;
      line-height: 40px !important;
      white-space: nowrap !important;
    };
    &.title {
      font-family: 'Roboto Condensed', sans-serif !important;
      font-size: 16pt;
      text-align: center !important;
      height: 100% !important;
      line-height: 40px !important;
      white-space: nowrap !important;
    };
  };
  h2 {
    font-family: 'Roboto Condensed', sans-serif !important;
  }
`

class CalculatorBody2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      purchasePrice: 400000,
      downPayment: 80000,
      downPaymentPercentage: 20,
      loanTermYears: 30,
      interestRate: 5.5,
      numUnits: 2,
      loanOriginationFee: 3200,
      loanOriginationPercentage: 1,
      closingCostFee: 4000,
      closingCostPercentage: 1,
      taxRatePercentage: .84,
      propertyMgmtFee: 200,
      propertyMgmtPercentage: 6,
      propertyMgmtPerUnit: 100,
      propertyMgmtRadio: 2,
      insurancePerUnit: 50,
      utilitiesPerUnit: 55,
      rehab: 25000,
      rentPerUnit: 1900,
      rentPerUnitRehab: 3000,
      vacancyPercentage: 5,
      maintenancePercentage: 5,
      cashBack: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.monthlyPayment = this.monthlyPayment.bind(this);
    this.isInt = this.isInt.bind(this);
    this.calculatePmi = this.calculatePmi.bind(this);
    this.removeCommas = this.removeCommas.bind(this);
  };

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    const autoZero = value === '' ? 0 : this.removeCommas(value);


    this.setState({
      [name]: autoZero
    }, () => {
      if (name === 'downPayment') {
        this.setState({
          downPaymentPercentage: this.isInt(100 * (this.state.downPayment / this.state.purchasePrice)),
          loanOriginationFee: this.isInt((this.state.purchasePrice - this.state.downPayment) * this.state.loanOriginationPercentage / 100),
          closingCostFee: this.isInt(this.state.purchasePrice * this.state.closingCostPercentage / 100),
        });
      };
      if (name === 'downPaymentPercentage' || name === 'purchasePrice') {
        this.setState({
          downPayment: this.isInt((this.state.purchasePrice) * ((this.state.downPaymentPercentage) / 100))
        }, () => {
          this.setState({
            loanOriginationFee: this.isInt((this.state.purchasePrice - this.state.downPayment) * this.state.loanOriginationPercentage / 100),
            closingCostFee: this.isInt(this.state.purchasePrice * this.state.closingCostPercentage / 100),
          })
        });
      };
      if (name === 'loanOriginationFee') {
        this.setState({ loanOriginationPercentage: this.isInt(100 * this.state.loanOriginationFee / (this.state.purchasePrice - this.state.downPayment)) })
      };
      if (name === 'loanOriginationPercentage') {
        this.setState({ loanOriginationFee: this.isInt((this.state.purchasePrice - this.state.downPayment) * this.state.loanOriginationPercentage / 100) })
      };
      if (name === 'closingCostFee') {
        this.setState({ closingCostPercentage: this.isInt(100 * this.state.closingCostFee / this.state.purchasePrice) })
      };
      if (name === 'closingCostPercentage') {
        this.setState({ closingCostFee: this.isInt(this.state.purchasePrice * this.state.closingCostPercentage / 100) })
      };
    });
  };

  removeCommas(value) {
    if (typeof value === 'string') {
      const decomma = value.split(',');
      const parsed = parseFloat(decomma.join(''))

      return parsed;
    }
    return value;
  };

  handleRadioChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  };

  monthlyPayment(rate, nperiod, pv, fv, type) {
    if (!fv) fv = 0;
    if (!type) type = 0;

    if (rate == 0) return -(pv + fv) / nperiod;

    let pvif = Math.pow(1 + rate, nperiod);
    let pmt = rate / (pvif - 1) * -(pv * pvif + fv);

    if (type == 1) {
      pmt /= (1 + rate);
    };

    return pmt;
  };

  isInt(value) {
    const num = Number.isInteger(value) ? parseInt(value).toFixed(0) : parseFloat(value).toFixed(2);
    return num % 1 === 0 ? Math.floor(num) : num;
  };

  calculatePmi(downPaymentPercentage) {
    if (downPaymentPercentage < 20 && downPaymentPercentage >= 15) {
      return (this.state.purchasePrice - this.state.downPayment) * .0044 / 12;
    } else if (downPaymentPercentage < 15 && downPaymentPercentage >= 10) {
      return (this.state.purchasePrice - this.state.downPayment) * .0059 / 12;
    } else if (downPaymentPercentage < 10 && downPaymentPercentage >= 5) {
      return (this.state.purchasePrice - this.state.downPayment) * .0076 / 12;
    } else if (downPaymentPercentage < 5 && downPaymentPercentage >= 0) {
      return (this.state.purchasePrice - this.state.downPayment) * .0098 / 12;
    } else {
      return 0
    }
  };

  render() {
    let purchasePrice = this.state.purchasePrice;
    let downPayment = this.state.downPayment;
    let downPaymentPercentage = this.state.downPaymentPercentage;
    let loanAmount = purchasePrice - (downPayment);
    let payment = this.monthlyPayment(
      ((this.state.interestRate) / 100) / 12,
      (this.state.loanTermYears) * 12,
      (-1 * purchasePrice) * (1 - ((downPaymentPercentage) / 100))
    );
    let pmi = this.isInt(this.calculatePmi(downPaymentPercentage));
    let loanOrigination = loanAmount * ((this.state.loanOriginationPercentage) / 100);
    let closingCost = purchasePrice * ((this.state.closingCostPercentage) / 100);
    let monthlyTax = ((this.state.taxRatePercentage) / 100) * purchasePrice / 12;
    let totalInsurance = (this.state.insurancePerUnit) * (this.state.numUnits);
    let totalUtilities = this.state.utilitiesPerUnit * (this.state.numUnits);
    let totalBeforeIncome = (this.state.numUnits) * (this.state.rentPerUnit);
    let totalAfterIncome = (this.state.numUnits) * this.state.rentPerUnitRehab;
    let propertyMgmtFeeBefore = this.state.propertyMgmtRadio === '1' ? this.state.propertyMgmtFee : totalBeforeIncome * this.state.propertyMgmtPercentage / 100;
    let propertyMgmtFeeAfter = this.state.propertyMgmtRadio === '1' ? this.state.propertyMgmtFee : totalAfterIncome * this.state.propertyMgmtPercentage / 100;
    let vacancyAmtBefore = totalBeforeIncome * (this.state.vacancyPercentage) / 100;
    let vacancyAmtAfter = totalAfterIncome * (this.state.vacancyPercentage) / 100;
    let maintenanceAmtBefore = totalBeforeIncome * (this.state.maintenancePercentage) / 100;
    let maintenanceAmtAfter = totalAfterIncome * (this.state.maintenancePercentage) / 100;
    let operatingExpensesBefore = monthlyTax + totalInsurance + parseFloat(propertyMgmtFeeBefore) + totalUtilities + (vacancyAmtBefore) + maintenanceAmtBefore + parseFloat(pmi);
    let operatingExpensesAfter = monthlyTax + totalInsurance + parseFloat(propertyMgmtFeeAfter) + totalUtilities + (vacancyAmtAfter) + maintenanceAmtAfter + parseFloat(pmi);
    let netIncomeBefore = totalBeforeIncome - parseFloat(operatingExpensesBefore) - payment;
    let netIncomeAfter = totalAfterIncome - operatingExpensesAfter - payment;
    let turnKeyCost = parseFloat(downPayment) + loanOrigination + closingCost - (this.state.cashBack);
    let cashOnCashReturnBefore = netIncomeBefore * 12 / turnKeyCost * 100;
    let cashOnCashReturnAfter = netIncomeAfter * 12 / (turnKeyCost + this.state.rehab) * 100;
    let capRateBefore = (totalBeforeIncome - operatingExpensesBefore) * 12 / purchasePrice * 100;
    let capRateAfter = (totalAfterIncome - operatingExpensesAfter) * 12 / purchasePrice * 100;

    const pmiLineItem = (
      <InputItem label='PMI' name='pmi' value={pmi} sign='dollar' readOnly={true} />
    );

    return (
      <Container display='flex' direction='column' width='98vw' maxWidth='1000px'>
        <center>
          <h2>Cashflow Calculator</h2>
        </center>

        <Container display='flex' direction='row' justify='space-around' flexWrap='wrap'>
          <Container className='col col1'>

            <Container width='100%' display='flex' align='center' justify='center' height='40px'>
              <span className='title'>INPUTS</span>
            </Container>

            <InputItem label='Purchase Price' name='purchasePrice' value={this.state.purchasePrice} handleChange={this.handleInputChange} sign='dollar' />
            <InputItem label='Cash Back' name='cashBack' value={this.state.cashBack} handleChange={this.handleInputChange} sign='dollar' />
            <InputItem label='Down Payment' name1='downPayment' value1={this.state.downPayment} name2='downPaymentPercentage' value2={this.state.downPaymentPercentage} handleChange={this.handleInputChange} />
            <InputItem label='Loan Interest Rate' name='interestRate' value={this.state.interestRate} handleChange={this.handleInputChange} sign='percent' />
            <InputItem label='Tax Rate' name='taxRatePercentage' value={this.state.taxRatePercentage} handleChange={this.handleInputChange} sign='percent' />
            <InputItem label='Loan Term (Years)' name='loanTermYears' value={this.state.loanTermYears} handleChange={this.handleInputChange} />
            <InputItem label='Loan Origination Fee' name1='loanOriginationFee' value1={this.state.loanOriginationFee} name2='loanOriginationPercentage' value2={this.state.loanOriginationPercentage} handleChange={this.handleInputChange} />
            <InputItem label='Closing Cost' name1='closingCostFee' value1={this.state.closingCostFee} name2='closingCostPercentage' value2={this.state.closingCostPercentage} handleChange={this.handleInputChange} />
            <InputItem label='Number of Units' name='numUnits' value={(this.state.numUnits)} handleChange={this.handleInputChange} />
            <InputItem label='Before Rehab Income/Unit' name='rentPerUnit' value={this.state.rentPerUnit} handleChange={this.handleInputChange} sign='dollar' />
            <InputItem label='Estimated Rehab Cost' name='rehab' value={this.state.rehab} handleChange={this.handleInputChange} sign='dollar' />
            <InputItem label='After Rehab Income/Unit' name='rentPerUnitRehab' value={this.state.rentPerUnitRehab} handleChange={this.handleInputChange} sign='dollar' />
            <InputItem label='Insurance Cost/Unit' name='insurancePerUnit' value={this.state.insurancePerUnit} handleChange={this.handleInputChange} sign='dollar' />
            <InputItem label='Utilities Cost/Unit' name='utilitiesPerUnit' value={this.state.utilitiesPerUnit} handleChange={this.handleInputChange} sign='dollar' />
            <InputItem label='Property Mgmt Fee' name1='propertyMgmtFee' value1={this.state.propertyMgmtFee} name2='propertyMgmtPercentage' value2={this.state.propertyMgmtPercentage} handleRadioChange={this.handleRadioChange} handleChange={this.handleInputChange} select={true} />
            <InputItem label='Vacancy' name='vacancyPercentage' value={this.state.vacancyPercentage} handleChange={this.handleInputChange} sign='percent' />
            <InputItem label='Maintenance' name='maintenancePercentage' value={this.state.maintenancePercentage} handleChange={this.handleInputChange} sign='percent' />
          </Container>

          <Container className='col col2'>

            <Container width='100%' display='flex' align='center' justify='center' height='40px'>
              <span className='title'>OUTPUTS</span>
            </Container>

            <InputItem label='Purchase Price' name='purchasePrice' value={this.isInt(purchasePrice)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label='Down Payment' name='downPayment' value={this.state.downPayment} sign='dollar' readOnly={true} payable={true} />
            <InputItem label='Loan Amount' name='loanAmount' value={this.isInt(loanAmount)} sign='dollar' readOnly={true} weight={700} />
            <InputItem label='Loan Origination Fee' name='loanOrigination' value={this.isInt(loanOrigination)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label='Closing Cost' name='closingCost' value={this.isInt(closingCost)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label='Turn-Key Cost' name='turnKeyCost' value={this.isInt(turnKeyCost)} sign='dollar' readOnly={true} payable={true} weight={700} />
            {this.state.downPaymentPercentage < 20 ? pmiLineItem : null}


            <Container width='100%' display='flex' align='center' justify='center' height='40px'>
              <span className='heading'>BEFORE REHAB</span>
            </Container>
            <InputItem label='Total Rent Income' name='totalBeforeIncome' value={this.isInt(totalBeforeIncome)} sign='dollar' readOnly={true} weight={700} />
            <InputItem label='Debt Service' name='monthlyPayment' value={this.isInt(payment)} sign='dollar' readOnly={true} payable={true} weight={700} />
            <InputItem label='Tax' name='monthlyTax' value={this.isInt(monthlyTax)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label='Total Insurance' name='totalInsurance' value={this.isInt(totalInsurance)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label='Total Utilities' name='totalUtilities' value={this.isInt(totalUtilities)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label={`${this.state.vacancyPercentage}% Vacancy`} name='vacancyBefore' value={this.isInt(vacancyAmtBefore)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label={`${this.state.maintenancePercentage}% Maintenance`} name='maintenance' value={this.isInt(maintenanceAmtBefore)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label='Property Mgmt Fee' name='propertyMgmtFeeBefore' value={this.isInt(propertyMgmtFeeBefore)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label='Total Operating Expenses' name='totalOperatingExpensesBefore' value={this.isInt(operatingExpensesBefore)} sign='dollar' readOnly={true} payable={true} weight={700} />
            <InputItem label='Net Income' name='netBeforeIncome' value={this.isInt(netIncomeBefore)} sign='dollar' readOnly={true} weight={700} />
            <InputItem label='Cash on Cash Return' name='ccrBefore' value={this.isInt(cashOnCashReturnBefore)} sign='percent' readOnly={true} />
            <InputItem label='Cap Rate' name='capRateBefore' value={this.isInt(capRateBefore)} sign='percent' readOnly={true} />

            <Container width='100%' display='flex' align='center' justify='center' height='40px'>
              <span className='heading'>AFTER REHAB</span>
            </Container>
            <InputItem label='Total Rent Income' name='totalAfterIncome' value={this.isInt(totalAfterIncome)} sign='dollar' readOnly={true} weight={700} />
            <InputItem label='Debt Service' name='monthlyPayment' value={this.isInt(payment)} sign='dollar' readOnly={true} payable={true} weight={700} />
            <InputItem label='Tax' name='monthlyTax' value={this.isInt(monthlyTax)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label='Total Insurance' name='totalInsurance' value={this.isInt(totalInsurance)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label='Total Utilities' name='totalUtilities' value={this.isInt(totalUtilities)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label={`${this.state.vacancyPercentage}% Vacancy`} name='vacancyAfter' value={this.isInt(vacancyAmtAfter)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label={`${this.state.maintenancePercentage}% Maintenance`} name='maintenance' value={this.isInt(maintenanceAmtAfter)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label='Property Mgmt Fee' name='propertyMgmtFeeAfter' value={this.isInt(propertyMgmtFeeAfter)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label='Total Operating Expenses' name='totalOperatingExpensesAfter' value={this.isInt(operatingExpensesAfter)} sign='dollar' readOnly={true} payable={true} weight={700} />
            <InputItem label='Net Income' name='netAfterIncome' value={this.isInt(netIncomeAfter)} sign='dollar' readOnly={true} weight={700} />
            <InputItem label='Cash on Cash Return' name='ccrAfter' value={this.isInt(cashOnCashReturnAfter)} sign='percent' readOnly={true} />
            <InputItem label='Cap Rate' name='capRateAfter' value={this.isInt(capRateAfter)} sign='percent' readOnly={true} />


          </Container>
        </Container>
      </Container>
    )
  }
}

export default CalculatorBody2; 