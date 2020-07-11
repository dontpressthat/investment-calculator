import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: ${props => props.width} !important;
  display: ${props => props.display} !important;
  flex-direction: ${props => props.direction} !important;
  justify-content: ${props => props.justify} !important;
  margin: ${props => props.margin} !important;
  position: relative !important;
  background-color: ${props => props.bgColor} !important;
  padding: ${props => props.padding} !important;
  border: ${props => props.border} !important;
  border-radius: 5px !important;
  & label {
    font-size: 10pt !important;
  }
`

const StyledInput = styled.input`
  width: ${props => props.width} !important;
  height: 30px !important;
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
  border: 1px solid #9f9f9f !important;
  color: #333333 !important;
  background-color: #fff !important;
  padding-left: ${props => props.paddingLeft || '10px'} !important;
  -webkit-box-sizing: border-box !important; /* Safari/Chrome, other WebKit */
  -moz-box-sizing: border-box !important;    /* Firefox, other Gecko */
  box-sizing: border-box !important;         /* Opera/IE 8+ */
  border-radius: 3px !important;
  font-size: 16px !important;
  &.readOnly {
    background-color: lightgray !important;
  };
  &.radio {
    position: absolute !important;
    bottom: 20px !important;
    left: -15px !important;
  };
`

const DollarPrefix = styled.div`
  position: relative !important;
  width: ${props => props.width} !important;
  &::before {
    position: absolute !important;
    content: '$';
    font-size: 18px !important;
    color: #555555 !important;
    font-weight: 700 !important;
    left: 10px !important;
    top: 3px !important;
  };
`

const PercentSuffix = styled.div`
  position: relative !important;
  width: ${props => props.width} !important;
  &::after {
    position: absolute !important;
    content: '%';
    font-size: 18px !important;
    color: #555555 !important;
    font-weight: 700 !important;
    right: 10px !important;
    top: 3px !important;
  };
`

const StyledParagraph = styled.p`
  font-size: 8pt !important;
  color: gray !important;
  text-align: justify !important;
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
      loanOriginationPercentage: 1,
      closingCostPercentage: 1,
      taxRatePercentage: .84,
      propertyMgmtPercentage: 6,
      propertyMgmtPerUnit: 100,
      monthlyPayment: 1816.92,
      insurancePerUnit: 50,
      utilitiesPerUnit: 55,
      rentPerUnit: 1900,
      rehab: 25000,
      rentPerUnitRehab: 3000,
      mgmtRadio: 'propertyMgmtPercentage',
      rehabRadio: 'before'
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.monthlyPayment = this.monthlyPayment.bind(this);
    this.isInt = this.isInt.bind(this);
    this.handleRadioButtonChange = this.handleRadioButtonChange.bind(this);
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    }, () => {
      if (name === 'downPayment') {
        this.setState({ downPaymentPercentage: this.isInt(100 * (this.state.downPayment / this.state.purchasePrice)) });
      };
      if (name === 'downPaymentPercentage' || name === 'purchasePrice') {
        this.setState({ downPayment: this.isInt(this.state.purchasePrice * (this.state.downPaymentPercentage / 100)) });
      };
    });
  };

  handleRadioButtonChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
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
    const num = Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2);
    return num % 1 === 0 ? Math.floor(num) : num;
  };

  render() {
    let loanAmount = this.state.purchasePrice - this.state.downPayment;
    let payment = this.monthlyPayment(
      (this.state.interestRate / 100) / 12,
      this.state.loanTermYears * 12,
      (-1 * this.state.purchasePrice) * (1 - (this.state.downPaymentPercentage / 100))
    );
    let loanOrigination = loanAmount * (this.state.loanOriginationPercentage / 100);
    let closingCost = this.state.purchasePrice * (this.state.closingCostPercentage / 100);
    let monthlyTax = (this.state.taxRatePercentage / 100) * this.state.purchasePrice / 12;
    let totalRent = this.state.rentPerUnit * this.state.numUnits;
    let totalRentRehab = this.state.rentPerUnitRehab * this.state.numUnits;
    let rent = this.state.rehabRadio === 'before' ? totalRent : totalRentRehab;
    let totalInsurance = this.state.insurancePerUnit * this.state.numUnits;
    let totalUtilities = this.state.utilitiesPerUnit * this.state.numUnits;
    let totalBeforeIncome = this.state.numUnits * this.state.rentPerUnit;
    let totalAfterIncome = this.state.numUnits * this.state.rentPerUnitRehab;
    let income = this.state.rehabRadio === 'before' ? totalBeforeIncome : totalAfterIncome;
    let propertyMgmtFee = (this.state.propertyMgmtPercentage / 100) * income;
    let propertyMgmtTotal = this.state.propertyMgmtPerUnit * this.state.numUnits;
    let propertyMgmtFeeAmt = this.state.mgmtRadio === 'propertyMgmtPercentage' ? propertyMgmtFee : propertyMgmtTotal;
    let vacancyMaintenance = income * .05;
    let operatingExpenses = monthlyTax + totalInsurance + propertyMgmtFeeAmt + totalUtilities + (2 * vacancyMaintenance);
    let monthlyExpense = operatingExpenses + payment;
    let netIncome = rent - monthlyExpense;
    let turnKeyCost = parseFloat(this.state.downPayment) + loanOrigination + closingCost;
    let cashOnCashReturn = this.state.rehabRadio === 'before' ? netIncome * 12 / turnKeyCost * 100 : (netIncome * 12 / (turnKeyCost + parseFloat(this.state.rehab))) * 100;
    let capRate = (rent - operatingExpenses) * 12 / this.state.purchasePrice * 100;


    return (
      <Container display='flex' direction='column' width='max-content'>
        <center>
          <h2>Cashflow Calculator</h2>
        </center>
        <Container display='flex' direction='row'>
          <Container display='flex' direction='column' width='500px' padding='10px' border='1px solid lightgray'>
            <Container display='flex' direction='row' width='100%' justify='space-between'>
              <Container width='225px'>
                <form>

                  <Container display='flex' direction='column' margin='0px 0px 0px 0px'>
                    <label>Purchase Price</label>
                    <DollarPrefix>
                      <StyledInput paddingLeft='25px' width='100%' name='purchasePrice' type='number' value={this.state.purchasePrice} onChange={this.handleInputChange}></StyledInput>
                    </DollarPrefix>
                  </Container>

                  <Container display='flex' direction='column' margin='0px 0px 0px 0px' width='100%'>
                    <label>Down Payment</label>
                    <Container display='flex' justify='space-between'>
                      <DollarPrefix width='55%'>
                        <StyledInput width='100%' paddingLeft='25px' name='downPayment' type='number' value={this.state.downPayment} onChange={this.handleInputChange}></StyledInput>
                      </DollarPrefix>
                      <PercentSuffix width='40%'>
                        <StyledInput width='100%' name='downPaymentPercentage' type='number' value={this.state.downPaymentPercentage} onChange={this.handleInputChange}></StyledInput>
                      </PercentSuffix>
                    </Container>
                  </Container>

                  <Container display='flex' direction='column' margin='0px 0px 0px 0px'>
                    <label>Loan Amount</label>
                    <DollarPrefix>
                      <StyledInput className='readOnly' readOnly paddingLeft='25px' width='100%' name='loanAmount' type='number' value={this.isInt(loanAmount)}></StyledInput>
                    </DollarPrefix>
                  </Container>

                  <Container display='flex' direction='column' margin='0px 0px 0px 0px'>
                    <label>Loan Term (Years)</label>
                    <StyledInput width='40%' name='loanTermYears' type='number' value={this.state.loanTermYears} onChange={this.handleInputChange}></StyledInput>
                  </Container>

                  <Container display='flex' direction='column' margin='0px 0px 0px 0px'>
                    <label>Interest Rate</label>
                    <PercentSuffix width='40%'>
                      <StyledInput width='100%' name='interestRate' type='number' value={this.state.interestRate} onChange={this.handleInputChange}></StyledInput>
                    </PercentSuffix>
                  </Container>

                  <Container display='flex' direction='column' margin='0px 0px 0px 0px'>
                    <label>Tax Rate</label>
                    <PercentSuffix width='40%'>
                      <StyledInput width='100%' name='taxRatePercentage' type='number' value={this.state.taxRatePercentage} onChange={this.handleInputChange}></StyledInput>
                    </PercentSuffix>
                  </Container>

                  <Container display='flex' direction='column' margin='0px 0px 0px 0px'>
                    <label>Property Tax</label>
                    <DollarPrefix>
                      <StyledInput className='readOnly' readOnly width='100%' paddingLeft='25px' name='monthlyTax' type='number' value={this.isInt(monthlyTax)}></StyledInput>
                    </DollarPrefix>
                  </Container>

                  <Container display='flex' direction='column' margin='0px 0px 0px 0px' width='100%'>
                    <label>Loan Origination Fee</label>
                    <Container display='flex' justify='space-between'>
                      <DollarPrefix width='55%'>
                        <StyledInput className='readOnly' readOnly width='100%' paddingLeft='25px' name='loanOriginationFee' type='number' value={this.isInt(loanOrigination)}></StyledInput>
                      </DollarPrefix>
                      <PercentSuffix width='40%'>
                        <StyledInput width='100%' name='loanOriginationPercentage' type='number' value={this.state.loanOriginationPercentage} onChange={this.handleInputChange}></StyledInput>
                      </PercentSuffix>
                    </Container>
                  </Container>

                  <Container display='flex' direction='column' margin='0px 0px 0px 0px' width='100%'>
                    <label>Closing Cost</label>
                    <Container display='flex' justify='space-between'>
                      <DollarPrefix width='55%'>
                        <StyledInput className='readOnly' readOnly width='100%' paddingLeft='25px' name='closingCost' type='number' value={this.isInt(closingCost)}></StyledInput>
                      </DollarPrefix>
                      <PercentSuffix width='40%'>
                        <StyledInput width='100%' name='closingCostPercentage' type='number' value={this.state.closingCostPercentage} onChange={this.handleInputChange}></StyledInput>
                      </PercentSuffix>
                    </Container>
                  </Container>

                  <Container display='flex' direction='column' margin='0px 0px 0px 0px'>
                    <label>Debt Service</label>
                    <DollarPrefix>
                      <StyledInput className='readOnly' readOnly paddingLeft='25px' width='100%' name='monthlyPayment' type='number' value={this.isInt(payment)}></StyledInput>
                    </DollarPrefix>
                  </Container>

                </form>
              </Container>
              <Container width='225px'>
                <form>

                  <Container display='flex' direction='column' margin='0px 0px 0px 0px'>
                    <label>Turn-Key Cost</label>
                    <DollarPrefix>
                      <StyledInput className='readOnly' readOnly width='100%' paddingLeft='25px' name='turnKeyCost' type='number' value={this.isInt(turnKeyCost)}></StyledInput>
                    </DollarPrefix>
                  </Container>

                  <Container display='flex' direction='column' margin='0px 0px 0px 0px'>
                    <label>Number of Units</label>
                    <StyledInput width='40%' name='numUnits' type='number' value={this.state.numUnits} onChange={this.handleInputChange}></StyledInput>
                  </Container>

                  <Container display='flex' direction='column' margin='0px 0px 0px 0px' width='100%'>
                    <Container display='flex' justify='space-between'>
                      <Container width='55%'>
                        <label>Total Rent</label>
                        <DollarPrefix width='100%'>
                          <StyledInput className='readOnly' readOnly width='100%' paddingLeft='25px' name='totalRent' type='number' value={this.isInt(totalRent)}></StyledInput>
                        </DollarPrefix>
                      </Container>
                      <Container width='40%'>
                        <label>Per Unit</label>
                        <DollarPrefix width='100%'>
                          <StyledInput width='100%' name='rentPerUnit' paddingLeft='25px' type='number' value={this.state.rentPerUnit} onChange={this.handleInputChange}></StyledInput>
                        </DollarPrefix>
                      </Container>
                    </Container>
                  </Container>

                  <Container display='flex' direction='row' width='100%' margin='0px 0px 0px 0px'>

                    <Container>
                      <StyledInput className='radio' type='radio' name='mgmtRadio' value='propertyMgmtPercentage' checked={this.state.mgmtRadio === 'propertyMgmtPercentage'} onChange={this.handleRadioButtonChange}></StyledInput>
                    </Container>

                    <Container display='flex' direction='column' width='100%' margin='0 0 0 10px'>
                      <label>Property Mgmt by %</label>
                      <Container display='flex' justify='space-between'>
                        <DollarPrefix width='55%'>
                          <StyledInput className='readOnly' readOnly width='100%' paddingLeft='25px' name='propertyMgmtFee' type='number' value={this.isInt(propertyMgmtFee)}></StyledInput>
                        </DollarPrefix>
                        <PercentSuffix width='40%'>
                          <StyledInput width='100%' name='propertyMgmtPercentage' type='number' value={this.state.propertyMgmtPercentage} onChange={this.handleInputChange}></StyledInput>
                        </PercentSuffix>
                      </Container>
                    </Container>

                  </Container>

                  <Container display='flex' direction='column' margin='0px 0px 0px 0px' width='100%'>
                    <Container display='flex' justify='space-between'>
                      <Container>
                        <StyledInput className='radio' type='radio' name='mgmtRadio' value='propertyMgmtTotal' checked={this.state.mgmtRadio === 'propertyMgmtTotal'} onChange={this.handleRadioButtonChange}></StyledInput>
                      </Container>
                      <Container width='100%' display='flex' direction='row' justify='space-between' margin='0 0 0 10px'>
                        <Container width='55%'>
                          <label>Total Mgmt</label>
                          <DollarPrefix width='100%'>
                            <StyledInput className='readOnly' readOnly width='100%' paddingLeft='25px' name='propertyMgmtTotal' type='number' value={this.isInt(propertyMgmtTotal)}></StyledInput>
                          </DollarPrefix>
                        </Container>
                        <Container width='40%'>
                          <label>Per Unit</label>
                          <DollarPrefix width='100%'>
                            <StyledInput width='100%' name='propertyMgmtPerUnit' paddingLeft='25px' type='number' value={this.state.propertyMgmtPerUnit} onChange={this.handleInputChange}></StyledInput>
                          </DollarPrefix>
                        </Container>
                      </Container>
                    </Container>
                  </Container>

                  <Container display='flex' direction='column' margin='0px 0px 0px 0px'>
                    <label>5% Vacancy</label>
                    <DollarPrefix>
                      <StyledInput className='readOnly' readOnly width='100%' paddingLeft='25px' name='fivePercentVacancy' type='number' value={this.isInt(vacancyMaintenance)}></StyledInput>
                    </DollarPrefix>
                  </Container>

                  <Container display='flex' direction='column' margin='0px 0px 0px 0px'>
                    <label>5% Maintenance</label>
                    <DollarPrefix>
                      <StyledInput className='readOnly' readOnly width='100%' paddingLeft='25px' name='fivePercentVacancy' type='number' value={this.isInt(vacancyMaintenance)}></StyledInput>
                    </DollarPrefix>
                  </Container>

                  <Container display='flex' direction='column' margin='0px 0px 0px 0px' width='100%'>
                    <Container display='flex' justify='space-between'>
                      <Container width='55%'>
                        <label>Total Insurance</label>
                        <DollarPrefix width='100%'>
                          <StyledInput className='readOnly' readOnly width='100%' paddingLeft='25px' name='totalInsurance' type='number' value={this.isInt(totalInsurance)}></StyledInput>
                        </DollarPrefix>
                      </Container>
                      <Container width='40%'>
                        <label>Per Unit</label>
                        <DollarPrefix width='100%'>
                          <StyledInput width='100%' name='insurancePerUnit' paddingLeft='25px' type='number' value={this.state.insurancePerUnit} onChange={this.handleInputChange}></StyledInput>
                        </DollarPrefix>
                      </Container>
                    </Container>
                  </Container>

                  <Container display='flex' direction='column' margin='0px 0px 0px 0px' width='100%'>
                    <Container display='flex' justify='space-between'>
                      <Container width='55%'>
                        <label>Total Utilities</label>
                        <DollarPrefix width='100%'>
                          <StyledInput className='readOnly' readOnly width='100%' paddingLeft='25px' name='totalUtilities' type='number' value={totalUtilities.toFixed(0)}></StyledInput>
                        </DollarPrefix>
                      </Container>
                      <Container width='40%'>
                        <label>Per Unit</label>
                        <DollarPrefix width='100%'>
                          <StyledInput width='100%' name='utilitiesPerUnit' paddingLeft='25px' type='number' value={this.state.utilitiesPerUnit} onChange={this.handleInputChange}></StyledInput>
                        </DollarPrefix>
                      </Container>
                    </Container>
                  </Container>

                  <Container display='flex' direction='column' margin='0px 0px 0px 0px'>
                    <label>Operating Expenses</label>
                    <DollarPrefix>
                      <StyledInput className='readOnly' readOnly width='100%' paddingLeft='25px' name='operatingExpenses' type='number' value={this.isInt(operatingExpenses)}></StyledInput>
                    </DollarPrefix>
                  </Container>

                </form>
              </Container>
            </Container>

          </Container>

          <Container margin='0 0 0 10px'>
            <Container display='flex' direction='column' width='500px' bgColor='#f0f0f0' padding='10px' border='1px solid lightgray'>
              <Container width='100%'>
                <span>Rehab Cost & ProForma Income</span>
              </Container>
              <Container display='flex' direction='row' width='100%' justify='space-between'>
                <Container width='225px'>
                  <Container display='flex' direction='column' margin='18px 0px 0px 0px'>
                    <label>Rehab</label>
                    <DollarPrefix>
                      <StyledInput paddingLeft='25px' width='100%' name='rehab' type='number' value={this.state.rehab} onChange={this.handleInputChange}></StyledInput>
                    </DollarPrefix>
                  </Container>
                </Container>
                <Container width='225px'>
                  <Container display='flex' direction='column' margin='18px 0px 0px 0px' width='100%'>
                    <Container display='flex' justify='space-between'>
                      <Container width='55%'>
                        <label>Total ProForma</label>
                        <DollarPrefix width='100%'>
                          <StyledInput className='readOnly' readOnly width='100%' paddingLeft='25px' name='totalRentRehab' type='number' value={this.isInt(totalRentRehab)}></StyledInput>
                        </DollarPrefix>
                      </Container>
                      <Container width='40%'>
                        <label>Per Unit</label>
                        <DollarPrefix width='100%'>
                          <StyledInput width='100%' name='rentPerUnitRehab' paddingLeft='25px' type='number' value={this.state.rentPerUnitRehab} onChange={this.handleInputChange}></StyledInput>
                        </DollarPrefix>
                      </Container>
                    </Container>
                  </Container>
                </Container>
              </Container>
            </Container>

            <Container bgColor='#f0f0f0' display='flex' direction='column' width='500px' padding='10px' border='1px solid lightgray' margin='10px 0 0 0'>
              <Container display='flex' direction='column'>
                <Container display='flex' direction='row'>
                  <Container>
                    <input className='radio' type='radio' name='rehabRadio' value='before' checked={this.state.rehabRadio === 'before'} onChange={this.handleRadioButtonChange}></input>
                  </Container>
                  <label>Before rehab</label>
                </Container>

                <Container display='flex' direction='row'>
                  <Container>
                    <input className='radio' type='radio' name='rehabRadio' value='after' checked={this.state.rehabRadio === 'after'} onChange={this.handleRadioButtonChange}></input>
                  </Container>
                  <label>After rehab</label>
                </Container>
              </Container>
              <Container display='flex' direction='row' width='500px' justify='space-between'>
                <Container width='225px'>
                  <Container display='flex' direction='column' margin='18px 0px 0px 0px'>
                    <label>Total Monthly Expense</label>
                    <DollarPrefix>
                      <StyledInput className='readOnly' readOnly width='100%' paddingLeft='25px' name='monthlyExpense' type='number' value={this.isInt(monthlyExpense)}></StyledInput>
                    </DollarPrefix>
                  </Container>

                  <Container display='flex' direction='column' margin='0px 0px 20px 0px'>
                    <label>Net Income</label>
                    <DollarPrefix>
                      <StyledInput className='readOnly' readOnly width='100%' paddingLeft='25px' name='netIncome' type='number' value={this.isInt(netIncome)}></StyledInput>
                    </DollarPrefix>
                  </Container>

                </Container>

                <Container width='225px'>

                  <Container display='flex' direction='column' margin='18px 0px 0px 0px'>
                    <label>CCR</label>
                    <PercentSuffix width='40%'>
                      <StyledInput className='readOnly' readOnly width='100%' name='cashOnCashReturn' type='number' value={this.isInt(cashOnCashReturn)}></StyledInput>
                    </PercentSuffix>
                  </Container>

                  <Container display='flex' direction='column' margin='0px 0px 0px 0px'>
                    <label>Cap Rate</label>
                    <PercentSuffix width='40%'>
                      <StyledInput className='readOnly' readOnly width='100%' name='capRate' type='number' value={this.isInt(capRate)}></StyledInput>
                    </PercentSuffix>
                  </Container>
                </Container>
              </Container>
              <StyledParagraph>
                COPYRIGHT ©2020 CHRIS RAUCH
              </StyledParagraph>
              <StyledParagraph>
                IN NO EVENT SHALL KAIZEN CAPITAL, LLC OR CHRIS RAUCH BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF KAIZEN CAPITAL, LCC OR CHRIS RAUCH HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
              </StyledParagraph>
              <StyledParagraph>
                KAIZEN CAPITAL, LLC AND CHRIS RAUCH SPECIFICALLY DISCLAIM ANY WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE SOFTWARE AND ACCOMPANYING DOCUMENTATION, IF ANY, PROVIDED HEREUNDER IS PROVIDED "AS IS". KAIZEN CAPITAL, LLC AND CHRIS RAUCH HAVE NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
              </StyledParagraph>
            </Container>
          </Container>
        </Container>
      </Container>
    )
  }
}

export default CalculatorBody; 