import { parse } from "node-html-parser";
import { prisma } from "../../app/api/_base";
import { AJIO_PRODUCT_ENDPOINT } from "../../config/constants";
import Utils from "../../utils/utils";
import { Product, Store } from "../models/product_model";

export default class ProductRepository {
  static async getProductDetails({
    link,
    store,
  }: {
    link: string;
    store: string;
  }) {
    try {
      let productDetails = { name: "", imageUrl: "" };

      switch (store) {
        case "FLIPKART":
          productDetails = await this.getFlipkartProductDetails({ link });

          break;

        case "AMAZON":
          productDetails = await this.getAmazonProductDetails({ link });

          break;

        case "AJIO":
          productDetails = await this.getAjioProductDetails({ link });

          break;

        default:
          break;
      }

      if (productDetails.name === "") {
        throw new Error("Failed to fetch the details of product");
      }

      return { status: true, data: productDetails };
    } catch (e: any) {
      return { status: false, msg: e.message };
    }
  }

  static async getFlipkartProductDetails({ link }: { link: string }) {
    const res = await fetch(link);

    if (!res.ok) {
      throw new Error("Failed to fetch the product");
    }

    const html = await res.text();

    const root = parse(html);

    const name = root.querySelector(".B_NuCI")?.textContent ?? "";
    const imageUrl =
      root.querySelector("._396cs4._2amPTt._3qGmMb")?.getAttribute("src") ?? "";

    return { name, imageUrl };
  }

  static async getAmazonProductDetails({ link }: { link: string }) {
    const res = await fetch(link);

    if (!res.ok) {
      throw new Error("Failed to fetch the product");
    }

    const html = await res.text();

    const root = parse(html);

    const name = root.querySelector("#productTitle")?.textContent ?? "";
    const imageUrl =
      root.querySelector("#landingImage")?.getAttribute("src") ?? "";

    return { name, imageUrl };
  }

  static async getAjioProductDetails({ link }: { link: string }) {
    const productId = link.split("/").pop()!.split("?")[0];

    const res = await fetch(`${AJIO_PRODUCT_ENDPOINT}/${productId}`);

    if (!res.ok) {
      throw new Error("Failed to fetch the product");
    }

    const data = await res.json();

    const name = data.baseOptions[0].options[0].modelImage.altText ?? "";
    const imageUrl = data.baseOptions[0].options[0].modelImage.url ?? "";

    return { name, imageUrl };
  }

  static async getProductPrice({
    link,
    store,
  }: {
    link: string;
    store: string;
  }) {
    try {
      let price = "";

      switch (store) {
        case "FLIPKART":
          price = await this.getFlipkartProductPrice({ link });

          break;

        case "AMAZON":
          price = await this.getAmazonProductPrice({ link });

          break;

        case "AJIO":
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

      return { status: true, data: { price: numberPrice } };
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

  static async addProduct({
    link,
    store,
    interval,
    orderedPrice,
  }: {
    link: string;
    store: Store;
    interval: number;
    orderedPrice: number;
  }) {
    try {
      const res = await ProductRepository.getProductDetails({
        link,
        store,
      });

      if (res.status === false) {
        throw new Error(res.msg);
      }

      const payload: Product = {
        link,
        imageUrl: res.data!.imageUrl,
        name: res.data!.name,
        store,
        interval,
        orderedPrice,
        status: "RUNNING",
      };

      await prisma.product.create({
        data: payload,
      });

      return { status: true };
    } catch (e: any) {
      return { status: false, msg: e.message };
    }
  }

  static async updateProduct({ id, data }: { id: number; data: object }) {
    try {
      const payload: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (key === "id") {
          continue;
        }

        if (value === undefined) {
          continue;
        }

        payload[key] = value;
      }

      await prisma.product.update({
        where: {
          id,
        },
        data: payload,
      });

      return { status: true };
    } catch (e: any) {
      return { status: false, msg: e.message };
    }
  }
}
