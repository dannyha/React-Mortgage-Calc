import React, { useReducer, useEffect } from "react";
import API from '../Api';
import Header from '../components/Header';
import Body from '../components/Body';
import Banner from '../components/Banner';
import Card from '../components/Card';
import Disclaimer from '../components/Disclaimer';
import Button from '../components/Button';
import InputNumbers from '../components/InputNumbers';

/**
 * Application State
 */
type Mortgage = {
  rate: string | undefined;
  principle: string | undefined;
  term: number;
  monthlyAmount?: string | undefined;
  monthlyTotal?: number;
};

type State = {
  mortgageData: Mortgage;
  calculated: number;
  success: boolean;
  submitted: boolean;
  error: string;
};

const initialState = {
  mortgageData: {
    rate: undefined,
    principle: undefined,
    term: 0,
    monthlyAmount: undefined,
    monthlyTotal: 0
  },
  success: false,
  submitted: false,
  calculated: 0,
  error: ""
};

type Action =
  | { type: "setMortgage"; payload: State['mortgageData'] }
  | { type: "setMonthly"; payload: State['calculated'] }
  | { type: "setSuccess"; payload: State['success'] }
  | { type: "setSubmitted"; payload: State['submitted'] }
  | { type: "setError"; payload: State['error'] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "setMortgage":
      return {
        ...state,
        mortgageData: action.payload,
        success: false,
        error: ""
      };
    case "setMonthly":
      return {
        ...state,
        calculated: action.payload,
        success: true
      };
    case "setSuccess":
      return {
        ...state,
        success: action.payload
      };
    case "setSubmitted":
      return {
        ...state,
        success: false,
        submitted: action.payload
      };
    case "setError":
      return {
        ...state,
        error: action.payload
      };
    default:
      throw new Error();
  }
}

/**
 * Mortgage Calculator
 */
function MortgageCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const mortgateTerms = [10, 15, 20, 30, 50];
  const monthlyTerms = Array.from(Array((12*5+1)).keys());
  const showBannerAutoTimer: number = 5000;
  let showBannerTerms: number;

  //Initial load - retrieves default mortgage rate from API
  useEffect(() => {
    API.interestRate()
    .then((res) => {
      dispatch({type: 'setMortgage', payload: {...state.mortgageData, rate: `${res.rate.toString()}%`}});
    })
    .catch((err) => {
      dispatch({type: 'setError', payload: "Error retrieving interest rate!"});
    });
    return () => {
      dispatch({type: 'setMortgage', payload: {...initialState.mortgageData}});
    };
  }, []);

  //Watches state for changes to mortgageData
  useEffect(() => {
    if (!formValidate() && 
      state.mortgageData.principle &&
      getFloat(state.mortgageData.principle) > 0 &&
      state.mortgageData.rate && 
      getFloat(state.mortgageData.rate) > 0 &&
      state.mortgageData.term > 0) {
        calculateAmount(getFloat(state.mortgageData.principle), getFloat(state.mortgageData.rate), state.mortgageData.term);
      }
  }, [state.mortgageData]);

  //Update state values
  const checkData = (elem: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = (elem.target.value) ? getFloat(elem.target.value).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : elem.target.value;
    if (value !== undefined) {
      dispatch({type: 'setMortgage', payload: {...state.mortgageData, [field]: value}});
    }
  }

  //Form validation rules
  const formValidate = () => {
    let error = false;

    if (state.mortgageData.principle === "") {
      error = true;
      dispatch({type: 'setError', payload: "Please enter the home amount."});
    } else if (state.mortgageData.rate === "") {
      error = true;
      dispatch({type: 'setError', payload: "Please enter the interest rate."});
    } else if (state.mortgageData.term === 0 && state.mortgageData.principle && state.mortgageData.rate) {
      error = true;
      showBannerTerms = window.setTimeout(() => {
        dispatch({type: 'setError', payload: "Don't forget to select a payment term."});
      }, showBannerAutoTimer);
    }

    return error;
  }

  //Mortgage Calculation Formula
  const calculateAmount = (principle: number, rate: number, term: number) => {
    let amount : number = principle;
    const interest : number = (+rate + 2.5) / 100 / 12;
    const terms : number = +term * 12;
    const downpaymentAmount = state.mortgageData.monthlyAmount ? getFloat(state.mortgageData.monthlyAmount) : '';
    const downpaymentTerms = state.mortgageData.monthlyTotal ? state.mortgageData.monthlyTotal : '';
    if (downpaymentAmount && downpaymentTerms) {
      amount -= (downpaymentAmount * downpaymentTerms);
    }
    const payment = amount * interest * (Math.pow(1 + interest, terms)) / (Math.pow(1 + interest, terms) - 1);
    dispatch({type: 'setMonthly', payload: payment});

    return payment;
  }

  //Form submission
  const processData = () => {
    API.mortgageData(state.mortgageData)
    .then((res) => {
      dispatch({type: 'setSubmitted', payload: true});
    })
    .catch((err) => {
      dispatch({type: 'setError', payload: "Error retrieving interest rate!"});
    })
  }

  //Get float value helper
  const getFloat = (value: string) => {
    return parseFloat(value.replace(/\$/g,'').replace(/\%/g,'').replace(/\,/g,''));
  }

  //Clear timeout helper
  const clearBanner = (variable: number) => {
    clearTimeout(variable);
  }

  return (
    <React.Fragment>

      <Header />

      {state.error &&
        <Banner
          id="errorBanner"
          classes="alert-banner alert"
          text={state.error}
          icon={true}></Banner>
      }

      {state.calculated > 0 && state.success &&
        <Banner
          id="successBanner"
          classes="success-banner success"
          text="Your mortgage payment calculation is ready below."
          icon={false}></Banner>
      }

      <Body>
        {!state.submitted  
          ? (<React.Fragment>
              <div className="row justify-content-center pb-4">
                <form className="form col col-md-6">

                  <div data-qa="page-title" className="row justify-content-center">
                    <div className="col">
                      <div className="title-text h3 text-center">Ready to get a mortgage? Let's find out your monthly payment.</div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col form-group">
                      <InputNumbers
                        error={state.mortgageData.principle === ''}
                        placeholder="Home Amount (ex. $100,000.00)*"
                        id="mortgagePrinciple"
                        value={state.mortgageData.principle}
                        handler={(evt) => checkData(evt, 'principle')}
                        required={true}
                        prefix="$"></InputNumbers>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col form-group">
                      <select 
                        data-testid="mortgageTerm"
                        id="mortgageTerm" 
                        className={`form-control mb-4 fs-exclude ${state.mortgageData.principle && state.mortgageData.rate && state.mortgageData.term === 0 ? 'error' : ''}`}  
                        aria-required="true" 
                        value={state.mortgageData.term}
                        onFocus={() => clearBanner(showBannerTerms)} 
                        onChange={(event) => dispatch({type: 'setMortgage', payload: {...state.mortgageData, term: parseFloat(event.target.value)}})}>
                          <option value="0" disabled>Payment period [10, 15, 20, 30, 50] years*</option>
                          {mortgateTerms && mortgateTerms.map((term, key) => 
                            <option value={term} key={key}>{term} years</option>
                          )}
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col form-group">
                      <InputNumbers
                        placeholder="Interest Rate (ex. 2.75%)*"
                        id="mortgageRate"
                        value={state.mortgageData.rate}
                        handler={(evt) => checkData(evt, 'rate')}
                        required={true}
                        error={state.mortgageData.rate === ''}
                        suffix="%"
                        limit={2}></InputNumbers>
                    </div>
                  </div>

                  <hr />
                  
                  <div data-qa="page-title" className="row justify-content-center">
                    <div className="col">
                      <div className="title-text h4 text-center">Did you know that you can save money by putting a down payment. See how much your monthly payment will decrease.</div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col form-group">
                      <InputNumbers
                        placeholder="Monthly Down Payment (ex. $100.00)"
                        id="mortgageMonthlyDownPaymentAmount"
                        value={state.mortgageData.monthlyAmount}
                        handler={(evt) => checkData(evt, 'monthlyAmount')}
                        required={false}
                        prefix="$"></InputNumbers>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col form-group">
                      <select
                        data-testid="mortgageMonthlyDownPaymentTerms"
                        id="mortgageMonthlyDownPaymentTerms" 
                        className="form-control mb-4 fs-exclude" 
                        value={state.mortgageData.monthlyTotal} 
                        onChange={(event) => dispatch({type: 'setMortgage', payload: {...state.mortgageData, monthlyTotal: parseFloat(event.target.value)}})}>
                          {monthlyTerms && monthlyTerms.map((term, key) => 
                            (term === 0) ? <option value="0" key={key} disabled>Total months of savings [ex. 1 month to 5 years]</option> : <option value={term}key={key}>{term} months</option>
                          )}
                      </select>
                    </div>
                  </div>

                  <hr />

                  <div className="row mt-5">
                    <div className="col">
                      <Card
                        id="mortgagePayment"
                        title="Your Monthly Payment"
                        body={state.calculated === 0 ? '???' : `\$${state.calculated.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
                      />
                    </div>
                  </div>
                </form>
              </div>

              <Disclaimer
                text="Continue to find out how to obtain this mortgage."></Disclaimer>

              <div className="row justify-content-center">
                <Button
                  id="submitMortgage"
                  text="Continue"
                  disabled={!state.calculated}
                  handler={processData}
                  classes="continue"></Button>
              </div>
            </React.Fragment>)
          : <div data-qa="page-title" className="row justify-content-center">
              <div className="col">
                <div className="title-text h3 text-center" data-testid="morgtageSuccessMessage">Your Data has been submitted. Our rep will reach out to you shortly.</div>
              </div>
            </div>
        }

      </Body>

    </React.Fragment>
  );
}

export default MortgageCalculator;