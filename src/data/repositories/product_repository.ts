import { parse } from "node-html-parser";
import { AJIO_PRODUCT_ENDPOINT, STORE } from "../../config/constants";
import Utils from "../../utils/utils";

export default class ProductRepository {
  static async getProductPrice({
    link,
    store,
  }: {
    link: string;
    store: STORE;
  }) {
    try {
      let price = "";

      switch (store) {
        case STORE.FLIPKART:
          price = await this.getFlipkartProductPrice({ link });

          break;

        case STORE.AMAZON:
          price = await this.getAmazonProductPrice({ link });

          break;

        case STORE.AJIO:
          price = await this.getAjioProductPrice({ link });

          break;

        default:
          break;
      }

      if (price === "") {
        throw new Error("Failed to fetch the price of product");
      }

      const numberPrice = Utils.getNumberFromCurrencyString({
        currency: price,
      });

      return { status: true, data: numberPrice };
    } catch (e: any) {
      return { status: false, msg: e.message };
    }
  }

  static async getFlipkartProductPrice({ link }: { link: string }) {
    const res = await fetch(link);

    if (!res.ok) {
      throw new Error("Failed to fetch the product");
    }

    const html = await res.text();

    const root = parse(html);

    const currencyString =
      root.querySelector("._30jeq3._16Jk6d")?.textContent ?? "";

    return currencyString.replace("₹", "");
  }

  static async getAmazonProductPrice({ link }: { link: string }) {
    const res = await fetch(link);

    if (!res.ok) {
      throw new Error("Failed to fetch the product");
    }

    const html = await res.text();

    const root = parse(html);

    const currencyString =
      root.querySelector(".a-price-whole")?.textContent ?? "";

    return currencyString.replace(".", "");
  }

  static async getAjioProductPrice({ link }: { link: string }) {
    const productId = link.split("/").pop()!.split("?")[0];

    const res = await fetch(`${AJIO_PRODUCT_ENDPOINT}/${productId}`);

    if (!res.ok) {
      throw new Error("Failed to fetch the product");
    }

    const data = await res.json();

    const currencyString = data.price.displayformattedValue ?? "";

    return currencyString.replace("Rs. ", "");
  }
}
