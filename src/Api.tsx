export interface InterestRate {
  rate: number;
}

export interface MortgageDataSuccess {
  success: boolean;
}

async function wait(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

const API = {
  /**
   * Returns a list of all employees in the system.
   */
  async interestRate(): Promise<InterestRate> {
    await wait(1000);
    return Promise.resolve({
      rate: 2.75
    });
  },
  /**
   * Returns a list of all jobs in the system.
   */
  async mortgageData(data: any): Promise<MortgageDataSuccess> {
    await wait(1000);
    return Promise.resolve({
      success: true
    });
  }
};

export default API;