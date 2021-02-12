import {
  render,
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import MortgageCalculator from "./MortgageCalculator";
import API from "../Api";

test("MortgageCalculator Princple Field", () => {
  render(<MortgageCalculator />);
  const principle = screen.getByTestId("mortgagePrinciple") as HTMLInputElement;
  // Expect - field to be empty
  expect(principle.value).toBe("");
  fireEvent.change(principle, { target: { value: "1000000" } });
  fireEvent.blur(principle);
  // Expect - field to be $1,000,000 when typed '1000000'
  expect(principle.value).toBe("$1,000,000.00");
  fireEvent.change(principle, { target: { value: "aa9999999a" } });
  fireEvent.blur(principle);
  // Expect - field to be $9,999,999 when typed 'aa9999999a'
  expect(principle.value).toBe("$9,999,999.00");
  fireEvent.change(principle, { target: { value: "" } });
  fireEvent.blur(principle);
  // Expect - field to be empty
  expect(principle.value).toBe("");
  // Expect - Error banner to be present
  expect(screen.getByTestId("errorBanner")).toBeDefined();
});

test("MortgageCalculator Rate Field", async () => {
  render(<MortgageCalculator />);
  const rate = screen.getByTestId("mortgageRate") as HTMLInputElement;
  // Expect - field to be empty
  expect(rate.value).toBe("");
  await waitFor(() => expect(rate.value).toBe("2.75%"));
  // Expect - field to be 2.75% by default
  expect(rate.value).toBe("2.75%");
  fireEvent.change(rate, { target: { value: "5.0" } });
  fireEvent.blur(rate);
  // Expect - field to be 5.0% when typed '5.0'
  expect(rate.value).toBe("5.00%");
  fireEvent.change(rate, { target: { value: "a9a.9" } });
  fireEvent.blur(rate);
  // Expect - field to be 9.9% when typed 'a9a.9'
  expect(rate.value).toBe("9.90%");
  fireEvent.change(rate, { target: { value: "" } });
  fireEvent.blur(rate);
  // Expect - field to be empty
  expect(rate.value).toBe("");
  // Expect - Error banner to be present
  expect(screen.getByTestId("errorBanner")).toBeDefined();
});

test("MortgageCalculator Term Field", () => {
  render(<MortgageCalculator />);
  const term = screen.getByTestId("mortgageTerm") as HTMLInputElement;
  // Expect - field to be on first selection
  expect(term.value).toBe("0");
  fireEvent.change(term, { target: { value: "10" } });
  // Expect - Selection to be on option 10 years
  expect(term.value).toBe("10");
  fireEvent.change(term, { target: { value: "50" } });
  // Expect - Selection to be on option 50 years
  expect(term.value).toBe("50");
});

test("MortgageCalculator Monthly Down Payment Amount Field", () => {
  render(<MortgageCalculator />);
  const amount = screen.getByTestId(
    "mortgageMonthlyDownPaymentAmount"
  ) as HTMLInputElement;
  // Expect - field to be empty
  expect(amount.value).toBe("");
  fireEvent.change(amount, { target: { value: "1000000" } });
  fireEvent.blur(amount);
  // Expect - field to be $1,000,000 when typed '1000000'
  expect(amount.value).toBe("$1,000,000.00");
  fireEvent.change(amount, { target: { value: "aaa99.9a" } });
  fireEvent.blur(amount);
  // Expect - field to be $99.9 when typed 'aaa99.9a'
  expect(amount.value).toBe("$99.90");
});

test("MortgageCalculator Monthly Down Payment Term Field", () => {
  render(<MortgageCalculator />);
  const term = screen.getByTestId(
    "mortgageMonthlyDownPaymentTerms"
  ) as HTMLInputElement;
  // Expect - field to be on first selection
  expect(term.value).toBe("0");
  fireEvent.change(term, { target: { value: "10" } });
  // Expect - Selection to be on option 10 months
  expect(term.value).toBe("10");
  fireEvent.change(term, { target: { value: "50" } });
  // Expect - Selection to be on option 50 months
  expect(term.value).toBe("50");
});

test("MortgageCalculator Monthly Payment Amount", async () => {
  // FORMULA TO CALCULATE THE MONTHLY PAYMENT
  const calculateAmount = (
    prcpl: number,
    rate: number,
    term: number,
    amount?: number,
    months?: number
  ) => {
    let principle = prcpl;
    const interest = (rate + 2.5) / 100 / 12;
    const terms = term * 12;
    if (amount && months) {
      principle -= amount * months;
    }
    return (
      (principle * interest * (1 + interest) ** terms) /
      ((1 + interest) ** terms - 1)
    );
  };

  // Mock interestRate API
  jest
    .spyOn(API, "interestRate")
    .mockImplementation(() => Promise.resolve({ rate: 2.75 }));

  render(<MortgageCalculator />);

  const term = screen.getByTestId("mortgageTerm") as HTMLInputElement;
  const rate = screen.getByTestId("mortgageRate") as HTMLInputElement;
  const principle = screen.getByTestId("mortgagePrinciple") as HTMLInputElement;
  const amount = screen.getByTestId(
    "mortgageMonthlyDownPaymentAmount"
  ) as HTMLInputElement;
  const monthlyTerm = screen.getByTestId(
    "mortgageMonthlyDownPaymentTerms"
  ) as HTMLInputElement;

  // Expect - field to be 2.75% by default
  await waitFor(() => expect(rate.value).toBe("2.75%"));

  fireEvent.change(principle, { target: { value: "1000000" } });
  fireEvent.blur(principle);
  // Expect - principle field to be $1,000,00
  await waitFor(() => expect(principle.value).toBe("$1,000,000.00"));

  fireEvent.change(term, { target: { value: "10" } });
  // Expect - term field to be 10 years
  await waitFor(() => expect(term.value).toBe("10"));

  fireEvent.change(rate, { target: { value: "5.0" } });
  fireEvent.blur(rate);
  // Expect - rate field to be 5.0%
  await waitFor(() => expect(rate.value).toBe("5.00%"));

  const payment1 = calculateAmount(1000000.0, 5.0, 10).toLocaleString(
    undefined,
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  );
  // Expect - calculated monthly payment to be present
  expect(screen.getByText(`$${payment1}`)).toBeDefined();

  fireEvent.change(amount, { target: { value: "100.00" } });
  fireEvent.blur(amount);
  // Expect - monthly downpayment amount field to be $100.00
  await waitFor(() => expect(amount.value).toBe("$100.00"));

  fireEvent.change(monthlyTerm, { target: { value: "12" } });
  // Expect - monthly downpayment terms field to be 12 months
  await waitFor(() => expect(monthlyTerm.value).toBe("12"));

  const payment2 = calculateAmount(
    1000000.0,
    5.0,
    10,
    100.0,
    12
  ).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  // Expect - calculated monthly payment to be present
  expect(screen.getByText(`$${payment2}`)).toBeDefined();

  fireEvent.click(screen.getByTestId("submitMortgage"));
  await waitForElementToBeRemoved(() => screen.getByText("$11,855.93"));

  // Expect - success screen to be present
  expect(
    screen.getByText(
      "Your Data has been submitted. Our rep will reach out to you shortly."
    )
  ).toBeDefined();
});
