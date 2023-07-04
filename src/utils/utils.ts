export default class Utils {
  static getNumberFromCurrencyString({ currency }: { currency: string }) {
    return Number(currency.replace(/[^0-9.-]+/g, ""));
  }
}
