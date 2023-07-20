import { currentUser } from "@clerk/nextjs";
import { Prisma } from "@prisma/client";
import { parse } from "node-html-parser";
import { Job, scheduleJob } from "node-schedule";
import { prisma } from "../../app/api/_base";
import { AJIO_PRODUCT_ENDPOINT } from "../../config/constants";
import Utils from "../../utils/utils";
import { Product, Status, Store } from "../models/product_model";
import { Snapshot } from "../models/snapshot_model";
import EmailService from "../services/email_service";
import SnapshotRepository from "./snapshot_repository";

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
      root.querySelector("._396cs4._2amPTt._3qGmMb")?.getAttribute("src") ??
      root.querySelector("._2r_T1I._396QI4")?.getAttribute("src") ??
      "";

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
      const user = await currentUser();

      if (user === null) {
        throw new Error("Not authorized");
      }

      const res = await ProductRepository.getProductDetails({
        link,
        store,
      });

      if (res.status === false) {
        throw new Error(res.msg);
      }

      const payload: Omit<Product, "snapshots"> = {
        link,
        imageUrl: res.data!.imageUrl,
        name: res.data!.name,
        store,
        interval,
        orderedPrice,
        status: "RUNNING",
        userId: user.id,
      };

      const product = (await prisma.product.create({
        data: payload,
      })) as Product;

      const listenProductRes = await this.listenPriceChangeOnProduct(product);

      if (listenProductRes.status === false) {
        throw new Error(res.msg);
      }

      return { status: true };
    } catch (e: any) {
      let errorMessage = e.message;

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          const arr = e.meta?.target as any;
          errorMessage = `${Utils.capitalize({
            text: arr[0] ?? "",
          })} already exists`;
        }
      }

      return { status: false, msg: errorMessage };
    }
  }

  static async updateProduct({ id, data }: { id: number; data: any }) {
    try {
      let payload = data;

      if (data.link) {
        const res = await ProductRepository.getProductDetails({
          link: data.link,
          store: data.store,
        });

        if (res.status === false) {
          throw new Error(res.msg);
        }

        payload = {
          ...payload,
          ...res.data!,
        };
      }

      await prisma.product.update({
        where: {
          id,
        },
        data: payload,
      });

      return { status: true };
    } catch (e: any) {
      let errorMessage = e.message;

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          const arr = e.meta?.target as any;
          errorMessage = `${Utils.capitalize({
            text: arr[0] ?? "",
          })} already exists`;
        }
      }

      return { status: false, msg: errorMessage };
    }
  }

  static async fetchAllProducts(status?: Status) {
    try {
      const user = await currentUser();

      if (user === null) {
        throw new Error("Not authorized");
      }

      const res = await prisma.product.findMany({
        where: {
          status,
          userId: user.id,
        },
        include: {
          snapshots: true,
        },
      });

      return { status: true, data: res };
    } catch (e: any) {
      return { status: false, msg: e.message };
    }
  }

  static async fetchProduct({ id }: { id: string }) {
    try {
      const parsedId = parseInt(id);

      if (isNaN(parsedId)) {
        throw new Error("Bad request");
      }

      const res = await prisma.product.findUniqueOrThrow({
        where: {
          id: parsedId,
        },
      });

      return { status: true, data: res };
    } catch (e: any) {
      return { status: false, msg: e.message };
    }
  }

  static async getProductSnapshots(productId: number) {
    try {
      const snapshots = (await prisma.snapshot.findMany({
        where: {
          productId,
        },
      })) as Snapshot[];

      return { status: true, data: snapshots };
    } catch (e: any) {
      let errorMessage = e.message;

      if (e instanceof Prisma.PrismaClientValidationError) {
        errorMessage = "Invalid product id";
      }

      return { status: false, msg: errorMessage };
    }
  }

  static async deleteProduct(id: number) {
    try {
      await prisma.product.delete({
        where: {
          id,
        },
      });

      return { status: true };
    } catch (e: any) {
      let errorMessage = e.message;

      if (e instanceof Prisma.PrismaClientValidationError) {
        errorMessage = "Invalid product id";
      }

      return { status: false, msg: errorMessage };
    }
  }

  static async listenPriceChangeOnProduct(product: Product) {
    try {
      const job: Job = scheduleJob(
        `*/${product.interval} * * * * *`,
        function () {
          ProductRepository.runTask(product.id!, job);
        }
      );

      return { status: true };
    } catch (e: any) {
      return { status: false, msg: e.message };
    }
  }

  static async runTask(id: number, job: Job) {
    try {
      const product = (await prisma.product.findFirst({
        where: {
          id,
        },
      })) as Product;

      if (product.status === "PAUSED") {
        job.cancel();
        return;
      }

      const res = await ProductRepository.getProductPrice({
        link: product.link,
        store: product.store,
      });

      if (res.status) {
        const snapshot: Snapshot = {
          price: res.data!.price,
          productId: product.id!,
        };

        await SnapshotRepository.addSnapshot({ snapshot });

        if (res.data!.price < product.orderedPrice) {
          EmailService.sendProductPriceUpdateEmail({
            productLink: product.link,
            productName: product.name,
            storeName: Utils.capitalize({ text: product.store }),
            message: EmailService.generateProductUpdateEmailMessage({
              currentPrice: res.data!.price,
              orderedPrice: product.orderedPrice,
            }),
            toEmail: "mohamedsfn20@gmail.com",
          });
        }
      }
    } catch (e) {
      if (e instanceof Prisma.PrismaClientValidationError) {
        job.cancel();
      }

      throw e;
    }
  }
}
