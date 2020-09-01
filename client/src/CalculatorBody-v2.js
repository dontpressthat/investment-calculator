import React from 'react';
import styled from 'styled-components';
import InputItem from './InputItem';
import Separator from './Separator';
import Dropdown from './Dropdown';

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
      loanOriginationFee: 3200,
      loanOriginationPercentage: 1,
      closingCostFee: 4000,
      closingCostPercentage: 1,
      taxRatePercentage: .84,
      propertyMgmtFee: 200,
      propertyMgmtPercentage: 6,
      propertyMgmtRadio: 2,
      insurancePerUnit: 50,
      utilitiesPerUnit: 55,
      rehab: 25000,
      vacancyPercentage: 5,
      maintenancePercentage: 5,
      cashBack: '',
      differentIncomeBefore: [{ qty: 2, amt: 1900 }],
      differentIncomeAfter: [{ qty: 2, amt: 3000 }],
      incomeTypeDropdownBefore: 'perUnit',
      incomeTypeDropdownAfter: 'perUnit',
      grossIncomeBefore: 3800,
      grossIncomeAfter: 6000
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRadioAndDropdownChange = this.handleRadioAndDropdownChange.bind(this);
    this.handleUnitItemChange = this.handleUnitItemChange.bind(this);
    this.monthlyPayment = this.monthlyPayment.bind(this);
    this.isInt = this.isInt.bind(this);
    this.calculatePmi = this.calculatePmi.bind(this);
    this.removeCommas = this.removeCommas.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.addItem = this.addItem.bind(this);
  };

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = this.removeCommas(target.value) || null;

    this.setState({
      [name]: value
    }, () => {
      if (name === 'downPayment') {
        this.setState({
          downPaymentPercentage: this.isInt(100 * (this.state.downPayment / this.state.purchasePrice)),
          loanOriginationFee: this.isInt((this.statepurchasePrice - this.state.downPayment) * this.state.loanOriginationPercentage / 100),
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

  handleRadioAndDropdownChange(event) {
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

  deleteItem(idx, name) {
    const arr = Array.from(this.state[name]);
    arr.splice(idx, 1);

    this.setState({
      [name]: arr
    });
  };

  addItem(name) {
    let arr = Array.from(this.state[name]);
    arr.push({ qty: 1, amt: null });

    this.setState({
      [name]: arr
    })
  };

  handleUnitItemChange(idx, name, key, event) {
    const target = event.target;
    const value = target.value || null;

    let arr = Array.from(this.state[name]);
    arr[idx][key] = this.removeCommas(value);

    this.setState({
      [name]: arr
    })
  };

  render() {
    const { downPayment, downPaymentPercentage, loanTermYears, interestRate, loanOriginationFee, loanOriginationPercentage, closingCostFee, closingCostPercentage, taxRatePercentage, propertyMgmtFee, propertyMgmtPercentage, propertyMgmtRadio, insurancePerUnit, utilitiesPerUnit, rehab, vacancyPercentage, maintenancePercentage, cashBack, differentIncomeBefore, differentIncomeAfter, incomeTypeDropdownBefore, incomeTypeDropdownAfter, grossIncomeBefore, grossIncomeAfter } = this.state;
    const purchasePrice = this.state.purchasePrice || 0;
    const multiplyUnitsWith = {
      before: item => {
        let arr = differentIncomeBefore;
        let numUnits = 0;
        for (let i = 0; i < arr.length; i++) {
          numUnits += arr[i].qty;
        };
        return numUnits * item;
      },
      after: item => {
        let arr = differentIncomeAfter;
        let numUnits = 0;
        for (let i = 0; i < arr.length; i++) {
          numUnits += arr[i].qty;
        };
        return numUnits * item;
      }
    };
    const calculateTotal = {
      before: () => {
        let total = 0;
        if (this.state.incomeTypeDropdownBefore === 'gross') {
          total = this.state.grossIncomeBefore || 0;
        } else {
          let arr = differentIncomeBefore;
          for (let i = 0; i < arr.length; i++) {
            total += arr[i].qty * arr[i].amt;
          };
        };
        return total;
      },
      after: () => {
        let total = 0;
        if (this.state.incomeTypeDropdownAfter === 'gross') {
          total = this.state.grossIncomeAfter || 0;
        } else {
          let arr = differentIncomeAfter;
          for (let i = 0; i < arr.length; i++) {
            total += arr[i].qty * arr[i].amt;
          };
        }
        return total;
      }
    };
    let loanAmount = (purchasePrice || 0) - downPayment;
    let payment = this.monthlyPayment(
      ((this.state.interestRate) / 100) / 12,
      (this.state.loanTermYears) * 12,
      (-1 * (purchasePrice || 0)) * (1 - (downPaymentPercentage / 100))
    );
    let pmi = this.isInt(this.calculatePmi(downPaymentPercentage));
    let loanOrigination = loanAmount * (loanOriginationPercentage / 100);
    let closingCost = (purchasePrice || 0) * (closingCostPercentage / 100);
    let monthlyTax = (taxRatePercentage / 100) * (purchasePrice || 0) / 12;
    let totalInsuranceBefore = multiplyUnitsWith.before(insurancePerUnit);
    let totalUtilitiesBefore = multiplyUnitsWith.before(utilitiesPerUnit);
    let totalInsuranceAfter = multiplyUnitsWith.after(insurancePerUnit);
    let totalUtilitiesAfter = multiplyUnitsWith.after(utilitiesPerUnit);
    let totalBeforeIncome = calculateTotal.before();
    let totalAfterIncome = calculateTotal.after();
    let propertyMgmtFeeBefore = propertyMgmtRadio === '1' ? (propertyMgmtFee || 0) : totalBeforeIncome * propertyMgmtPercentage / 100;
    let propertyMgmtFeeAfter = propertyMgmtRadio === '1' ? (propertyMgmtFee || 0) : totalAfterIncome * propertyMgmtPercentage / 100;
    let vacancyAmtBefore = totalBeforeIncome * vacancyPercentage / 100;
    let vacancyAmtAfter = totalAfterIncome * vacancyPercentage / 100;
    let maintenanceAmtBefore = totalBeforeIncome * maintenancePercentage / 100;
    let maintenanceAmtAfter = totalAfterIncome * maintenancePercentage / 100;
    let operatingExpensesBefore = monthlyTax + totalInsuranceBefore + parseFloat(propertyMgmtFeeBefore) + totalUtilitiesBefore + vacancyAmtBefore + maintenanceAmtBefore + parseFloat(pmi);
    let operatingExpensesAfter = monthlyTax + totalInsuranceAfter + parseFloat(propertyMgmtFeeAfter) + totalUtilitiesAfter + vacancyAmtAfter + maintenanceAmtAfter + parseFloat(pmi);
    let netIncomeBefore = totalBeforeIncome - parseFloat(operatingExpensesBefore) - payment;
    let netIncomeAfter = totalAfterIncome - operatingExpensesAfter - payment;
    let turnKeyCost = (parseFloat(downPayment) || 0) + loanOrigination + closingCost - cashBack;
    let cashOnCashReturnBefore = netIncomeBefore * 12 / turnKeyCost * 100;
    let cashOnCashReturnAfter = netIncomeAfter * 12 / (turnKeyCost + rehab) * 100;
    let capRateBefore = (totalBeforeIncome - operatingExpensesBefore) * 12 / (purchasePrice || 0) * 100;
    let capRateAfter = (totalAfterIncome - operatingExpensesAfter) * 12 / (purchasePrice || 0) * 100;
    const pmiLineItem = <InputItem label='PMI' name='pmi' value={pmi} sign='dollar' readOnly={true} />;
    const incomePerUnitListBefore = differentIncomeBefore.map((item, idx) => {
      return <InputItem
        unitData
        label={`Unit Type ${idx + 1}`}
        name='differentIncomeBefore'
        name1={`qty`}
        name2={`amt`}
        value1={item.qty}
        value2={item.amt}
        key={idx}
        idx={idx}
        numItems={differentIncomeBefore.length}
        deleteItem={this.deleteItem}
        handleChange={this.handleUnitItemChange}
      />
    });
    const addItemBefore = <InputItem name='differentIncomeBefore' label='Add New Type' addItem={this.addItem} plus />;
    const itemizedSectionBefore = <>{incomePerUnitListBefore}{addItemBefore}</>;
    const grossSectionBefore = <InputItem label='Gross Income' name='grossIncomeBefore' value={grossIncomeBefore} sign='dollar' handleChange={this.handleInputChange} />
    const incomePerUnitListAfter = differentIncomeAfter.map((item, idx) => {
      return <InputItem
        unitData
        label={`Unit Type ${idx + 1}`}
        name='differentIncomeAfter'
        name1={`qty`}
        name2={`amt`}
        value1={item.qty}
        value2={item.amt}
        key={idx}
        idx={idx}
        numItems={differentIncomeAfter.length}
        deleteItem={this.deleteItem}
        handleChange={this.handleUnitItemChange}
      />
    });
    const addItemAfter = <InputItem name='differentIncomeAfter' label='Add New Type' addItem={this.addItem} plus />;
    const itemizedSectionAfter = <>{incomePerUnitListAfter}{addItemAfter}</>
    const grossSectionAfter = <InputItem label='Gross Income' name='grossIncomeAfter' value={grossIncomeAfter} sign='dollar' handleChange={this.handleInputChange} />
    const incomeType = beforeOrAfter => {
      if (beforeOrAfter === 'before') {
        if (this.state.incomeTypeDropdownBefore === 'perUnit') {
          return itemizedSectionBefore;
        } else {
          return grossSectionBefore;
        }
      } else {
        if (this.state.incomeTypeDropdownAfter === 'perUnit') {
          return itemizedSectionAfter;
        } else {
          return grossSectionAfter;
        }
      }
    };

    return (
      <Container display='flex' direction='column' width='98vw' maxWidth='1000px'>
        <Container width='100%' display='flex' direction='column'>
          <center>
            <img src='assets/logo.png' width='50px' />
            <h2>Cashflow Calculator</h2>
          </center>
        </Container>

        <Container display='flex' direction='row' justify='space-around' flexWrap='wrap'>
          <Container className='col col1'>

            <Container width='100%' display='flex' align='center' justify='center' height='40px'>
              <span className='title'>INPUTS</span>
            </Container>
            <InputItem label='Purchase Price' name='purchasePrice' value={purchasePrice} handleChange={this.handleInputChange} sign='dollar' />
            <InputItem label='Cash Back' name='cashBack' value={cashBack} handleChange={this.handleInputChange} sign='dollar' />
            <InputItem label='Down Payment' name1='downPayment' value1={downPayment} name2='downPaymentPercentage' value2={downPaymentPercentage} handleChange={this.handleInputChange} />
            <InputItem label='Loan Interest Rate' name='interestRate' value={interestRate} handleChange={this.handleInputChange} sign='percent' />
            <InputItem label='Tax Rate' name='taxRatePercentage' value={taxRatePercentage} handleChange={this.handleInputChange} sign='percent' />
            <InputItem label='Loan Term (Years)' name='loanTermYears' value={loanTermYears} handleChange={this.handleInputChange} />
            <InputItem label='Loan Origination Fee' name1='loanOriginationFee' value1={loanOriginationFee} name2='loanOriginationPercentage' value2={loanOriginationPercentage} handleChange={this.handleInputChange} />
            <InputItem label='Closing Cost' name1='closingCostFee' value1={closingCostFee} name2='closingCostPercentage' value2={closingCostPercentage} handleChange={this.handleInputChange} />
            <Separator />
            <Container width='100%' display='flex' align='center' justify='center' height='40px'>
              <span className='heading'>BEFORE REHAB RENTAL INCOME</span>
            </Container>
            <Dropdown label='Enter Income By:' name='incomeTypeDropdownBefore' value={incomeTypeDropdownBefore} handleChange={this.handleRadioAndDropdownChange} />
            {incomeType('before')}
            <Container width='100%' display='flex' align='center' justify='center' height='40px'>
              <span className='heading'>AFTER REHAB RENTAL INCOME</span>
            </Container>
            <InputItem label='Estimated Rehab Cost' name='rehab' value={rehab} handleChange={this.handleInputChange} sign='dollar' />
            <Dropdown label='Enter Income By:' name='incomeTypeDropdownAfter' value={incomeTypeDropdownAfter} handleChange={this.handleRadioAndDropdownChange} />
            {incomeType('after')}
            <Separator />
            <InputItem label='Insurance Cost/Unit' name='insurancePerUnit' value={insurancePerUnit} handleChange={this.handleInputChange} sign='dollar' />
            <InputItem label='Utilities Cost/Unit' name='utilitiesPerUnit' value={utilitiesPerUnit} handleChange={this.handleInputChange} sign='dollar' />
            <InputItem label='Property Mgmt Fee' name1='propertyMgmtFee' value1={propertyMgmtFee} name2='propertyMgmtPercentage' value2={propertyMgmtPercentage} handleRadioAndDropdownChange={this.handleRadioAndDropdownChange} handleChange={this.handleInputChange} select={true} />
            <InputItem label='Vacancy' name='vacancyPercentage' value={vacancyPercentage} handleChange={this.handleInputChange} sign='percent' />
            <InputItem label='Maintenance' name='maintenancePercentage' value={maintenancePercentage} handleChange={this.handleInputChange} sign='percent' />
          </Container>

          <Container className='col col2'>

            <Container width='100%' display='flex' align='center' justify='center' height='40px'>
              <span className='title'>OUTPUTS</span>
            </Container>

            <InputItem label='Purchase Price' name='purchasePrice' value={this.isInt(purchasePrice)} sign='dollar' readOnly={true} />
            <InputItem label='Down Payment' name='downPayment' value={downPayment} sign='dollar' readOnly={true} payable={true} />
            <InputItem label='Loan Amount' name='loanAmount' value={this.isInt(loanAmount)} sign='dollar' readOnly={true} weight={700} />
            <InputItem label='Loan Origination Fee' name='loanOrigination' value={this.isInt(loanOrigination)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label='Closing Cost' name='closingCost' value={this.isInt(closingCost)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label='Turn-Key Cost' name='turnKeyCost' value={this.isInt(turnKeyCost)} sign='dollar' readOnly={true} payable={true} weight={700} />
            {downPaymentPercentage < 20 ? pmiLineItem : null}


            <Container width='100%' display='flex' align='center' justify='center' height='40px'>
              <span className='heading'>BEFORE REHAB</span>
            </Container>
            <InputItem label='Total Rent Income' name='totalBeforeIncome' value={this.isInt(totalBeforeIncome)} sign='dollar' readOnly={true} weight={700} />
            <InputItem label='Debt Service' name='monthlyPayment' value={this.isInt(payment)} sign='dollar' readOnly={true} payable={true} weight={700} />
            <InputItem label='Tax' name='monthlyTax' value={this.isInt(monthlyTax)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label='Total Insurance' name='totalInsurance' value={this.isInt(totalInsuranceBefore)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label='Total Utilities' name='totalUtilities' value={this.isInt(totalUtilitiesBefore)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label={`${vacancyPercentage || 0}% Vacancy`} name='vacancyBefore' value={this.isInt(vacancyAmtBefore)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label={`${maintenancePercentage || 0}% Maintenance`} name='maintenance' value={this.isInt(maintenanceAmtBefore)} sign='dollar' readOnly={true} payable={true} />
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
            <InputItem label='Total Insurance' name='totalInsurance' value={this.isInt(totalInsuranceAfter)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label='Total Utilities' name='totalUtilities' value={this.isInt(totalUtilitiesAfter)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label={`${vacancyPercentage || 0}% Vacancy`} name='vacancyAfter' value={this.isInt(vacancyAmtAfter)} sign='dollar' readOnly={true} payable={true} />
            <InputItem label={`${maintenancePercentage || 0}% Maintenance`} name='maintenance' value={this.isInt(maintenanceAmtAfter)} sign='dollar' readOnly={true} payable={true} />
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