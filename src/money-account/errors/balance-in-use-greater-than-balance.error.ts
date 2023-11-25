export class BalanceInUseGreaterThanBalanceException extends Error {
  constructor(balanceInUse: number, balance: number) {
    const message = `After doing this operation balanceInUse: ${balanceInUse} will be greater than balance: ${balance}`;
    super(message);
    this.name = 'BalanceInUseGreaterThanBalanceException';
  }
}
