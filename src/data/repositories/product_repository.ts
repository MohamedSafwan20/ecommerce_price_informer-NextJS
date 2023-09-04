import { currentUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import { Prisma } from "@prisma/client";
import axios from "axios";
import { parse } from "node-html-parser";
import { prisma } from "../../app/api/_base";
import {
  AJIO_PRODUCT_ENDPOINT,
  CRON_JOB_API_URL,
  PRODUCT_LISTEN_ENDPOINT,
} from "../../config/constants";
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

  static async addProduct(
    {
      link,
      store,
      interval,
      orderedPrice,
    }: {
      link: string;
      store: Store;
      interval: number;
      orderedPrice: number;
    },
    hostUrl: string
  ) {
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
        cronJobId: 0,
        lastCheckedPrice: orderedPrice,
      };

      const product = await prisma.product.create({
        data: payload,
      });

      const cronJobRes = await this.createProductPriceListeningCronJob({
        hostUrl,
        interval,
        productId: product.id,
        user,
      });

      if (cronJobRes.status === false) {
        throw new Error(cronJobRes.msg);
      }

      const updatePayload = {
        cronJobId: cronJobRes.data.jobId,
      };

      await prisma.product.update({
        where: {
          id: product.id,
        },
        data: updatePayload,
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

      const product = await prisma.product.update({
        where: {
          id,
        },
        data: payload,
      });

      if (data.status !== undefined && data.status !== null) {
        await this.updateProductPriceListeningCronJob({
          jobId: product.cronJobId,
          enabled: data.status === "RUNNING",
        });
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
      const product = await prisma.product.delete({
        where: {
          id,
        },
      });

      await axios.delete(`${CRON_JOB_API_URL}/jobs/${product.cronJobId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CRON_JOB_API_KEY}`,
        },
        validateStatus(status) {
          return status === 200 || status === 404;
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

  static async createProductPriceListeningCronJob({
    hostUrl,
    interval,
    productId,
    user,
  }: {
    hostUrl: string;
    interval: number;
    productId: number;
    user: User;
  }) {
    try {
      const intervalArray = [];
      for (let i = 0; i <= 59; i += interval) {
        intervalArray.push(i);
      }

      const payload = {
        job: {
          url: `${
            process.env.NODE_ENV === "development" ? "http" : "https"
          }://${hostUrl}${PRODUCT_LISTEN_ENDPOINT}`,
          enabled: "true",
          saveResponses: true,
          schedule: {
            timezone: "Asia/Kolkata",
            expiresAt: 0,
            hours: [-1],
            mdays: [-1],
            minutes: intervalArray,
            months: [-1],
            wdays: [-1],
          },
          requestMethod: 1,
          extendedData: {
            body: JSON.stringify({
              id: productId,
              userEmail: user.emailAddresses[0].emailAddress,
            }),
          },
        },
      };

      const res = await axios.put(`${CRON_JOB_API_URL}/jobs`, payload, {
        headers: {
          Authorization: `Bearer ${process.env.CRON_JOB_API_KEY}`,
        },
      });

      return { status: true, data: res.data };
    } catch (e: any) {
      return { status: false, msg: e.message };
    }
  }

  static async updateProductPriceListeningCronJob({
    jobId,
    enabled,
  }: {
    jobId: number;
    enabled: boolean;
  }) {
    try {
      const payload = { job: { enabled } };

      await axios.patch(`${CRON_JOB_API_URL}/jobs/${jobId}`, payload, {
        headers: {
          Authorization: `Bearer ${process.env.CRON_JOB_API_KEY}`,
        },
      });

      return { status: true };
    } catch (e: any) {
      return { status: false, msg: e.message };
    }
  }

  static async listenPriceChangeOnProduct({
    product,
    userEmail,
  }: {
    product: Product;
    userEmail: string;
  }) {
    try {
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
          const emailRes = await EmailService.sendProductPriceUpdateEmail({
            productLink: product.link,
            productName: product.name,
            storeName: Utils.capitalize({ text: product.store }),
            message: EmailService.generateProductUpdateEmailMessage({
              currentPrice: res.data!.price,
              orderedPrice: product.orderedPrice,
            }),
            toEmail: userEmail,
          });

          if (emailRes.status) {
            await prisma.product.update({
              where: {
                id: product.id,
              },
              data: {
                lastCheckedPrice: res.data!.price,
              },
            });
          }
        }
      }

      return { status: true };
    } catch (e: any) {
      return { status: false, msg: e.message };
    }
  }
}
