export default class Utils {
  static getNumberFromCurrencyString({ currency }: { currency: string }) {
    return Number(currency.replace(/[^0-9.-]+/g, ""));
  }

  static capitalize({ text }: { text: string }) {
    return text.charAt(0).toUpperCase() + text.toLowerCase().slice(1);
  }
}
